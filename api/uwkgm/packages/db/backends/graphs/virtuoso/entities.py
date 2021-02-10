"""Backends for Virtuoso (graph database)

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import time
from socket import timeout
from typing import Any, Dict, List, Union

from uwkgm import db


def find(graph: str, uris: List[str], language: str, query_limit: Union[int, None],
         include_incomings: bool, include_outgoings: bool) -> dict:
    """Find triples of which the given entity is a subject or an object"""

    def fetch(direction: str) -> List[dict]:
        query_main = f'?{target} ?predicate <{uri}>' if direction == 'incoming' else f'<{uri}> ?predicate ?{target}'
        query_lang = f"""
                       FILTER (!isLiteral(?predicate_label) || langMatches(lang(?predicate_label), '') || langMatches(lang(?predicate_label), '{language}'))
                       FILTER (!isLiteral(?{target}) || langMatches(lang(?{target}), '') || langMatches(lang(?{target}), '{language}'))
                       FILTER (!isLiteral(?{target}_label) || langMatches(lang(?{target}_label), '') || langMatches(lang(?{target}_label), '{language}'))
                      """
        limit_filter = f'LIMIT {int(query_limit)}' if query_limit is not None else ''

        query = f"""
                 SELECT DISTINCT ?predicate ?predicate_type ?predicate_label ?{target} ?{target}_type ?{target}_label FROM <{graph}> WHERE {{
                     {query_main}
                     OPTIONAL {{ ?predicate <{'>|<'.join(catalog_labels)}> ?predicate_label }}
                     OPTIONAL {{ ?predicate <{'>|<'.join(catalog_types)}> ?predicate_type }}
                     OPTIONAL {{ ?{target} <{'>|<'.join(catalog_labels)}> ?{target}_label }}
                     OPTIONAL {{ ?{target} <{'>|<'.join(catalog_types)}> ?{target}_type }}
                     {query_lang if language is not None else ''}
                 }}
                 {limit_filter}
                """

        db.graphs.client.setQuery(query)
        return db.graphs.client.query().convert()['results']['bindings']

    def maps() -> None:
        for item in items:
            for el in ['predicate', 'predicate_type', target, f'{target}_type']:
                if el in item and item[el]['type'] == 'uri':
                    if item[el]['value'] not in lookup:
                        lookup[item[el]['value']] = {'id': len(lookup)}

    def assign() -> None:
        for item in items:
            if item[target]['type'] == 'uri':
                if element == 'subject':
                    triples.append((lookup[uri]['id'], lookup[item['predicate']['value']]['id'], lookup[item['object']['value']]['id']))
                    if item['predicate']['value'] in catalog_types:
                        if 'types' not in lookup[uri]:
                            lookup[uri]['types'] = [lookup[item['object']['value']]['id']]
                        else:
                            lookup[uri]['types'].append(lookup[item['object']['value']]['id'])
                else:
                    triples.append((lookup[item['subject']['value']]['id'], lookup[item['predicate']['value']]['id'], lookup[uri]['id']))

            else:
                if 'xml:lang' in item[target]:
                    literal = {'value': item[target]['value'], 'language': item[target]['xml:lang']}
                else:
                    literal = {'value': item[target]['value']}

                if 'literals' not in lookup[uri]:
                    lookup[uri]['literals'] = {lookup[item['predicate']['value']]['id']: literal}
                else:
                    lookup[uri]['literals'][lookup[item['predicate']['value']]['id']] = literal

                if item['predicate']['value'] in catalog_labels:
                    lookup[uri]['label'] = item[target]['value']

            if 'predicate_label' in item:
                lookup[item['predicate']['value']]['label'] = item['predicate_label']['value']
            if f'{target}_label' in item:
                lookup[item[target]['value']]['label'] = item[f'{target}_label']['value']

            if 'predicate_type' in item:
                if 'types' not in lookup[item['predicate']['value']]:
                    lookup[item['predicate']['value']]['types'] = [lookup[item['predicate_type']['value']]['id']]
                elif lookup[item['predicate_type']['value']]['id'] not in lookup[item['predicate']['value']]['types']:
                    lookup[item['predicate']['value']]['types'].append(lookup[item['predicate_type']['value']]['id'])
            if f'{target}_type' in item:
                if 'types' not in lookup[item[target]['value']]:
                    lookup[item[target]['value']]['types'] = [lookup[item[f'{target}_type']['value']]['id']]
                elif lookup[item[f'{target}_type']['value']]['id'] not in lookup[item[target]['value']]['types']:
                    lookup[item[target]['value']]['types'].append(lookup[item[f'{target}_type']['value']]['id'])

    time_start = time.process_time()
    catalog = db.docs.catalog(graph)
    catalog_labels = [lb['uri'] for lb in catalog['predicates']['labels']]
    catalog_types = [ty['uri'] for ty in catalog['predicates']['types']]
    lookup = dict()
    triples = list()

    for i, uri in enumerate(uris):
        lookup[uri] = {'id': i}

    for uri in uris:
        if include_incomings:
            element, target = 'object', 'subject'
            items = fetch('incoming')
            maps()
            assign()

        if include_outgoings:
            element, target = 'subject', 'object'
            items = fetch('outgoing')
            maps()
            assign()

    time_end = time.process_time()

    return {'lookup': lookup, 'triples': triples, 'duration': time_end - time_start}


def candidates(graph: str, search: str, limit: Union[int, None], query_limit: [int, None], label_entities: List[str],
               type_entities: List[str], have_types_only: bool, perfect_match_only: bool) -> Dict[str, List[Dict[str, Union[str, List[str]]]]]:
    """Find candidates of entities given an entity or a partial/full label"""

    def fetch_from_label(perfect_match: bool):
        if perfect_match:
            terms = ['"%s"' % term for term in search.strip().split(' ')]
        else:
            # Each word in the search term needs at least four characters to be included in partial search
            # The asterisk (*) indicates partial search
            terms = ['"%s*"' % term.strip(',') if len(term) > 3 else '"%s"' % term
                     for term in search.strip().split(' ')]

        # Search terms are joined by 'AND' operators
        query = 'SELECT DISTINCT ?entity, ?label, ?type FROM <%s> WHERE { ' % graph
        partial_queries = []

        for label_entity in label_entities:
            labeled_query = '{ ?entity <%s> ?label . ' % label_entity
            labeled_query += '?label bif:contains \'%s\' ' % ' AND '.join(terms)

            if have_types_only:
                for type_entity in type_entities:
                    typed_query = labeled_query + '. ?entity <%s> ?type } ' % type_entity
                    partial_queries.append(typed_query)

            else:
                partial_queries.append('%s }' % labeled_query)
        
        query += ' UNION '.join(partial_queries)
        
        if not have_types_only:
            for type_entity in type_entities:
                query += 'OPTIONAL { ?entity <%s> ?type } ' % type_entity

        if perfect_match:
            query += 'FILTER (lcase(str(?label)) = "%s") ' % search.lower().strip()
        
        query += '} %s' % limit_filter
        db.graphs.client.setQuery(query)

        try:
            return db.graphs.client.query().convert()['results']['bindings']
        except timeout:
            return []

    def fetch_from_uri():
        query = 'SELECT DISTINCT ?label, ?type FROM <%s> WHERE { ' % graph
        partial_queries = []

        for label_entity in label_entities:
            labeled_query = '{ <%s> <%s> ?label ' % (search, label_entity)

            if have_types_only:
                for type_entity in type_entities:
                    typed_query = labeled_query + '. <%s> <%s> ?type } ' % (search, type_entity)
                    partial_queries.append(typed_query)

            else:
                partial_queries.append('%s }' % labeled_query)

        query += ' UNION '.join(partial_queries)

        if not have_types_only:
            for type_entity in type_entities:
                query += 'OPTIONAL { <%s> <%s> ?type } ' % (search, type_entity)

        query += '} %s' % limit_filter
        db.graphs.client.setQuery(query)

        try:
            return db.graphs.client.query().convert()['results']['bindings']
        except timeout:
            return []

    def filter_types(entries: list) -> list:
        filtered = []

        for entry in entries:
            types = [tag.lower() for tag in entry[1]['types'] if isinstance(tag, str)]

            if len(pos_type_tags):
                if all(any(pos.lower() in tag for tag in types) for pos in pos_type_tags):
                    if len(neg_type_tags):
                        if all(all(neg.lower() not in tag for tag in types) for neg in neg_type_tags):
                            filtered.append(entry)
                    else:
                        filtered.append(entry)

            elif len(neg_type_tags):
                if all(all(neg.lower() not in tag for tag in types) for neg in neg_type_tags):
                    filtered.append(entry)

            else:
                filtered.append(entry)

        return filtered

    limit_filter = "LIMIT %d" % query_limit if query_limit is not None else ''
    matches = dict()

    terms = search.split(' ')
    pos_type_tags = []
    neg_type_tags = []
    filtered_terms = []

    for term in terms:
        if term.startswith('+type:'):
            pos_type_tags += term.split(':')[1:]
        elif term.startswith('-type:'):
            neg_type_tags += term.split(':')[1:]
        else:
            filtered_terms.append(term)

    search = ' '.join(filtered_terms)

    if len(search) == 0:
        return {'exact_matches': [], 'first_matches': [], 'partial_matches': []}

    if search.startswith('http://') or search.startswith('https://'):
        response = fetch_from_uri()

    else:
        # Try searching for perfect matches first since perfect-match search is the fastest due to indexing
        response = fetch_from_label(True)

        # If not perfect matches found, try partial matches
        if len(response) == 0 and not perfect_match_only:
            response = fetch_from_label(False)

    # Convert the response into a clean dictionary-based output
    for item in response:
        uri = search if search.startswith('http://') or search.startswith('https://') else item['entity']['value']
        entity_label, entity_types = item['label']['value'], item['type']['value'] if 'type' in item else []

        if uri not in matches:
            matches[uri] = {'label': entity_label, 'types': [entity_types]}
        else:
            matches[uri]['types'].append(entity_types)

    results = {'exact_matches': [], 'first_matches': [], 'partial_matches': []}

    # Categorizes matches in to 'exact', 'first', and 'partial' lists
    for uri, data in matches.items():
        norm_search = search.lower()
        entity_label = data['label'].lower()

        if norm_search == entity_label:
            results['exact_matches'].append((len(entity_label), {'uri': uri, **data}))
        elif entity_label.startswith(norm_search):
            results['first_matches'].append((len(entity_label), {'uri': uri, **data}))
        else:
            results['partial_matches'].append((len(entity_label), {'uri': uri, **data}))

    # Return matches with shorter labels first
    results['exact_matches'].sort(key=lambda x: x[0])
    results['first_matches'].sort(key=lambda x: x[0])
    results['partial_matches'].sort(key=lambda x: x[0])

    results['exact_matches'] = filter_types(results['exact_matches'])
    results['first_matches'] = filter_types(results['first_matches'])
    results['partial_matches'] = filter_types(results['partial_matches'])

    if limit is not None:
        return {'exact_matches': [entity[1] for entity in results['exact_matches'][:limit]],
                'first_matches': [entity[1] for entity in results['first_matches'][:limit - len(results['first_matches'])]],
                'partial_matches': [entity[1] for entity in
                                    results['partial_matches'][:limit - len(results['first_matches']) - len(results['partial_matches'])]]}

    else:
        return {'exact_matches': [entity[1] for entity in results['exact_matches']],
                'first_matches': [entity[1] for entity in results['first_matches']],
                'partial_matches': [entity[1] for entity in results['partial_matches']]}


def entity(graph: str, subject: str, label_entities: List[str], type_entities: str):
    """Find objects or an attribute given subject and predicate"""

    query = """SELECT DISTINCT ?predicate ?predicate_label ?predicate_type ?object ?object_label ?object_type 
            FROM <%s> WHERE { <%s> ?predicate ?object . """ % (graph, subject)

    for label_entity in label_entities:
        query += 'OPTIONAL { ?predicate <%s> ?predicate_label . ?object <%s> ?object_label } . ' \
                 % (label_entity, label_entity)

    for type_entity in type_entities:
        query += 'OPTIONAL { ?predicate <%s> ?predicate_type . ?object <%s> ?object_type } . ' \
                 % (type_entity, type_entity)

    query += '} '
    db.graphs.client.setQuery(query)
    response = db.graphs.client.query().convert()['results']['bindings']

    results = {}

    for item in response:
        predicate_value = item['predicate']['value']
        object_value = item['object']['value']

        if predicate_value not in results:
            results[predicate_value] = {}

        predicate = results[predicate_value]

        if 'predicate_label' in item:
            label = {'value': item['predicate_label']['value']}

            if 'xml:lang' in item['predicate_label']:
                label['language'] = item['predicate_label']['xml:lang']

            if 'labels' not in predicate:
                predicate['labels'] = [label]
            elif label not in predicate['labels']:
                predicate['labels'].append(label)

        if 'predicate_type' in item:
            typ = item['predicate_type']['value']

            if 'types' not in predicate:
                predicate['types'] = [typ]
            elif typ not in predicate['types']:
                predicate['types'].append(typ)

        if item['object']['type'] == 'uri':
            if 'objects' not in predicate:
                predicate['objects'] = {object_value: {}}
            elif item['object']['value'] not in predicate['objects']:
                predicate['objects'][object_value] = {}

            obj = predicate['objects'][object_value]

            if 'object_label' in item:
                label = {'value': item['object_label']['value']}

                if 'xml:lang' in item['object_label']:
                    label['language'] = item['object_label']['xml:lang']

                if 'labels' not in obj:
                    obj['labels'] = [label]
                elif label not in obj['labels']:
                    obj['labels'].append(label)

            if 'object_type' in item:
                typ = item['object_type']['value']

                if 'types' not in obj:
                    obj['types'] = [typ]
                elif typ not in obj['types']:
                    obj['types'].append(typ)

        elif item['object']['type'] in ('literal', 'typed-literal'):
            attribute = {'value': item['object']['value']}

            if 'xml:lang' in item['object']:
                attribute['language'] = item['object']['xml:lang']

            if 'datatype' in item['object']:
                attribute['datatype'] = item['object']['datatype']

            if 'attributes' not in predicate:
                predicate['attributes'] = [attribute]
            elif attribute not in predicate['attributes']:
                predicate['attributes'].append(attribute)

    return results
