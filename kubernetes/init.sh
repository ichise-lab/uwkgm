#!/bin/bash

DEFAULT_UWKGM_MASTER_HOST=http://localhost
DEFAULT_UWKGM_EXT_HOST=http://localhost
DEFAULT_UWKGM_GRAPH=http://dbpedia.org

echo "Initializing configurations for deployment and update..."

read -p "[UWKGM: INPUT] Local environment (production*, pre-release, production:ext, pre-release:ext): " INIT_UWKGM_ENV
read -p "[UWKGM: INPUT] Master production server address ($DEFAULT_UWKGM_MASTER_HOST*): " INIT_UWKGM_MASTER_HOST
read -p "[UWKGM: INPUT] Extended production server address ($DEFAULT_UWKGM_EXT_HOST*): " INIT_UWKGM_EXT_HOST
read -p "[UWKGM: INPUT] Virtuoso RAM size in GB (*, 2, 4, 8, 16, 32, 48, 64, +): " INIT_UWKGM_VIRTUOSO_MEM
read -p "[UWKGM: INPUT] Default graph ($DEFAULT_UWKGM_GRAPH*): " INIT_UWKGM_GRAPH

rm -f ../local/conf.sh
mkdir -p ../local

echo "Initializing local configuration file..."
echo "#!/bin/bash" > ../local/conf.sh
echo "" >> ../local/conf.sh

if [[ $INIT_UWKGM_ENV == "" ]]; then
  echo "...Using default local environment: production"
  echo "export UWKGM_ENV=production" >> ../local/conf.sh
else
  echo "...Setting local environment to: ${INIT_UWKGM_ENV}"
  echo "export UWKGM_ENV=$INIT_UWKGM_ENV" >> ../local/conf.sh
fi

if [[ $INIT_UWKGM_MASTER_HOST == "" ]]; then
  echo "...Using default master production server address: $DEFAULT_UWKGM_MASTER_HOST"
  echo "export UWKGM_MASTER_HOST=$DEFAULT_UWKGM_MASTER_HOST" >> ../local/conf.sh
else
  echo "...Setting default master production server address to: $INIT_UWKGM_MASTER_HOST"
  echo "export UWKGM_MASTER_HOST=$INIT_UWKGM_MASTER_HOST" >> ../local/conf.sh
fi

if [[ $INIT_UWKGM_EXT_HOST == "" ]]; then
  echo "...Using default master production server address: $DEFAULT_UWKGM_EXT_HOST"
  echo "export UWKGM_EXT_HOST=$DEFAULT_UWKGM_EXT_HOST" >> ../local/conf.sh
else
  echo "...Setting default master production server address to: $INIT_UWKGM_EXT_HOST"
  echo "export UWKGM_EXT_HOST=$INIT_UWKGM_EXT_HOST" >> ../local/conf.sh
fi

if [[ $INIT_UWKGM_VIRTUOSO_MEM == "" ]]; then
  INIT_UWKGM_VIRTUOSO_NUM_BUFFERS=10000
  INIT_UWKGM_VIRTUOSO_DIRTY_BUFFERS=6000
elif [[ $INIT_UWKGM_VIRTUOSO_MEM == 2 ]]; then
  INIT_UWKGM_VIRTUOSO_NUM_BUFFERS=170000
  INIT_UWKGM_VIRTUOSO_DIRTY_BUFFERS=130000
elif [[ $INIT_UWKGM_VIRTUOSO_MEM == 4 ]]; then
  INIT_UWKGM_VIRTUOSO_NUM_BUFFERS=340000
  INIT_UWKGM_VIRTUOSO_DIRTY_BUFFERS=250000
elif [[ $INIT_UWKGM_VIRTUOSO_MEM == 8 ]]; then
  INIT_UWKGM_VIRTUOSO_NUM_BUFFERS=680000
  INIT_UWKGM_VIRTUOSO_DIRTY_BUFFERS=500000
elif [[ $INIT_UWKGM_VIRTUOSO_MEM == 16 ]]; then
  INIT_UWKGM_VIRTUOSO_NUM_BUFFERS=1360000
  INIT_UWKGM_VIRTUOSO_DIRTY_BUFFERS=1000000
elif [[ $INIT_UWKGM_VIRTUOSO_MEM == 32 ]]; then
  INIT_UWKGM_VIRTUOSO_NUM_BUFFERS=2720000
  INIT_UWKGM_VIRTUOSO_DIRTY_BUFFERS=2000000
elif [[ $INIT_UWKGM_VIRTUOSO_MEM == 48 ]]; then
  INIT_UWKGM_VIRTUOSO_NUM_BUFFERS=4000000
  INIT_UWKGM_VIRTUOSO_DIRTY_BUFFERS=3000000
elif [[ $INIT_UWKGM_VIRTUOSO_MEM == 64 ]]; then
  INIT_UWKGM_VIRTUOSO_NUM_BUFFERS=5450000
  INIT_UWKGM_VIRTUOSO_DIRTY_BUFFERS=4000000
elif [[ $INIT_UWKGM_VIRTUOSO_MEM == "+" ]]; then
  read -p "[UWKGM: INPUT] Virtuoso's number of buffers: " INIT_UWKGM_VIRTUOSO_NUM_BUFFERS
  read -p "[UWKGM: INPUT] Virtuoso's max dirty buffers: " INIT_UWKGM_VIRTUOSO_DIRTY_BUFFERS
fi

if [[ $INIT_UWKGM_GRAPH == "" ]]; then
  echo "...Using default graph: $DEFAULT_UWKGM_GRAPH"
  echo "export UWKGM_DEFAULT_GRAPH=$DEFAULT_UWKGM_GRAPH" >> ../local/conf.sh
else
  echo "...Setting default graph to: $INIT_UWKGM_GRAPH"
  echo "export UWKGM_DEFAULT_GRAPH=$INIT_UWKGM_GRAPH" >> ../local/conf.sh
fi

echo "...Setting Virtuoso RAM size to: $INIT_UWKGM_VIRTUOSO_MEM GB"
echo "...Setting Virtuoso's number of buffers to: $INIT_UWKGM_VIRTUOSO_NUM_BUFFERS"
echo "...Setting Virtuoso's max dirty buffers to: $INIT_UWKGM_VIRTUOSO_DIRTY_BUFFERS"
echo "export UWKGM_VIRTUOSO_MEM=$INIT_UWKGM_VIRTUOSO_MEM" >> ../local/conf.sh
echo "export UWKGM_VIRTUOSO_NUM_BUFFERS=$INIT_UWKGM_VIRTUOSO_NUM_BUFFERS" >> ../local/conf.sh
echo "export UWKGM_VIRTUOSO_DIRTY_BUFFERS=$INIT_UWKGM_VIRTUOSO_DIRTY_BUFFERS" >> ../local/conf.sh
