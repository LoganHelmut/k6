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

# Install influxdb with docker
docker run -d --name=influxdb -p 8086:8086 influxdb:1.8
docker exec -it influxdb influx
create database k6
show databases
use k6
show measurements
select * from http_req_sending limit 10


# Start docker grafana
docker start grafana
# Start docker influxdb
docker start influxdb

# Run test sending results to local influxdb
k6 run --out influxdb=http://localhost:8086/k6