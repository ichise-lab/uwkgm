#!/bin/bash

cd ..

docker build -f kubernetes/Dockerfile -t uwkgm/api:$UWKGM_API_VERSION \
    --build-arg version=$UWKGM_API_VERSION \
    --build-arg env=$UWKGM_ENV \
    --build-arg ext_host=$UWKGM_EXT_HOST \
    --build-arg django_secret=$UWKGM_DJANGO_SECRET_KEY \
    --build-arg mysql_username=$UWKGM_MYSQL_USERNAME \
    --build-arg mysql_password=$UWKGM_MYSQL_PASSWORD \
    --build-arg mongo_username=$UWKGM_MONGO_USERNAME \
    --build-arg mongo_password=$UWKGM_MONGO_PASSWORD \
    .

docker tag uwkgm/api:$UWKGM_API_VERSION localhost:5000/uwkgm/api:$UWKGM_API_VERSION
docker push localhost:5000/uwkgm/api:$UWKGM_API_VERSION

cd kubernetes || exit
