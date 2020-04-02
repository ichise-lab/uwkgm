"""The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import os
import ssl

import nltk
import pymongo
from django.apps import AppConfig

from dorest import env, verbose


class KnowledgeConfig(AppConfig):
    name = 'knowledge'

    def ready(self):
        if 'UWKGM_STATE' in os.environ and os.environ['UWKGM_STATE'] == 'running':
            verbose.info('Initializing NLTK wordnet...', KnowledgeConfig)

            try:
                _create_unverified_https_context = ssl._create_unverified_context
            except AttributeError:
                pass
            else:
                ssl._create_default_https_context = _create_unverified_https_context

            nltk.download('wordnet')

            verbose.info('Testing MongoDB database connection...')
            pymongo.MongoClient('mongodb://%s:%d/' % (env.resolve('database.mongo.address'), env.resolve('database.mongo.port')))
            verbose.info('MongoDB connection test pass')
