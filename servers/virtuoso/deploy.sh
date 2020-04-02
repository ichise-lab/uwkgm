#!/bin/bash

source conf.sh

mkdir -p $UWKGM_VIRTUOSO_HOST_PATH
mkdir -p $UWKGM_VIRTUOSO_HOST_EXT_PATH

cp virtuoso.template.ini virtuoso.ini
sed -i "s@{{UWKGM_VIRTUOSO_NUM_BUFFERS}}@$UWKGM_VIRTUOSO_NUM_BUFFERS@" virtuoso.ini
sed -i "s@{{UWKGM_VIRTUOSO_DIRTY_BUFFERS}}@$UWKGM_VIRTUOSO_DIRTY_BUFFERS@" virtuoso.ini
sed -i "s@{{UWKGM_VIRTUOSO_DEFAULT_GRAPH}}@$UWKGM_VIRTUOSO_DEFAULT_GRAPH@" virtuoso.ini
cp virtuoso.ini $UWKGM_VIRTUOSO_HOST_PATH/virtuoso.ini

cp virtuoso.template.yaml virtuoso.yaml
sed -i "s@{{UWKGM_VIRTUOSO_VERSION}}@$UWKGM_VIRTUOSO_VERSION@" virtuoso.yaml
sed -i "s@{{UWKGM_VIRTUOSO_PASSWORD}}@$UWKGM_VIRTUOSO_PASSWORD@" virtuoso.yaml
sed -i "s@{{UWKGM_VIRTUOSO_DEFAULT_GRAPH}}@$UWKGM_VIRTUOSO_DEFAULT_GRAPH@" virtuoso.yaml
sed -i "s@{{UWKGM_VIRTUOSO_HOST_PATH}}@$UWKGM_VIRTUOSO_HOST_PATH@" virtuoso.yaml
sed -i "s@{{UWKGM_VIRTUOSO_HOST_EXT_PATH}}@$UWKGM_VIRTUOSO_HOST_EXT_PATH@" virtuoso.yaml

kubectl apply -f virtuoso.yaml
