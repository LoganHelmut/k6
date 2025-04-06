// Import k6 modules such as http and others
import http from 'k6/http';
import { check, sleep } from 'k6';

// Configure the test execution defining VUs, test duration, performance thresholds
export const options = {
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
        checks: ['rate>0.90'], // 90% of the checks must passed
        http_req_duration: ['p(95) < 100'], // 95% of requests must be under 100ms
        http_req_failed: ['rate>0.05'], // Only 5% of requests failed are acepted
    }
};

// This is where the test logic resides.
export default function () {
    let res = http.get('https://jsonplaceholder.typicode.com/posts/1');

    let checkStatus = check(res, {
      'status es 200': (r) => r.status === 200,
      'tiempo de respuesta < 80ms': (r) => r.timings.duration < 100,
      'Response contains "quia"': (r) => r.body.includes('quia'),
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
        fail();
    }

    sleep(1); // Simula el comportamiento real del usuario
}