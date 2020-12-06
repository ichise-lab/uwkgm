"""Backends for Virtuoso (graph database)

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import time
from socket import timeout
from typing import Any, Dict, List, Set, Union

from uwkgm import db


def find(graph: str, entities: List[str], language: str, limit: Union[int, None], query_limit: Union[int, None],
         predicates: Dict[str, Dict[str, Union[Dict[str, str], str]]], include_incomings: bool, include_outgoings: bool) -> dict:

    def convert_entities(items: List[str]) -> str:
        return '|'.join(['<%s>' % item for item in items])

    def gen_lang_filter(element: str) -> str:
        return "(!isLiteral(?%s) || langMatches(lang(?%s), '') || langMatches(lang(?%s), '%s'))" % (element, element, element, language)

    def fetch(entity: str, direction: str) -> List[dict]:
        target_element = 'subject' if direction == 'incomings' else 'object'

        query = 'SELECT DISTINCT ?predicate ?%s ' % (target_element)
        
        if predicates[direction]['predicates'] == 'all':
            query += '?predicate_all_predicate ?predicate_all_object '
        else:
            for key in predicates[direction]['predicates']:
                query += '?predicate_%s ' % key
        
        if predicates[direction]['targets'] == 'all':
            query += '?%s_all_predicate ?%s_all_object ' % (target_element, target_element)
        else:
            for key in predicates[direction]['targets']:
                query += '?%s_%s ' % (target_element, key)
        
        query += 'FROM <%s> WHERE { ' % graph
        query += '?subject ?predicate <%s> ' % entity if direction == 'incomings' else '<%s> ?predicate ?object ' % entity

        if predicates[direction]['predicates'] == 'all':
            query += 'OPTIONAL { ?predicate ?predicate_all_predicate ?predicate_all_object } '
        else:
            for key, value in predicates[direction]['predicates'].items():
                query += 'OPTIONAL { ?predicate %s ?predicate_%s } ' % (convert_entities(value), key)

        if predicates[direction]['targets'] == 'all':
            query += 'OPTIONAL { ?%s ?%s_all_predicate ?%s_all_object }' % (target_element, target_element, target_element)
        else:
            for key, value in predicates[direction]['targets'].items():
                query += 'OPTIONAL { ?%s %s ?%s_%s } ' % (target_element, convert_entities(value), target_element, key)

        if language is not None and len(language):
            filters = [gen_lang_filter(target_element)]

            if predicates[direction]['predicates'] == 'all':
                filters.append(gen_lang_filter('predicate_all_object'))
            else:
                for key in predicates[direction]['predicates']:
                    filters.append(gen_lang_filter('predicate_%s' % key))
            
            if predicates[direction]['targets'] == 'all':
                filters.append(gen_lang_filter('%s_all_object' % target_element))
            else:
                for key in predicates[direction]['targets']:
                    filters.append(gen_lang_filter('%s_%s' % (target_element, key)))
            
            query += 'FILTER ( %s ) ' % ' && '.join(filters)

        query += '} %s ' % limit_filter

        db.graphs.client.setQuery(query)
        return db.graphs.client.query().convert()['results']['bindings']
    
    def get_or_create_id(entity: str) -> int:
        if entity not in nodes:
            entity_id = len(nodes)
            nodes[entity] = {'id': entity_id}
        else:
            entity_id = nodes[entity]['id']
        
        return entity_id

    def assign_link(subject: str, predicate: str, obj: str) -> None:
        subject_id = get_or_create_id(subject)
        predicate_id = get_or_create_id(predicate)
        object_id = get_or_create_id(obj)

        if 'outgoings' not in nodes[subject]:
            nodes[subject]['outgoings'] = dict()
        
        if predicate_id not in nodes[subject]['outgoings']:
            nodes[subject]['outgoings'][predicate_id] = list()
        
        if object_id not in nodes[subject]['outgoings'][predicate_id]:
            nodes[subject]['outgoings'][predicate_id].append(object_id)

    def assign_attr(subject: str, predicate: str, value: Any) -> None:
        subject_id = get_or_create_id(subject)
        predicate_id = get_or_create_id(predicate)

        if 'attributes' not in nodes[subject]:
            nodes[subject]['attributes'] = dict()
        
        nodes[subject]['attributes'][predicate_id] = value

    def assign(source: str, predicate: str, target: str, target_type: str) -> None:
        if target_type == 'uri':
            assign_link(source, predicate, target)
        else:
            assign_attr(source, predicate, target)

    def process(entity: str, items: List[dict], direction: str) -> None:
        target_element = 'subject' if direction == 'incomings' else 'object'

        for item in items:
            if direction == 'incomings':
                assign(item[target_element]['value'],
                       item['predicate']['value'],
                       entity,
                       'uri')
            else:
                assign(entity,
                       item['predicate']['value'],
                       item[target_element]['value'],
                       item[target_element]['type'])
            
            if predicates[direction]['predicates'] == 'all':
                if 'predicate_all_predicate' in item:
                    assign(item['predicate']['value'],
                           item['predicate_all_predicate']['value'],
                           item['predicate_all_object']['value'],
                           item['predicate_all_object']['type'])
            else:
                for key, value in predicates[direction]['predicates'].items():
                    if 'predicate_%s' % key in item:
                        assign(item['predicate']['value'],
                               key,
                               item['predicate_%s' % key]['value'],
                               item['predicate_%s' % key]['type'])

            if predicates[direction]['targets'] == 'all':
                if '%s_all_predicate' % target_element in item:
                    assign(item[target_element]['value'],
                           item['%s_all_predicate' % target_element]['value'],
                           item['%s_all_object' % target_element]['value'],
                           item['%s_all_object' % target_element]['type'])
            else:
                for key, value in predicates[direction]['targets'].items():
                    if '%s_%s' % (target_element, key) in item:
                        assign(item[target_element]['value'],
                               key,
                               item['%s_%s' % (target_element, key)]['value'],
                               item['%s_%s' % (target_element, key)]['type'])

    time_start = time.process_time()
    limit_filter = "LIMIT %d" % query_limit if query_limit is not None else ''
    nodes = dict()

    for i, entity in enumerate(entities):
        nodes[entity] = {'id': i, 'isMainNode': True}
    
    for entity in entities:
        if include_incomings:
            items = fetch(entity, 'incomings')
            process(entity, items, 'incomings')
        
        if include_outgoings:
            items = fetch(entity, 'outgoings')
            process(entity, items, 'outgoings')
    
    time_end = time.process_time()

    return {'nodes': nodes, 'duration': time_end - time_start}


def candidates(graph: str, search: str, language: str, limit: Union[int, None], query_limit: [int, None], label_entities: List[str], 
               type_entities: List[str], have_types_only: bool, perfect_match_only: bool) -> Dict[str, List[Dict[str, Union[str, List[str]]]]]:
    """Find candidates of entities given an entity or a partial/full label"""

    def fetch(perfect_match: bool):
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

        for entity in label_entities:
            labeled_query = '{ ?entity <%s> ?label . ' % entity
            labeled_query += '?label bif:contains \'%s\' ' % ' AND '.join(terms)

            if have_types_only:
                for entity in type_entities:
                    typed_query = labeled_query + '. ?entity <%s> ?type } ' % entity
                    partial_queries.append(typed_query)

            else:
                partial_queries.append('%s }' % labeled_query)
        
        query += ' UNION '.join(partial_queries)
        
        if not have_types_only:
            for entity in type_entities:
                query += 'OPTIONAL { ?entity <%s> ?type } ' % entity

        for entity in type_entities:
            query += 'OPTIONAL { ?entity <%s> ?type } ' % entity

        if perfect_match:
            query += 'FILTER (lcase(str(?label)) = "%s") ' % search.lower().strip()
        
        query += '%s } %s' % (language_filter, limit_filter)
        db.graphs.client.setQuery(query)

        try:
            return db.graphs.client.query().convert()['results']['bindings']
        except timeout:
            return []

    language_filter = "FILTER (langMatches(lang(?label), '%s') || langMatches(lang(?label), '')) " % language \
        if language is not None and len(language) else ''
    limit_filter = "LIMIT %d" % query_limit if query_limit is not None else ''
    matches = dict()

    # Try searching for perfect matches first since perfect-match search is the fastest due to indexing
    response = fetch(True)

    # If not perfect matches found, try partial matches
    if len(response) == 0 and not perfect_match_only:
        response = fetch(False)

    # Convert the response into a clean dictionary-based output
    for item in response:
        entity, entity_label, entity_types = item['entity']['value'], item['label']['value'], item['type']['value']\
            if 'type' in item else []

        if entity not in matches:
            matches[entity] = {'label': entity_label, 'types': [entity_types]}
        else:
            matches[entity]['types'].append(entity_types)

    results = {'exact_matches': [], 'first_matches': [], 'partial_matches': []}

    # Categorizes matches in to 'exact', 'first', and 'partial' lists
    for entity, data in matches.items():
        norm_search = search.lower()
        entity_label = data['label'].lower()

        if norm_search == entity_label:
            results['exact_matches'].append((len(entity_label), {'entity': entity, **data}))
        elif entity_label.startswith(norm_search):
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
