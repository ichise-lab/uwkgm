"""Verify triples' domain-range agreement

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import os
from typing import Tuple

from SPARQLWrapper import SPARQLWrapper, JSON
from SPARQLWrapper.SPARQLExceptions import QueryBadFormed

from rest_framework.permissions import IsAuthenticated

from dorest import verbose
from dorest.decorators import endpoint


@endpoint(['GET'], requires=[IsAuthenticated])
def dbpedia(triple: Tuple[str, str, str], predicate: str) -> bool:
    """Verify domain-range agreement using DBpedia's ontology

    :param triple: A triple (subject's entity, predicate, object's entity)
           :ex: ["http://dbpedia.org/resource/Barack_Obama", "bear in", "http://dbpedia.org/resource/Hawaii"]
    :param predicate: Entity of the predicate to be verified
           :ex: http://dbpedia.org/ontology/birthPlace
    :return: True if the predicate does not constitute domain-range violation
    """

    # NOTE: Since DBpedia is expected to be the primary service for ontology look-up in this project,
    #       removing part of the URI helps reduce redundant information showed on a screen.
    #       The following lines of code should be modified when the service endpoint is changed.
    sparql_endpoint = '%s%s/sparql/' % (os.environ['UWKGM_DB_GRAPHS_ADDRESS'],
                                        ':%s' % os.environ['UWKGM_DB_GRAPHS_PORT']
                                        if 'UWKGM_DB_GRAPHS_PORT' in os.environ else '')

    verbose.info("Verifying domain-range of a predicate '%s' with SPARQL server: %s" %
                 (predicate.replace('http://dbpedia.org/ontology/', ''), sparql_endpoint), dbpedia)

    sparql = SPARQLWrapper(sparql_endpoint)
    sparql.setQuery('SELECT DISTINCT ?vr WHERE {{ '
                    '<{0}> <http://www.w3.org/2000/01/rdf-schema#range> ?rp. '
                    '<{1}> ?vr ?rp. }}'.format(predicate, triple[2]))

    sparql.setReturnFormat(JSON)

    try:
        results = sparql.query().convert()

        for result in results['results']['bindings']:
            if len(result['vr']['value']) > 0:
                return True

    except QueryBadFormed as error:
        verbose.error(str(error), dbpedia)
        return False

    # Domain-range violation concluded
    return False
