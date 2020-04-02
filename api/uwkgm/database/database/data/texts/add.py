"""Add texts to the triple modifier database

Triples extracted from the texts will be linked to their original texts for future reference.
The linking process should be done on the client side through the user interface
to allow users to choose the extraction method.

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
def single(request: Request, document: dict) -> str:
    """Adds a document containing the given text

    :param document: A dictionary containing the text
           :ex: {"text": "Barack Obama was born in Hawaii"}
    :param request: Django REST Framework's Request object (to get the issuer information)
    :return: The added document id
    """

    document['datetime'] = datetime.now()
    document['issuer'] = CustomUser.objects.get_by_natural_key(request.user).username
    document['api'] = os.environ['UWKGM_API_VERSION']
    return generic.resolve(single)(document)
