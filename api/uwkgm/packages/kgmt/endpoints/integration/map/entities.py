"""Map entities from texts

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import requests
from typing import Dict

from rest_framework.permissions import IsAuthenticated

from dorest import conf, verbose
from dorest.decorators import endpoint


@endpoint(['GET'], requires=[IsAuthenticated])
def dbpedia_spotlight(text: str, address: str = None, confidence: float = .5) -> Dict[str, str]:
    """Map entities from a text

    :param text: A string (to be mapped)
           :ex: Barack Obama born in Hawaii
    :param address: Annotator endpoint
           :ex: https://api.dbpedia-spotlight.org/en/annotate
    :param confidence: Minimum threshold of confidence value of found entities
           :ex: 0.5
    :return: A dictionary of mapped entities (URI)
    """

    config = conf.resolve('knowledge.integration.map.entities.dbpedia', at=__name__)
    confidence = confidence or config['confidence']
    address = address or config['address']

    verbose.info('Mapping entities with annotation endpoint: %s' % address, dbpedia_spotlight)
    response = requests.get(address, params={'text': text, 'confidence': str(confidence)},
                            headers={'Accept': 'application/json'})

    entities = {}
    for item in response.json()['Resources']:
        entities[item['@surfaceForm']] = item['@URI']

    return entities
