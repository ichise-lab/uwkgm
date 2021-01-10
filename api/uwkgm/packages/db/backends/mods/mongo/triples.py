"""Backends for MongoDB (triple-modifier database)

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from datetime import datetime
from typing import List

import pymongo
from bson.objectid import ObjectId

from uwkgm import db
from ....endpoints import graphs


def find(graph: str) -> List[dict]:
    """Find multiple triple modifiers"""

    triples = []

    for triple in db.docs.triples(graph).find().sort('created', pymongo.DESCENDING):
        document = {'id': str(triple.get('_id')),
                    'action': triple.get('action'),
                    'triple': triple.get('triple'),
                    'issuer': triple.get('issuer'),
                    'created': triple.get('created').strftime('%-d %b %Y %-H:%M:%S'),
                    'api': triple.get('api'),
                    'committed': 'committed' in triple}

        if triple.get('action') == 'edit':
            document['originalTriple'] = triple.get('originalTriple')

        triples.append(document)

    return triples


def update(document: dict, graph: str) -> str:
    """Change a triple modifier"""

    if document['doc_id'] == '':
        document['created'] = datetime.now()
        document['doc_id'] = ''
        return str(db.docs.triples(graph).insert_one(document).inserted_id)
    else:
        document['created'] = db.docs.triples(graph).find_one({'_id': ObjectId(document['doc_id'])}).get('created')
        document['updated'] = datetime.now()
        return str(db.docs.triples(graph).update_one({'_id': ObjectId(document['doc_id'])},
                                                     {"$set": document}, upsert=False).modified_count)


def add(graph: str, issuer: str, api: str, triple: dict, doc_id: str) -> str:
    """Add a document containing an add-triple modifier"""

    document = dict({'action': 'add',
                     'issuer': issuer,
                     'api': api,
                     'triple': triple,
                     'doc_id': doc_id})

    return update(document, graph)


def edit(graph: str, issuer: str, api: str, triple: dict, original_triple: dict, doc_id: str) -> str:
    """Add a document containing an edit-triple modifier"""

    document = dict({'action': 'edit',
                     'issuer': issuer,
                     'api': api,
                     'triple': triple,
                     'originalTriple': original_triple,
                     'doc_id': doc_id})

    return update(document, graph)


def delete(graph: str, issuer: str, api: str, triple: dict, doc_id: str) -> str:
    """Add a document containing a delete-triple modifier"""

    document = dict({'action': 'delete',
                     'issuer': issuer,
                     'api': api,
                     'triple': triple,
                     'doc_id': doc_id})

    return update(document, graph)


def remove(document_ids: List[str], graph: str) -> int:
    """Delete a triple modifier"""

    return db.docs.triples(graph).delete_many({'_id': {'$in': [
        ObjectId(document_id) for document_id in document_ids
    ]}}).deleted_count


def commit(graph: str, graph_uri: str) -> int:
    """Commit triple modifiers that have not been committed before to the graph database"""

    n_changes = 0

    for triple in db.docs.triples(graph).find():
        if 'committed' not in triple:
            if triple.get('action') == 'add':
                t = triple.get('triple')
                graphs.triples.add((t['subject']['entity']['uri'],
                                    t['predicate']['entity']['uri'],
                                    t['object']['entity']['uri']),
                                   graph_uri)
                n_changes += 1

            elif triple.get('action') == 'delete':
                t = triple.get('triple')
                graphs.triples.delete((t['subject']['entity']['uri'],
                                       t['predicate']['entity']['uri'],
                                       t['object']['entity']['uri']),
                                      graph_uri)
                n_changes += 1

            elif triple.get('action') == 'edit':
                origin = triple.get('originalTriple')
                target = triple.get('triple')
                graphs.triples.delete((origin['subject']['entity']['uri'],
                                       origin['predicate']['entity']['uri'],
                                       origin['object']['entity']['uri']),
                                      graph_uri)
                graphs.triples.add((target['subject']['entity']['uri'],
                                    target['predicate']['entity']['uri'],
                                    target['object']['entity']['uri']),
                                   graph_uri)
                n_changes += 1

            db.docs.triples(graph).update({'_id': triple.get('_id')}, {'$set': {'committed': True}})

    return n_changes
