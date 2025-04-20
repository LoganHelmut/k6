# k6
Base Project

# Install k6 https://grafana.com/docs/k6/latest/set-up/install-k6/
choco install k6 

# Run stress test and see all logs in console
k6 run basic_stress.js


# Run stress test and see all logs in csv
k6 run basic_stress.js 2> erros.csv



# Install grafana with docker
docker run -d --name=grafana -p 3000:3000 grafana/grafana
docker start grafana

# Install influxdb with docker
docker run -d --name=influxdb -p 8086:8086 influxdb:1.8
docker start influxdb
docker exec -it influxdb influx
create database k6
show databases
use k6
show measurements
select * from http_req_sending limit 10

# Configure grafana with influxdb
# Add data source influxdb with the url http://host.docker.internal:8086 
# And add Database k6


# Start docker grafana
docker start grafana
# Start docker influxdb
docker start influxdb

# Run test sending results to local influxdb
k6 run --out influxdb=http://localhost:8086/k6


# Monitor windows resources with grafana

# Download installer from https://github.com/prometheus-community/windows_exporter/releases
http://localhost:9182/metrics


# Instal prometheus with docker
# Create a file prometheus.yml and write the next code

global:
  scrape_interval: 5s

scrape_configs:
  - job_name: 'windows_exporter'
    static_configs:
      - targets: ['192.168.0.23:9182'] //The ip of the PC where windows exporter was intalled

# Run docker command to install prometheus
docker run -d --name=prometheus -p 9090:9090 -v G:\Proyectos\K6\k6\monitoring\prometheus\prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus

# Open prometheus and verify if we can see the data from windows exporter
http://localhost:9090
// Search for "up"

# Connect ptometheus with grafana
Open http://localhost:3000
Go to Settings -> Data Source -> Add data source
Select prometheus
Add URL : http://host.docker.internal:9090  // Because I have promethus installed in docker

# Add dashboard to monitor Windows
Import dashboard 10467 // this is in chinese but we can import the one modified windows_dashboard.json

# Install Laravel

# Step 0 Install XAMPP
# Download xammp and insall it 
# Run xammp and start Apache and MySql

# Step 1 Install composer
# Download https://getcomposer.org/Composer-Setup.exe
# Execute command in cmd composer -v

# Step 2 Create laravel project
# Go to C:\xampp\htdocs
# Execute the command composer create-project laravel/laravel laravel

# Step 3 Configure database connection
# Go to C:\xampp\htdocs\miapp\.env
# Edit data base connection with:
DB_CONNECTION=mysql
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=

# Step 4 Create a database laravel
# Go to http://localhost/phpmyadmin
# Create a new database with name laravel

# Step 5 Install laravel breeze
# Execute composer laravel/breeze --dev
# Execute php artisan breeze:install
# When installing select blade as breeze stack



# Step 6 install node.js
# Download https://nodejs.org/
# Execute npm install
# Execute npm run dev

# Step 7 Create tables in database
# Execute php artisan migrate

# Step 8 Initiate the server
# Execute php artisan serve
# Open the url http://localhost:8000


# Allow phpmyadmin to be anable from other computers
C:\xampp\apache\conf\extra\httpd-xampp.conf
<Directory "C:/xampp/phpMyAdmin">
    AllowOverride AuthConfig
    Require local
</Directory>
Change Require local for Require all granted

