#!/usr/bin/zsh

API="http://localhost:4001"
CONTENT_TYPE="Content-Type: application/json"

# Populate Database with users
curl -X POST -H ${CONTENT_TYPE} -d '{"username": "lchapren"}' ${API}/users
curl -X POST -H ${CONTENT_TYPE} -d '{"username": "josayko"}' ${API}/users
# curl -X POST -H ${CONTENT_TYPE} -d '{"username": "adupuy"}' ${API}/users
# curl -X POST -H ${CONTENT_TYPE} -d '{"username": "mabriand"}' ${API}/users
# curl -X POST -H ${CONTENT_TYPE} -d '{"username": "vmoreau"}' ${API}/users
