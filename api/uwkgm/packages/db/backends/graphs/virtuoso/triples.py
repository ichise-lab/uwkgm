"""Backends for Virtuoso (graph database)

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from typing import Any, Dict, Tuple

from dorest import packages

from uwkgm import db


def find(graph_uri: str, triple: Tuple[str, str, str]) -> bool:
    """Check whether a triple exists in the graph"""

    db.graphs.client.setQuery('SELECT DISTINCT ?predicate WHERE { GRAPH <%s> {<%s> ?predicate <%s>} }' %
                              (graph_uri, triple[0], triple[2]))
    response = db.graphs.client.query().convert()['results']['bindings']

    for item in response:
        if triple[1] == item['predicate']['value']:
            return True

    return False


def add(graph_uri: str, triple: Tuple[str, str, str], literal: str = None, language: str = None) -> str:
    """Add a triple to the graph database"""

    if literal is None:
        db.graphs.client.setQuery('INSERT DATA { GRAPH <%s> {<%s> <%s> <%s>} }' % (graph_uri, triple[0], triple[1], triple[2]))
    else:
        if triple[2] == 'http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral':
            if language is None:
                db.graphs.client.setQuery('INSERT DATA { GRAPH <%s> {<%s> <%s> "%s"} }' % (graph_uri, triple[0], triple[1], literal))
            else:
                db.graphs.client.setQuery('INSERT DATA { GRAPH <%s> {<%s> <%s> "%s"@%s} }' % (graph_uri, triple[0], triple[1], literal, language))

        else:
            db.graphs.client.setQuery('INSERT DATA { GRAPH <%s> {<%s> <%s> "%s"^^%s} }' % (graph_uri, triple[0], triple[1], literal, triple[2]))

    try:
        return db.graphs.client.query().convert()['results']['bindings'][0]['callret-0']['value']
    except Exception:
        return str(db.graphs.client.query().convert())


def delete(graph_uri: str, triple: Tuple[str, str, str], literal: str = None, language: str = None) -> str:
    """Delete a triple from the graph database"""

    db.graphs.client.setQuery('DELETE DATA { GRAPH <%s> {<%s> <%s> <%s>} }' % (graph_uri, triple[0], triple[1], triple[2]))

    try:
        return db.graphs.client.query().convert()['results']['bindings'][0]['callret-0']['value']
    except Exception:
        return str(db.graphs.client.query().convert())


def verify(graph_uri: str, triple: Tuple[str, str, str]) -> Dict[str, Any]:
    """Verify a new triple"""

    if find(graph_uri, triple):
        return {'result': False, 'detail': 'Triple already exists in the graph.', 'code': 'triple_already_exists'}

    if graph_uri.startswith('http://dbpedia.org'):
        if not packages.call('kgmt.endpoints.verification.verify.agreement.dbpedia', by=__name__)(triple, triple[1]):
            return {'result': False, 'detail': 'Invalid domain-range agreement. '
                                               'Try checking the predicate and object.', 'code': 'domain_range_fail'}

    return {'result': True, 'detail': 'Triple verification pass.', 'code': 'triple_verification_pass'}
