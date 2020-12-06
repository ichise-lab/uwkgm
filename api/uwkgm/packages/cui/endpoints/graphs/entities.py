"""Interfaces for a graph database

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import os
from typing import Dict, List, Union

from rest_framework.permissions import IsAuthenticated

from dorest import interfaces
from dorest.decorators import endpoint


LABEL_ENTITIES = ['http://xmlns.com/foaf/0.1/name',
                  'http://www.w3.org/2000/01/rdf-schema#label',
                  'http://dbpedia.org/property/name',
                  'http://dbpedia.org/ontology/title']
TYPE_ENTITIES = ['http://www.w3.org/1999/02/22-rdf-syntax-ns#type']

PREDICATES = {
                'incomings': {
                        'predicates': {'label': LABEL_ENTITIES},
                        'targets': {'label': LABEL_ENTITIES}
                    },
                'outgoings': {
                        'predicates': {'label': LABEL_ENTITIES},
                        'targets': {'label': LABEL_ENTITIES, 'type': TYPE_ENTITIES}
                    }
             }


@endpoint(['GET'], requires=[IsAuthenticated])
def find(entities: List[str], language: str = 'en', limit: int = None, query_limit: Union[int, None] = None,
         predicates: Dict[str, Dict[str, Union[Dict[str, str], str]]] = PREDICATES, include_incomings: bool = True, include_outgoings: bool = True,
         graph: str = os.environ['UWKGM_DB_GRAPHS_DEFAULT_GRAPH']) -> Dict[str, List[Dict[str, str]]]:
    """Find triples of which the given entity is a subject or an object

    :param entities: A list of entities to be used to find the triples
    :param language: A language filter for the candidates' labels
    :param limit: The maximum number of returned triples
    :param query_limit: The maximum number of candidates specified in the database query command
    :param predicates: Predicates to be included in a query (See the default variable PREDICATES for its structure)
    :param include_incomings: Include entities' incoming links (triples)
    :param include_outgoings: Include entities' outgoing links (triples)
    :param graph: Graph URI
    :return: Lists of triples pertaining to the entity's role ({'subject': [...], 'predicate': [...], 'object': [...]})
    """
    
    return interfaces.resolve(find)(graph, entities, language, limit, query_limit, predicates,
                                    include_incomings, include_outgoings)


@endpoint(['GET'], requires=[IsAuthenticated])
def candidates(search: str, language: str = 'en', limit: Union[int, None] = 50, query_limit: Union[int, None] = None,
               label_entities: List[str] = LABEL_ENTITIES, type_entities: str = TYPE_ENTITIES, have_types_only: bool = True,
               perfect_match_only: bool = False, graph: str = os.environ['UWKGM_DB_GRAPHS_DEFAULT_GRAPH'])\
        -> Dict[str, List[Dict[str, Union[str, List[str]]]]]:
    """Find candidates of entities given a partial or full label

    This endpoint function returns three list of candidates:
        The 'exact_matches' are candidates which labels match the search label perfectly.
        The 'first_matches' are candidates which labels start with the search label
        The 'partial_matches' are candidates which labels partially match the search label

    :param search: Search term (URI or partial/full label)
    :param limit: The maximum number of candidates in each of the response lists
    :param language: A language filter for the candidates' labels
    :param query_limit: The maximum number of candidates specified in the database query command
    :param label_entities: Entities of predicate 'label'
    :param type_entities: Entities of predicate 'type'
    :param have_types_only: Find only candidates that have types
    :param perfect_match_only: Find only candidates that exactly match the search label
    :param graph: Graph URI
    :return: The three lists of candidates ({"exact_matches": ..., "first_matches": ..., "partial_matches": ...})
    """

    return interfaces.resolve(candidates)(graph, search, language, limit, query_limit, label_entities, type_entities, 
                                          have_types_only, perfect_match_only)


@endpoint(['GET'], requires=[IsAuthenticated])
def candidates_aggregated(labels: List[str], language: str = 'en', query_limit: int = None,
                          perfect_match_only: bool = True, graph: str = os.environ['UWKGM_DB_GRAPHS_DEFAULT_GRAPH']) \
        -> Dict[str, int]:
    """List numbers of candidates that exactly match the given labels

    :param labels: A list of labels
    :param language: A language filter for the candidates' labels
    :param query_limit: The maximum number of candidates specified in the database query command
    :param perfect_match_only: Find only candidates that exactly match the search label
    :param graph: Graph URI
    :return: A dictionary containing the labels and their numbers of candidates
    """

    aggregated = dict()

    for label in labels:
        if label not in aggregated:
            aggregated[label] = len(candidates(label, limit=None, language=language, query_limit=query_limit,
                                               perfect_match_only=perfect_match_only, graph=graph)['exact_matches'])

    return aggregated
