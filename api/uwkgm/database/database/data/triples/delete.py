"""Issue triple modifiers that delete triples from the graph

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


@endpoint(['DELETE'], include_request='request')
def single(request: Request, triple: dict) -> str:
    """Deletes a document containing a delete-triple modifier

    :param request: Django REST Framework's Request object (to get the issuer information)
    :param triple: A triple to delete from the graph
           :ex: ["http://dbpedia.org/resource/Barack_Obama", "http://dbpedia.org/property/birthplace", "http://dbpedia.org/resource/Hawaii"]
    :return: Deleted document's id
    """

    document = dict({'action': 'delete',
                     'created': datetime.now(),
                     'issuer': CustomUser.objects.get_by_natural_key(request.user).username,
                     'api': os.environ['UWKGM_API_VERSION'],
                     'triple': triple})
    return generic.resolve(single)(document)
