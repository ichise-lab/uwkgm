#!/bin/bash

source conf.sh
source ../kubernetes/conf.sh

cd ../ui/uwkgm

export HOST=localhost
export PORT=8000
export REACT_APP_ENV=$UWKGM_ENV
export REACT_APP_UI_VERSION=$UWKGM_UI_VERSION
export REACT_APP_API_VERSION=$UWKGM_API_VERSION
export REACT_APP_API_ENDPOINT=http://localhost:8001/api
export REACT_APP_AUTH_ENDPOINT=http://localhost:8001/api
export REACT_APP_CONFIG_DATABASE=$UWKGM_CONFIG_DATABASE

npm install --unsafe-perm=true --allow-root
npm start
