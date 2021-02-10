"""Backends for MongoDB (graph database)

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import json
from typing import List

from bson import json_util
from bson.objectid import ObjectId

from uwkgm import db


def find() -> List[dict]:
    """List graphs"""

    catalogs = []

    for catalog in db.docs.catalogs.find():
        item = json.loads(json_util.dumps(catalog))
        sid = item['_id']['$oid']
        item['_id'] = sid
        catalogs.append(item)

    return catalogs


def add(catalog: dict) -> str:
    """Add a graph catalog"""
    return str(db.docs.catalogs.insert_one(catalog).inserted_id)


def edit(catalog: dict) -> int:
    """Edit a graph catalog"""
    print(catalog)
    catalog_id = catalog['_id']
    del catalog['_id']
    return db.docs.catalogs.update_one({'_id': ObjectId(catalog_id)}, {'$set': catalog}).modified_count


def delete(catalog_id: str) -> int:
    """Add a graph catalog"""
    return db.docs.catalogs.delete_one({'_id': ObjectId(catalog_id)}).deleted_count
