#!/bin/bash

source conf.sh

cp admin.template.yaml admin.yaml
sed -i "s@{{UWKGM_PMA_VERSION}}@$UWKGM_PMA_VERSION@" admin.yaml
sed -i "s@{{UWKGM_PMA_ABSOLUTE_URI}}@$UWKGM_PMA_ABSOLUTE_URI@" admin.yaml

kubectl apply -f admin.yaml
