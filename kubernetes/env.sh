#!/bin/bash

if [[ $UWKGM_ENV == *"ext"* ]]; then
    export UWKGM_ABSOLUTE_HOST=$UWKGM_EXT_HOST
else
    export UWKGM_ABSOLUTE_HOST=$UWKGM_MASTER_HOST
fi

if [[ $UWKGM_ENV == *"pre-release"* ]]; then
    export UWKGM_HOST=$UWKGM_ABSOLUTE_HOST/release
else
    export UWKGM_HOST=$UWKGM_ABSOLUTE_HOST
fi

export UWKGM_API_ENDPOINT=$UWKGM_HOST/api
export UWKGM_AUTH_ENDPOINT=$UWKGM_HOST/api
