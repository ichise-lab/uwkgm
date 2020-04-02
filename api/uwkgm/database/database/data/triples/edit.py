"""Issue triple modifiers that edit triples in the graph

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import os
from datetime import datetime

from rest_framework.request import Request

from dorest.managers.struct import generic
from dorest.managers.struct.decorators import endpoint

from accounts.models import CustomUser


@endpoint(['POST'], include_request='request')
def single(request: Request, triple: dict, original_triple: dict) -> str:
    """Edits a document containing an edit-triple modifier

    :param request: Django REST Framework's Request object (to get the issuer information)
    :param triple: The replacing triple (subject, predicate, object)
           :ex: ["http://dbpedia.org/resource/Barack_Obama", "http://dbpedia.org/property/birthplace", "http://dbpedia.org/resource/United_States"]
    :param original_triple: The original triple to be edited (subject, predicate, object)
           :ex: ["http://dbpedia.org/resource/Barack_Obama", "http://dbpedia.org/property/birthplace", "http://dbpedia.org/resource/Hawaii"]
    :return: Edited document's id
    """

    document = dict({'action': 'edit',
                     'created': datetime.now(),
                     'issuer': CustomUser.objects.get_by_natural_key(request.user).username,
                     'api': os.environ['UWKGM_API_VERSION'],
                     'triple': triple,
                     'originalTriple': original_triple})
    return generic.resolve(single)(document)
