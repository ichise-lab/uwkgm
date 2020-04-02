"""Exceptions related to configuration

The Dorest project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from typing import List


class UnsupportedFileTypeError(Exception):
    """A configuration file must be in either YAML or JSON formats"""

    def __init__(self, path: str, supported_types: List[str]):
        self.path = path
        self.supported_types = supported_types

    def __str__(self):
        return "Unsupported file type for '%s'. Accept: %s" % (self.path, ', '.join(self.supported_types))
