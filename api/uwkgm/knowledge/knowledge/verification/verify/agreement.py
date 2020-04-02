"""Verify triples' domain-range agreement

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from typing import Tuple

from dorest import env, verbose
from dorest.managers.struct.decorators import endpoint
from SPARQLWrapper import SPARQLWrapper, JSON
from SPARQLWrapper.SPARQLExceptions import QueryBadFormed


@endpoint(['GET'])
def dbpedia(triple: Tuple[str, str, str], predicate: str) -> bool:
    """Verifies domain-range agreement using DBpedia's ontology

    :param triple: A triple (subject's entity, predicate, object's entity)
           :ex: ["http://dbpedia.org/resource/Barack_Obama", "bear in", "http://dbpedia.org/resource/Hawaii"]
    :param predicate: Entity of the predicate to be verified
           :ex: http://dbpedia.org/ontology/birthPlace
    :return: True if the predicate does not constitute domain-range violation
    """

    # NOTE: Since DBpedia is expected to be the primary service for ontology look-up in this project,
    #       removing part of the URI helps reduce redundant information showed on a screen.
    #       The following lines of code should be modified when the service endpoint is changed.
    config = env.resolve('database.virtuoso')
    e = '%s:%d/sparql/' % (config['address'], config['port']) if 'port' in config else '%s/sparql/' % config['address']

    verbose.info("Verifying domain-range of a predicate '%s' with SPARQL server: %s" %
                 (predicate.replace('http://dbpedia.org/ontology/', ''), e), dbpedia)

    sparql = SPARQLWrapper(e)
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
