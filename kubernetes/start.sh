#!/bin/bash

if [[ $UWKGM_COMPONENTS == "" ]]; then
  COMPONENTS=All
else
  COMPONENTS=$UWKGM_COMPONENTS
fi

echo ""
echo "  _    ___          ___  _______ __  __  "
echo " | |  | \ \        / / |/ / ____|  \/  | "
echo " | |  | |\ \  /\  / /| ' / |  __| \  / | "
echo " | |  | | \ \/  \/ / |  <| | |_ | |\/| | "
echo " | |__| |  \  /\  /  | . \ |__| | |  | | "
echo "  \____/    \/  \/   |_|\_\_____|_|  |_| "
echo ""
echo "UWKGM Deployment Toolkit (C) 2020 Ichise Laboratory AIST & NII. "
echo "For more information, contact ichise@nii.ac.jp"
echo ""
echo "[UWKGM: INFO] The following configurations will be applied:"
echo "  ENV:                $UWKGM_ENV"
echo "  COMPONENTS:         $COMPONENTS"
echo "  API_VERSION:        $UWKGM_API_VERSION"
echo "  UI_VESRION:         $UWKGM_UI_VERSION"
echo "  ABSOLUTE_HOST:      $UWKGM_ABSOLUTE_HOST"
echo "  RELATIVE_HOST:      $UWKGM_HOST"
echo "  API_ENDPOINT:       $UWKGM_API_ENDPOINT"
echo "  AUTH_ENDPOINT:      $UWKGM_AUTH_ENDPOINT"
echo "  KUBE_HOST_PATH:     $UWKGM_KUBE_HOST_PATH"
echo "  SPRING_VERSION:     $UWKGM_SPRING_VERSION"
echo "  MYSQL_VERSION:      $UWKGM_MYSQL_VERSION"
echo "  MONGO_VERSION:      $UWKGM_MONGO_VERSION"
echo "  VIRTUOSO_VERSION:   $UWKGM_VIRTUOSO_VERSION"
echo "  VIRTUOSO_MEM:       $UWKGM_VIRTUOSO_MEM"
echo "  VIRTUOSO_NUM_BF:    $UWKGM_VIRTUOSO_NUM_BUFFERS"
echo "  VIRTUOSO_DRTY_BF:   $UWKGM_VIRTUOSO_DIRTY_BUFFERS"
echo "  DEFAULT_GRAPH:      $UWKGM_DEFAULT_GRAPH"
echo ""
read -p "[UWKGM: INPUT] Press enter to continue"
