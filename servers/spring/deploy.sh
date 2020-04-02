#!/bin/bash

source build.sh

cp spring.template.yaml spring.yaml

sed -i "s@{{UWKGM_SPRING_VERSION}}@$UWKGM_SPRING_VERSION@" spring.yaml

kubectl apply -f spring.yaml
