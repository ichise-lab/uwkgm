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
        echo "[UWKGM: INFO] Deploying MySQL $UWKGM_MYSQL_VERSION and latest phpMyAdmin..."
        cd mysql/mysql || exit
        source deploy.sh
        cd ../admin || exit
        source deploy.sh
        cd ../..
        minikube service uwkgm-mysql-admin-service --url > ../nginx/mysql-admin.url
    fi

    if [[ -z ${UWKGM_COMPONENTS+x} || $UWKGM_COMPONENTS == *"mongo"* ]]; then 
        echo "[UWKGM: INFO] Deploying MongoDB $UWKGM_MONGO_VERSION and latest Mongo Express..."
        cd mongo || exit
        source deploy.sh
        cd ..
        minikube service uwkgm-mongo-express-service --url > ../nginx/mongo-express.url
    fi

    if [[ -z ${UWKGM_COMPONENTS+x} || $UWKGM_COMPONENTS == *"virtuoso"* ]]; then 
        echo "[UWKGM: INFO] Deploying Virtuoso $UWKGM_VIRTUOSO_VERSION with Conductor and SPARQL..."
        cd virtuoso || exit
        source deploy.sh
        cd ..
        minikube service uwkgm-virtuoso-admin-service --url > ../nginx/virtuoso-admin.url
    fi

    if [[ -z ${UWKGM_COMPONENTS+x} || $UWKGM_COMPONENTS == *"spring"* ]]; then 
        echo "[UWKGM: INFO] Deploying UWKGM Spring Boot $UWKGM_SPRING_VERSION..."
        cd spring || exit
        source deploy.sh
        cd ..
        minikube service uwkgm-spring-service --url > ../nginx/spring.url
    fi

    cd ..

    if [[ -z ${UWKGM_COMPONENTS+x} || $UWKGM_COMPONENTS == *"api"* ]]; then
        echo "[UWKGM: INFO] Deploying UWKGM API $UWKGM_API_VERSION..."
        cd api/kubernetes || exit
        source deploy.sh
        cd ../..
        minikube service uwkgm-api-service --url > nginx/api.url
    fi

    # if [[ -z ${UWKGM_COMPONENTS+x} || $UWKGM_COMPONENTS == *"ui"* ]]; then
    #    echo "[UWKGM: INFO] Deploying UWKGM UI $UWKGM_UI_VERSION..."
    #    cd ui/kubernetes || exit
    #    source deploy.sh
    #    cd ../..
    #    minikube service uwkgm-ui-service --url > nginx/ui.url
    # fi

fi

cd kubernetes || exit

docker image list
kubectl get services
kubectl get deployments

source nginx.sh
