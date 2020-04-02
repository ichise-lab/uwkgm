#!/bin/bash

source conf.sh

cp mysql.template.yaml mysql.yaml
sed -i "s@{{UWKGM_KUBE_HOST_PATH}}@$UWKGM_KUBE_HOST_PATH@" mysql.yaml
sed -i "s@{{UWKGM_MYSQL_VERSION}}@$UWKGM_MYSQL_VERSION@" mysql.yaml
sed -i "s@{{UWKGM_MYSQL_PASSWORD}}@$UWKGM_MYSQL_PASSWORD@" mysql.yaml

kubectl apply -f mysql.yaml

echo "Configuring MySQL..."
SQL_ALTER_AUTH="ALTER USER root IDENTIFIED WITH mysql_native_password BY '$UWKGM_MYSQL_PASSWORD';"
SQL_CREATE_TABLE="CREATE DATABASE IF NOT EXISTS UWKGM CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

set_db()
{
    kubectl run -it --rm --image=mysql:$UWKGM_MYSQL_VERSION --restart=Never mysql-client -- mysql -h uwkgm-mysql-service -ppassword -e "$SQL_ALTER_AUTH $SQL_CREATE_TABLE" > mysql.log
}

set_db
while [[ $(cat mysql.log) == *'ERROR'* ]];
do
    cat mysql.log
    echo "Failed to connect to MySQL service. The service may still be initializing. Try again in 5 seconds..."
    sleep 5
    echo "Trying to connect to MySQL service..."
    set_db
done

rm mysql.log
