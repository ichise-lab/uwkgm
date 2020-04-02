#!/bin/bash

docker build -t uwkgm/spring:$UWKGM_SPRING_VERSION .
docker tag uwkgm/spring:$UWKGM_SPRING_VERSION localhost:5000/uwkgm/spring:$UWKGM_SPRING_VERSION
docker push localhost:5000/uwkgm/spring:$UWKGM_SPRING_VERSION
