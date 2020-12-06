"""Backends for MongoDB (triple-modifier database)

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from uwkgm import db


def add(document: dict) -> str:
    """Add a document containing the given text"""

    return str(db.docs.uwkgm['texts'].insert_one(document).inserted_id)
