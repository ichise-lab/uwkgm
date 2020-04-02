#!/bin/bash

if [[ -f "../../local/conf.sh" ]]; then
  source ../../local/conf.sh
else
  source ../../init.sh
  source ../../local/conf.sh
fi

source ../../kubernetes/parser.sh
source ../../kubernetes/env.sh
source ../../kubernetes/conf.sh
source ../../kubernetes/start.sh
source conf.sh

SQL=$(cat import.sql);

kubectl run -it --rm --image=tenforce/virtuoso:$UWKGM_VIRTUOSO_VERSION --restart=Never virtuoso-client -- /usr/local/virtuoso-opensource/bin/isql-v uwkgm-virtuoso-service:1111 dba "$UWKGM_VIRTUOSO_PASSWORD" "EXEC=$SQL"
