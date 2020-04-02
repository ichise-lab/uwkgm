"""Add triples to the triple modifier database

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import os
from datetime import datetime
from typing import Any, Dict, Tuple

from rest_framework.request import Request

from dorest.managers.struct import generic
from dorest.managers.struct.decorators import endpoint

from accounts.models import CustomUser
from database.database.graph.triples.find import single as find_triple


@endpoint(['POST'], include_request='request')
def single(request: Request, triple: dict, text_id: str = None) -> str:
    """Adds a document containing an add-triple modifier

    :param request: Django REST Framework's Request object (to get the issuer information)
    :param triple: (subject, predicate, object)
           :ex: ["http://dbpedia.org/resource/Barack_Obama", "http://dbpedia.org/property/birthplace", "http://dbpedia.org/resource/Hawaii"]
    :param text_id: If the triple was extracted from a text, 'text_id' stores the reference to the original text.
    :return: Added document's id
    """

    document = dict({'action': 'add',
                     'created': datetime.now(),
                     'issuer': CustomUser.objects.get_by_natural_key(request.user).username,
                     'api': os.environ['UWKGM_API_VERSION'],
                     'triple': triple})

    if text_id is not None:
        document['textId'] = text_id

    return generic.resolve(single)(document)


@endpoint(['GET'])
def check(triple: Tuple[str, str, str]) -> Dict[str, Any]:
    """Checks whether a triple does not exist in the graph

    :param: triple: (subject, predicate, object)
            :ex: ["http://dbpedia.org/resource/Barack_Obama", "http://dbpedia.org/property/birthplace", "http://dbpedia.org/resource/Hawaii"]
    :return: True if the triple does not exist in the graph
    """

    if find_triple(triple):
        return {'result': False, 'detail': 'Triple already exists in the graph', 'code': 'triple_already_exists'}
    else:
        return {'result': True}
