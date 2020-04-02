#!/bin/bash

if [[ -f "../local/conf.sh" ]]; then
  source ../local/conf.sh
else
  source init.sh
  source ../local/conf.sh
fi

source parser.sh
source env.sh
source conf.sh
source start.sh

cd ..

if [[ $UWKGM_ENV != "development" ]]; then
    cd servers || exit

    if [[ -z ${UWKGM_COMPONENTS+x} || $UWKGM_COMPONENTS == *"mysql"* ]]; then
        echo "[UWKGM: INFO] Updating MySQL to $UWKGM_MYSQL_VERSION..."
        kubectl set image deployment/uwkgm-mysql-deployment uwkgm-mysql-app=mysql:$UWKGM_MYSQL_VERSION --record
    fi

    if [[ -z ${UWKGM_COMPONENTS+x} || $UWKGM_COMPONENTS == *"mongo"* ]]; then 
        echo "[UWKGM: INFO] Updating MongoDB to $UWKGM_MONGO_VERSION..."
        kubectl set image deployment/uwkgm-mongo-deployment uwkgm-mongo-app=mongo:$UWKGM_MONGO_VERSION --record
    fi

    if [[ -z ${UWKGM_COMPONENTS+x} || $UWKGM_COMPONENTS == *"virtuoso"* ]]; then 
        echo "[UWKGM: INFO] Updating Virtuoso to $UWKGM_VIRTUOSO_VERSION..."
        kubectl set image deployment/uwkgm-virtuoso-deployment uwkgm-virtuoso-app=tenforce/virtuoso:$UWKGM_VIRTUOSO_VERSION --record
    fi

    if [[ -z ${UWKGM_COMPONENTS+x} || $UWKGM_COMPONENTS == *"spring"* ]]; then 
        echo "[UWKGM: INFO] Updating UWKGM Spring Boot to $UWKGM_SPRING_VERSION..."
        cd spring || exit
        source build.sh
        kubectl set image deployment/uwkgm-spring-deployment uwkgm-spring-app=localhost:5000/uwkgm/spring:$UWKGM_SPRING_VERSION --record
        cd ..
    fi

    cd ..

    if [[ -z ${UWKGM_COMPONENTS+x} || $UWKGM_COMPONENTS == *"api"* ]]; then
        echo "[UWKGM: INFO] Updating UWKGM API to $UWKGM_API_VERSION..."
        cd api/kubernetes || exit
        source build.sh
        kubectl set image deployment/uwkgm-api-deployment uwkgm-api-app=localhost:5000/uwkgm/api:$UWKGM_API_VERSION --record
        cd ../..
    fi

    if [[ -z ${UWKGM_COMPONENTS+x} || $UWKGM_COMPONENTS == *"ui"* ]]; then
        echo "[UWKGM: INFO] Updating UWKGM UI to $UWKGM_UI_VERSION..."
        cd ui/kubernetes || exit
        source deploy.sh
        kubectl set image deployment/uwkgm-ui-deployment uwkgm-ui-app=localhost:5000/uwkgm/ui:$UWKGM_UI_VERSION --record
        cd ../..
    fi

fi

cd kubernetes || exit

docker image list
kubectl get deployments
