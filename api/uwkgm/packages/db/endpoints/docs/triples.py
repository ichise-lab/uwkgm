"""Interfaces for a triple-modifier database

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import os
from datetime import datetime
from typing import List

from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.request import Request

from dorest import interfaces
from dorest.decorators import endpoint
from dorest.permissions import IsDemoUser, IsTrustedUser, NOT, OR

from accounts.models import CustomUser


@endpoint(['GET'], requires=[IsAuthenticated])
def find() -> List[dict]:
    """Find triple modifiers

    :return: A list of triple modifiers
    """

    return interfaces.resolve(find)()


@endpoint(['POST'], requires=[NOT(IsDemoUser)], include_request='request')
def add(request: Request, triple: dict, text_id: str = None) -> str:
    """Add a document containing an add-triple modifier

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

    return interfaces.resolve(add)(document)


@endpoint(['PATCH'], requires=[NOT(IsDemoUser)], include_request='request')
def edit(request: Request, triple: dict, original_triple: dict) -> str:
    """Edit a document containing an edit-triple modifier

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
    return interfaces.resolve(edit)(document)


@endpoint(['POST'], requires=[NOT(IsDemoUser)], include_request='request')
def delete(request: Request, triple: dict) -> str:
    """Delete a document containing a delete-triple modifier

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
    return interfaces.resolve(delete)(document)


@endpoint(['DELETE'], requires=[NOT(IsDemoUser)])
def remove(document_id: str) -> int:
    """Remove a triple modifier

    :param document_id: Document id of the triple modifier
    :return: The number of triple modifiers removed in this transaction
    """

    return interfaces.resolve(remove)(document_id)


@endpoint(['PATCH'], requires=[OR(IsAdminUser, IsTrustedUser)])
def commit() -> int:
    """Commit triple modifiers that have not been committed before to the graph database

    :return: The number of triple modifiers committed in this transaction
    """
    return interfaces.resolve(commit)()
