#!/bin/bash

source conf.sh

cp mongo.template.yaml mongo.yaml
cp express.template.yaml express.yaml

sed -i "s@{{UWKGM_MONGO_VERSION}}@$UWKGM_MONGO_VERSION@" mongo.yaml
sed -i "s@{{UWKGM_KUBE_HOST_PATH}}@$UWKGM_KUBE_HOST_PATH@" mongo.yaml
sed -i "s@{{UWKGM_MONGO_USERNAME}}@$UWKGM_MONGO_USERNAME@" mongo.yaml
sed -i "s@{{UWKGM_MONGO_PASSWORD}}@$UWKGM_MONGO_PASSWORD@" mongo.yaml

sed -i "s@{{UWKGM_MONGO_USERNAME}}@$UWKGM_MONGO_USERNAME@" express.yaml
sed -i "s@{{UWKGM_MONGO_PASSWORD}}@$UWKGM_MONGO_PASSWORD@" express.yaml

kubectl apply -f mongo.yaml
kubectl apply -f express.yaml
