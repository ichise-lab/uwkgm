#!/bin/bash

# Uncomment to override credentials stored in UWKGM/local/credentials.sh
# export UWKGM_VIRTUOSO_PASSWORD=

export UWKGM_VIRTUOSO_DEFAULT_GRAPH=$UWKGM_DEFAULT_GRAPH
export UWKGM_VIRTUOSO_HOST_PATH=$UWKGM_KUBE_HOST_PATH/virtuoso
export UWKGM_VIRTUOSO_HOST_EXT_PATH=$UWKGM_KUBE_HOST_PATH/virtuoso-ext
