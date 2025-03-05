// Import k6 modules such as http and others
import http from 'k6/http';
import { check, sleep } from 'k6';

// Base URL
const BASE_URL = 'https://stageganamovil.bg.com.bo';

// Configure the test execution defining VUs, test duration, performance thresholds
export let options = {
    scenarios: {
        custom_load_test: {
            executor: 'ramping-arrival-rate',
            stages: [
                { duration: '5s', target: 2 },
                { duration: '20s', target: 2 },
                { duration: '5s', target: 4 },
                { duration: '20s', target: 4 },
                { duration: '5s', target: 6 },
                { duration: '20s', target: 6 },
                { duration: '5s', target: 8 },
                { duration: '20s', target: 8 },
                { duration: '5s', target: 0 },
            ],
            preAllocatedVUs: 50,
            maxVUs: 100,
        },
    },
    thresholds: {
        checks: ['rate>0.99'], // 90% of the checks must passed
        http_req_duration: ['p(95) < 100'], // 95% of requests must be under 100ms
        http_req_failed: ['rate>0.05'], // Only 1% of requests failed are acepted
    }
};

// This function runs ONCE before the test starts
export function setup() {
    let loginResponse = http.post(`${BASE_URL}/authService/100000002/login`, '', {
        headers: {
            'accept': 'application/json',
            'content-type': 'application/x-www-form-urlencoded',
            'origin': BASE_URL,
            'referer': `${BASE_URL}/apps/GanaNet/`,
            'x-kony-app-key': 'c45151c6885be448ad963025a75fbc3d',
            'x-kony-app-secret': '1acd65eb8d06f57394c38d528ed95834',
            'x-kony-app-version': '1.0',
            'x-kony-platform-type': 'windows'
        }
    });

    let token;
    if (loginResponse.status === 200) {
        token = loginResponse.json().refresh_token;
    } else {
        console.error(`Login failed: ${loginResponse.status} - ${loginResponse.body}`);
        return null; // Stop execution if login fails
    }

    return token; // Return the token to use in the main function
}

// This function runs multiple times with virtual users
export default function (token) {
    if (!token) {
        console.error('No token received. Skipping test.');
        return;
    }

    // Step 2: Validate user using the refresh token
    let res = http.post(`${BASE_URL}/services/AutSeguridad/validarUsuario`,
        JSON.stringify({
            strUsuario: '44970',
            strTokenCaptcha: 'your-captcha-value',
            strTipoUsuario: 'CODIGO_PERSONA',
            intCodAplicacion: 1,
            intCodIdioma: 1,
            appID: 'GanaNet',
            appver: '1.1.2',
            channel: 'wap',
            platform: 'thinclient',
            cacheid: ''
        }),
        {
            headers: {
                'accept': '*/*',
                'content-type': 'application/json',
                'origin': BASE_URL,
                'referer': `${BASE_URL}/apps/GanaNet/`,
                'x-kony-api-version': '1.0',
                'x-kony-authorization': `Bearer ${token}`, // Token is reused
                'x-kony-deviceid': 'F2913A67-3333-4156-BB73-87803FECB3ED'
            }
        }
    );

    let checkStatus = check(res, {
        'status es 200': (r) => r.status === 200,
        'tiempo de respuesta < 500ms': (r) => r.timings.duration < 500,
        'Response contains "Estimado"': (r) => r.body.includes('Estimado'),
        'CodigoError is COD002': (r) => r.json().codigoError === 'COD002',
        'HTTP Status Code is 200': (r) => r.json().httpStatusCode === 200,
        'Opstatus is 0': (r) => r.json().opstatus === 0,
      });

    if (!checkStatus) {
        let errorLog = {
            time: new Date().toString(),
            method: res.request.method,
            url: res.request.url,
            status: res.status,
            responseTime: res.timings.duration,
            responseBody: JSON.parse(res.body)
        }
        console.error(JSON.stringify(errorLog,null,2));
        // **Mark test as failed**
        //fail();
    }

    sleep(1); // Simulate user wait time
}
