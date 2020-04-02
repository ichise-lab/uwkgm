"""Structured API endpoint glossary

The Dorest project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from enum import Enum


class Glossary(Enum):
    META_CLASS = 'CLASS'
    META_ENDPOINT = 'ENDPOINT'
    REDIRECT = '__struct_redirect'
    RESOURCES = '__struct_resources'
    ROOT = '__struct_root'
