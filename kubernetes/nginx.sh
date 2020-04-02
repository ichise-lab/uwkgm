#!/bin/bash

cd ../nginx || exit
cp default.template default

UWKGM_MYSQL_ADMIN_URL="$(cat mysql-admin.url)"
UWKGM_MONGO_EXPRESS_URL="$(cat mongo-express.url)"
UWKGM_VIRTUOSO_ADMIN_URL="$(cat virtuoso-admin.url)"
UWKGM_SPRING_URL="$(cat spring.url)"
UWKGM_API_URL="$(cat api.url)"
UWKGM_UI_URL="$(cat ui.url)"

echo ""
echo "[UWKGM: INFO] Assiging the following URLs:"
echo "  MYSQL_ADMIN:        $UWKGM_MYSQL_ADMIN_URL"
echo "  MONGO_EXPRESS:      $UWKGM_MONGO_EXPRESS_URL"
echo "  VIRTUOSO_ADMIN:     $UWKGM_VIRTUOSO_ADMIN_URL"
echo "  SPRING_BOOT:        $UWKGM_SPRING_URL"
echo "  UWKGM_API:          $UWKGM_API_URL"
echo "  UWKGM_UI:           $UWKGM_UI_URL"
echo ""

sed -i "s@{{UWKGM_MYSQL_ADMIN_URL}}@$UWKGM_MYSQL_ADMIN_URL@" default
sed -i "s@{{UWKGM_MONGO_EXPRESS_URL}}@$UWKGM_MONGO_EXPRESS_URL@" default
sed -i "s@{{UWKGM_VIRTUOSO_ADMIN_URL}}@$UWKGM_VIRTUOSO_ADMIN_URL@" default
sed -i "s@{{UWKGM_SPRING_URL}}@$UWKGM_SPRING_URL@" default

sed -i "s@{{UWKGM_API_URL}}@$UWKGM_API_URL@" default
sed -i "s@{{UWKGM_UI_URL}}@$UWKGM_UI_URL@" default

cp default /etc/nginx/sites-enabled/default

sudo systemctl restart nginx

cd ../kubernetes || exit
