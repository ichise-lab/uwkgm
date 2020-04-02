#!/bin/bash

source build.sh

cp api.template.yaml api.yaml

sed -i "s@{{UWKGM_API_VERSION}}@$UWKGM_API_VERSION@" api.yaml
sed -i "s@{{UWKGM_KUBE_HOST_PATH}}@$UWKGM_KUBE_HOST_PATH@" api.yaml

kubectl apply -f api.yaml
