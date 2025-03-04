# k6
Base Project

# Install k6 https://grafana.com/docs/k6/latest/set-up/install-k6/
choco install k6 

# Run stress test and see all logs in console
k6 run basic_stress.js


# Run stress test and see all logs in csv
k6 run basic_stress.js 2> erros.csv



