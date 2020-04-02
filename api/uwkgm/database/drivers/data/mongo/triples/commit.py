"""MongoDB driver: Commit triple modifiers to the graph database

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from database.database.graph.triples import add, delete
from database.drivers.data.mongo import mongo


def auto() -> int:
    """Commits triple modifiers that have not been committed before to the graph database"""

    n_changes = 0

    for triple in mongo['triples'].find():
        if 'committed' not in triple:
            if triple.get('action') == 'add':
                t = triple.get('triple')
                add.single((t['subject']['entity'], t['predicate']['entity'], t['object']['entity']))
                n_changes += 1

            elif triple.get('action') == 'delete':
                t = triple.get('triple')
                delete.single((t['subject']['entity'], t['predicate']['entity'], t['object']['entity']))
                n_changes += 1

            elif triple.get('action') == 'edit':
                origin = triple.get('originalTriple')
                target = triple.get('triple')
                delete.single((origin['subject']['entity'], origin['predicate']['entity'], origin['object']['entity']))
                add.single((target['subject']['entity'], target['predicate']['entity'], target['object']['entity']))
                n_changes += 1

            mongo['triples'].update({'_id': triple.get('_id')}, {'$set': {'committed': True}})

    return n_changes
