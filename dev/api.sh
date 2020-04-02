#!/bin/bash

source conf.sh
source ../kubernetes/conf.sh

cd ../api || exit

API_DIR=$(pwd)
source env/bin/activate
export PYTHONPATH=$API_DIR/dorest

echo "Checking project requirements..."
pip install -r requirements.txt
echo "Done."

cd uwkgm || exit

export UWKGM_STATE=migrating
python manage.py makemigrations accounts
python manage.py migrate

export UWKGM_STATE=running
export DOREST_VERBOSE=true
python manage.py runserver 0.0.0.0:8001
