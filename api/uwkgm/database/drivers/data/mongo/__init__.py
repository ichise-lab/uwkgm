"""MongoDB driver for triple-modifier database

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import os

import pymongo

from dorest import env

mongo_config = env.resolve('database.mongo')
mongo_address = 'mongodb://%s:%d/' % (mongo_config['address'], mongo_config['port'])

if 'UWKGM_MONGO_USERNAME' not in os.environ or 'UWKGM_MONGO_PASSWORD' not in os.environ \
        or len(os.environ['UWKGM_MONGO_USERNAME']) == 0 or len(os.environ['UWKGM_MONGO_PASSWORD']) == 0:
    mongo_client = pymongo.MongoClient(mongo_address)
else:
    mongo_client = pymongo.MongoClient(mongo_address,
                                       username=os.environ['UWKGM_MONGO_USERNAME'],
                                       password=os.environ['UWKGM_MONGO_PASSWORD'])

mongo = mongo_client['uwkgm']
