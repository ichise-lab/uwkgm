"""Backends for MongoDB (triple-modifier database)

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from typing import List

import pymongo
from bson.objectid import ObjectId

from uwkgm import db
from ....endpoints import graphs


def find() -> List[dict]:
    """Finds multiple triple modifiers"""

    triples = []

    for triple in db.docs.uwkgm['triples'].find().sort('created', pymongo.DESCENDING):
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


def add(document: dict) -> str:
    """Adds a document containing an add-triple modifier"""

    return str(db.docs.uwkgm['triples'].insert_one(document).inserted_id)


def edit(document: dict) -> str:
    """Adds a document containing an edit-triple modifier"""

    return str(db.docs.uwkgm['triples'].insert_one(document).inserted_id)


def delete(document: dict) -> str:
    """Adds a document containing a delete-triple modifier"""

    return str(db.docs.uwkgm['triples'].insert_one(document).inserted_id)


def remove(document_id: str) -> int:
    """Delete a triple modifier"""

    return db.docs.uwkgm['triples'].delete_one({'_id': ObjectId(document_id.strip('"'))}).deleted_count


def commit() -> int:
    """Commit triple modifiers that have not been committed before to the graph database"""

    n_changes = 0

    for triple in db.docs.uwkgm['triples'].find():
        if 'committed' not in triple:
            if triple.get('action') == 'add':
                t = triple.get('triple')
                graphs.triples.add((t['subject']['entity'], t['predicate']['entity'], t['object']['entity']))
                n_changes += 1

            elif triple.get('action') == 'delete':
                t = triple.get('triple')
                graphs.triples.delete((t['subject']['entity'], t['predicate']['entity'], t['object']['entity']))
                n_changes += 1

            elif triple.get('action') == 'edit':
                origin = triple.get('originalTriple')
                target = triple.get('triple')
                graphs.triples.delete((origin['subject']['entity'], origin['predicate']['entity'], origin['object']['entity']))
                graphs.triples.add((target['subject']['entity'], target['predicate']['entity'], target['object']['entity']))
                n_changes += 1

            db.docs.uwkgm['triples'].update({'_id': triple.get('_id')}, {'$set': {'committed': True}})

    return n_changes
