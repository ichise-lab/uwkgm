"""Backends for Virtuoso (graph database)

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from typing import Any, Dict, Tuple

from dorest import packages

from uwkgm import db


def find(triple: Tuple[str, str, str], graph: str) -> bool:
    """Check whether a triple exists in the graph"""

    db.graphs.client.setQuery('SELECT DISTINCT ?predicate WHERE { GRAPH <%s> {<%s> ?predicate <%s>} }' %
                              (graph, triple[0], triple[2]))
    response = db.graphs.client.query().convert()['results']['bindings']

    for item in response:
        if triple[1] == item['predicate']['value']:
            return True

    return False


def add(triple: Tuple[str, str, str], graph: str) -> str:
    """Add a triple to the graph database"""

    db.graphs.client.setQuery('INSERT DATA { GRAPH <%s> {<%s> <%s> <%s>} }' % (graph, triple[0], triple[1], triple[2]))

    try:
        return db.graphs.client.query().convert()['results']['bindings'][0]['callret-0']['value']
    except Exception:
        return str(db.graphs.client.query().convert())


def delete(triple: Tuple[str, str, str], graph: str) -> str:
    """Delete a triple from the graph database"""

    db.graphs.client.setQuery('DELETE DATA { GRAPH <%s> {<%s> <%s> <%s>} }' % (graph, triple[0], triple[1], triple[2]))

    try:
        return db.graphs.client.query().convert()['results']['bindings'][0]['callret-0']['value']
    except Exception:
        return str(db.graphs.client.query().convert())


def verify(triple: Tuple[str, str, str], graph: str) -> Dict[str, Any]:
    """Verify a new triple"""

    if find(triple, graph):
        return {'result': False, 'detail': 'Triple already exists in the graph.', 'code': 'triple_already_exists'}

    if graph.startswith('http://dbpedia.org'):
        if not packages.call('kgmt.endpoints.verification.verify.agreement.dbpedia', by=__name__)(triple, triple[1]):
            return {'result': False, 'detail': 'Invalid domain-range agreement. '
                                               'Try checking the predicate and object.', 'code': 'domain_range_fail'}

    return {'result': True, 'detail': 'Triple verification pass.', 'code': 'triple_verification_pass'}
