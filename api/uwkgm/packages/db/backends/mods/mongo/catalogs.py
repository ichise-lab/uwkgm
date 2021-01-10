"""Backends for MongoDB (graph database)

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import json
from typing import List

from bson import json_util

from uwkgm import db


def find() -> List[dict]:
    """List graphs"""

    catalogs = []

    for catalog in db.docs.catalogs.find():
        item = json.loads(json_util.dumps(catalog))
        del item['_id']
        catalogs.append(item)

    return catalogs
