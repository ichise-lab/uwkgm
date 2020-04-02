#!/bin/bash

export UWKGM_API_VERSION=1.0.0.0
export UWKGM_UI_VERSION=0.1.0.18
export UWKGM_MYSQL_VERSION=8.0.19
export UWKGM_MONGO_VERSION=4.2.3
export UWKGM_VIRTUOSO_VERSION=1.3.2-virtuoso7.2.5.1
export UWKGM_SPRING_VERSION=0.1
export UWKGM_KUBE_HOST_PATH=/data/uwkgm

CREDENTIAL_FILE=../local/credentials.sh
SECRET_FILE=../local/secrets.sh

echo "Importing credentials..."
if [ -f "$CREDENTIAL_FILE" ]; then
    source ../local/credentials.sh
    echo "Done."
else
    mkdir -p ../local

    {
      echo "#!/bin/bash";
      echo "";
      echo "export UWKGM_MONGO_USERNAME=root";
      echo "export UWKGM_MONGO_PASSWORD=password";
      echo "export UWKGM_MYSQL_USERNAME=root";
      echo "export UWKGM_MYSQL_PASSWORD=password";
      echo "export UWKGM_VIRTUOSO_PASSWORD=password"
    } >> $CREDENTIAL_FILE

    echo "[UWKGM: ERROR] Credential file does not exist."
    echo "***IMPORTANT***"
    echo "Credential settings are required to set up protected resources."
    echo "We have created a file named 'credentials.sh' in 'uwkgm/local' with the following settings:"
    echo "  UWKGM_MONGO_USERNAME=root"
    echo "  UWKGM_MONGO_PASSWORD=password"
    echo "  UWKGM_MYSQL_USERNAME=root"
    echo "  UWKGM_MYSQL_PASSWORD=password"
    echo "  UWKGM_VIRTUOSO_PASSWORD=password"
    echo "The above settings are INSECURE. Before you continue, we highly recommend that you change the values."
    read -p "[UWKGM: INPUT] Press enter to continue"
    source ../local/credentials.sh
    echo "Done."
fi

echo "Importing secrets..."
if [ -f "$SECRET_FILE" ]; then
    source ../local/secrets.sh
    echo "Done."
else
    mkdir -p ../local

    {
      echo "#!/bin/bash";
      echo "";
      echo 'export UWKGM_DJANGO_SECRET_KEY=""'
    } >> $SECRET_FILE

    echo "[UWKGM: ERROR] Secret file does not exist."
    echo "***IMPORTANT***"
    echo "We have created a file named 'secrets.sh' in 'uwkgm/local'."
    echo "Please fill in the secret keys before you continue."
    read -p "[UWKGM: INPUT] Press enter to continue"
    source ../local/secrets.sh
    echo "Done."
fi