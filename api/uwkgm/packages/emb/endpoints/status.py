"""Example script

The UWKGM project
:copyright: (c) 2021 Ichise Laboratory at NII & AIST
"""

import os
import requests

from rest_framework.permissions import IsAuthenticated

from dorest import conf
from dorest.decorators import endpoint

@endpoint(['GET'], requires=[IsAuthenticated])
def check(service: str):
    """Check embedding service status
    
    :param service: Service name
           :ex: train
    :return: The target service's status
    """

    config = conf.resolve('servers', at=__name__)
    host = os.environ[config[service]['host']]
    port = os.environ[config[service]['port']]
    return requests.get(f'{host}:{port}').json()
