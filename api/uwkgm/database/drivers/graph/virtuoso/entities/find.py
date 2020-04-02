"""Virtuoso driver: Find entities in the graph database

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from typing import Dict, List, Union

from database.drivers.graph.virtuoso import client


def candidates(graph: str, label: str, limit: Union[int, None], language: str, query_limit: int, perfect_match_only: bool) -> \
        Dict[str, List[Dict[str, Union[str, List[str]]]]]:
    """Finds candidates of entities given a partial or full label"""

    def fetch(perfect_match: bool):
        if perfect_match:
            terms = ['"%s"' % term for term in label.strip().split(' ')]
        else:
            # Each word in the search term needs at least four characters to be included in partial search
            # The asterisk (*) indicates partial search
            terms = ['"%s*"' % term if len(term) > 3 else '"%s"' % term for term in label.strip().split(' ')]

        # Search terms are joined by 'AND' operators
        client.setQuery('SELECT DISTINCT ?entity, ?label, ?type FROM <%s> WHERE {'
                        '?entity <http://www.w3.org/2000/01/rdf-schema#label> ?label ; a ?type .'
                        '?label bif:contains \'%s\' %s} %s' % (graph, ' and '.join(terms), language_filter, limit_filter))

        return client.query().convert()['results']['bindings']

    language_filter = "FILTER (lang(?label) = '%s')" % language if language is not None and len(language) else ''
    limit_filter = "LIMIT %d" % query_limit if query_limit is not None else ''
    matches = dict()

    # Try searching for perfect matches first since perfect-match search is the fastest due to indexing
    response = fetch(True)

    # If not perfect matches found, try partial matches
    if len(response) == 0 and not perfect_match_only:
        response = fetch(False)

    # Convert the response into a clean dictionary-based output
    for item in response:
        entity, entity_label, entity_types = item['entity']['value'], item['label']['value'], item['type']['value'] if 'type' in item else []

        if entity not in matches:
            matches[entity] = {'label': entity_label, 'types': [entity_types]}
        else:
            matches[entity]['types'].append(entity_types)

    results = {'exact_matches': [], 'first_matches': [], 'partial_matches': []}

    # Categorizes matches in to 'exact', 'first', and 'partial' lists
    for entity, data in matches.items():
        search = label.lower()
        entity_label = data['label'].lower()

        if search == entity_label:
            results['exact_matches'].append((len(entity_label), {'entity': entity, **data}))
        elif entity_label.startswith(search):
            results['first_matches'].append((len(entity_label), {'entity': entity, **data}))
        else:
            results['partial_matches'].append((len(entity_label), {'entity': entity, **data}))

    # Return matches with shorter labels first
    results['exact_matches'].sort(key=lambda x: x[0])
    results['first_matches'].sort(key=lambda x: x[0])
    results['partial_matches'].sort(key=lambda x: x[0])

    if limit is not None:
        return {'exact_matches': [entity[1] for entity in results['exact_matches'][:limit]],
                'first_matches': [entity[1] for entity in results['first_matches'][:limit - len(results['first_matches'])]],
                'partial_matches': [entity[1] for entity in
                                    results['partial_matches'][:limit - len(results['first_matches']) - len(results['partial_matches'])]]}

    else:
        return {'exact_matches': [entity[1] for entity in results['exact_matches']],
                'first_matches': [entity[1] for entity in results['first_matches']],
                'partial_matches': [entity[1] for entity in results['partial_matches']]}


def single(graph: str, entity: str, as_element: Union[str, None], limit: int) -> Dict[str, List[Dict[str, str]]]:
    """Finds triples which the given entity is a part of (as subject, predicate, object, or any)"""

    results = {'subject': None, 'predicate': None, 'object': None}

    if as_element is None or as_element == 'subject':
        client.setQuery('SELECT DISTINCT ?predicate ?predicateLabel ?object ?objectLabel FROM <%s> WHERE {'
                        '<%s> ?predicate ?object '
                        'OPTIONAL { ?predicate <http://www.w3.org/2000/01/rdf-schema#label> ?predicateLabel } '
                        'OPTIONAL { ?object <http://www.w3.org/2000/01/rdf-schema#label> ?objectLabel } '
                        '}' % (graph, entity))
        results['subject'] = client.query().convert()['results']['bindings'][:limit]

    if as_element is None or as_element == 'predicate':
        client.setQuery('SELECT DISTINCT ?subject ?subjectLabel ?object ?objectLabel WHERE {'
                        '?subject <%s> ?object '
                        'OPTIONAL { ?subject <http://www.w3.org/2000/01/rdf-schema#label> ?subjectLabel } '
                        'OPTIONAL { ?object <http://www.w3.org/2000/01/rdf-schema#label> ?objectLabel } '
                        '}' % entity)
        results['predicate'] = client.query().convert()['results']['bindings'][:limit]

    if as_element is None or as_element == 'object':
        client.setQuery('SELECT DISTINCT ?subject ?subjectLabel ?predicate ?predicateLabel WHERE {'
                        '?subject ?predicate <%s> '
                        'OPTIONAL { ?subject <http://www.w3.org/2000/01/rdf-schema#label> ?subjectLabel } '
                        'OPTIONAL { ?predicate <http://www.w3.org/2000/01/rdf-schema#label> ?predicateLabel } '
                        '}' % entity)
        results['object'] = client.query().convert()['results']['bindings'][:limit]

    return results


# def relations(source: str, targets: List[str]) -> Dict[str, List[Dict[str, str]]]:
#    results = dict()
#
#    for target in targets:
#        client.setQuery('SELECT DISTINCT ?sourcePredicate ?targetPredicate ?object ?label WHERE {'
#                        '<%s> ?sourcePredicate ?object . <%s> ?targetPredicate ?object . '
#                        '?object <http://www.w3.org/2000/01/rdf-schema#label> ?label }' % (source, target))
#
#        result = client.query().convert()['results']['bindings']
#        results[target] = result
#
#    return results
