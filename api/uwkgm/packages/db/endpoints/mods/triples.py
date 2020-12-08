"""Interfaces for a triple-modifier database

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import os
from typing import Dict, List

from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.request import Request

from dorest import interfaces
from dorest.decorators import endpoint
from dorest.permissions import NOT, OR

from accounts.models import CustomUser
from accounts.permissions import IsDemoUser, IsRegularUser, IsTrustedUser


@endpoint(['GET'], requires=[IsAuthenticated])
def find() -> List[dict]:
    """Find triple modifiers

    :return: A list of triple modifiers
    """

    return interfaces.resolve(find)()


@endpoint(['POST'], requires=[OR(NOT(IsDemoUser), IsRegularUser)], include_request='request')
def add(request: Request, triple: dict, doc_id: str = None) -> str:
    """Add an add-triple modifier

    :param request: Django REST Framework's Request object (to get the issuer information)
    :param triple: (subject, predicate, object)
           :ex: ["http://dbpedia.org/resource/Barack_Obama", "http://dbpedia.org/property/birthplace", "http://dbpedia.org/resource/Hawaii"]
    :param doc_id: MongoDB's document ID for triple updating
    :return: Added document's id
    """

    document = dict({'action': 'add',
                     'issuer': CustomUser.objects.get_by_natural_key(request.user).username,
                     'api': os.environ['UWKGM_API_VERSION'],
                     'triple': triple,
                     'doc_id': doc_id})
    return interfaces.resolve(add)(document)


@endpoint(['POST'], requires=[OR(NOT(IsDemoUser), IsRegularUser)], include_request='request')
def edit(request: Request, triple: dict, original_triple: dict, doc_id: str) -> str:
    """Add an edit-triple modifier

    :param request: Django REST Framework's Request object (to get the issuer information)
    :param triple: The replacing triple (subject, predicate, object)
           :ex: ["http://dbpedia.org/resource/Barack_Obama", "http://dbpedia.org/property/birthplace", "http://dbpedia.org/resource/United_States"]
    :param original_triple: The original triple to be edited (subject, predicate, object)
           :ex: ["http://dbpedia.org/resource/Barack_Obama", "http://dbpedia.org/property/birthplace", "http://dbpedia.org/resource/Hawaii"]
    :param doc_id: MongoDB's document ID for triple updating
    :return: Added document's id
    """

    document = dict({'action': 'edit',
                     'issuer': CustomUser.objects.get_by_natural_key(request.user).username,
                     'api': os.environ['UWKGM_API_VERSION'],
                     'triple': triple,
                     'originalTriple': original_triple,
                     'doc_id': doc_id})
    return interfaces.resolve(edit)(document)


@endpoint(['POST'], requires=[OR(NOT(IsDemoUser), IsRegularUser)], include_request='request')
def delete(request: Request, triple: dict, doc_id: str) -> str:
    """Add a delete-triple modifier

    :param request: Django REST Framework's Request object (to get the issuer information)
    :param triple: A triple to delete from the graph
           :ex: ["http://dbpedia.org/resource/Barack_Obama", "http://dbpedia.org/property/birthplace", "http://dbpedia.org/resource/Hawaii"]
    :param doc_id: MongoDB's document ID for triple updating
    :return: Added document's id
    """

    document = dict({'action': 'delete',
                     'issuer': CustomUser.objects.get_by_natural_key(request.user).username,
                     'api': os.environ['UWKGM_API_VERSION'],
                     'triple': triple,
                     'doc_id': doc_id})
    return interfaces.resolve(delete)(document)


@endpoint(['DELETE'], requires=[OR(NOT(IsDemoUser), IsRegularUser)])
def remove(document_ids: List[str]) -> int:
    """Remove a triple modifier

    :param document_ids: Document id of the triple modifier
    :return: The number of triple modifiers removed in this transaction
    """

    return interfaces.resolve(remove)(document_ids)


@endpoint(['PATCH'], requires=[OR(IsAdminUser, IsTrustedUser)])
def commit() -> int:
    """Commit triple modifiers that have not been committed before to the graph database

    :return: The number of triple modifiers committed in this transaction
    """
    return interfaces.resolve(commit)()
