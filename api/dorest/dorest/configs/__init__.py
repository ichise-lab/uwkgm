"""Configuration resolver

The 'resolve' function reads all YAML and JSON configurations in the directory specified in a Django project's setting file.
The function returns a dictionary of a tree with configuration file names as the first level.

For example, suppose there is a file named 'foo.yaml' with the following content:
---
greet:
    message: Hello!
---
Calling 'configs.resolve("foo.greet")' would return a dictionary '{message: "Hello!"}',
and calling 'configs.resolve("foo.greet.message")' would return a string "Hello!".

The configuration content may refer to other configuration files within the same tree by wrapping variable name in double curly brackets.
For example, suppose there is another file named 'bar.yaml' with the following content:
---
welcome:
    message: "{{foo.say.message}} human"
---
Calling 'configs.resolve("bar.welcome.message")' would return a string "Hello! human".

Dorest provides predefined variables and functions, which can be accessed by adding $ following the opening curly brackets:
---
base: "{{$base_dir}}"
version: "{{$env({'name': 'DJANGO_VERSION'})}}"
---
The predefined variables are in 'dorest.configs.vars' and functions are in 'dorest.configs.funcs'.
Note that the function-calling syntax accepts a dictionary containing parameters associated with the functions' actual parameters.

The path to the configuration directory is stored in 'DOREST["CONFIGS"]["PATH"]' in Django project's setting file.

The Dorest project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import ast
import json
import re
from os import listdir
from os.path import isfile, join
from typing import Any, Dict, List, Union

import yaml
from django.conf import settings

from . import funcs, vars as vrs
from .consts import SUPPORTED_FILE_TYPES
from .exceptions import UnsupportedFileTypeError


def _populate(obj: Union[dict, list], tree: dict = None) -> Union[dict, list]:
    """Populates variables ({{...}}) in the configuration dictionary with the value of pointed leaf.
    This function looks for values in all of the configuration files.

    The pointing structure is: [conf_file].[dict_key]...[dict_value].
    For example, 'sys.email.domain' would point to 'email.domain' in sys.yml (or any applicable configuration file with name 'sys').

    In a special case of function calling where the pointer starts with $ (e.g. {{$random_password(...)}}),
    this function will look for and execute functions defined in 'funcs' module.

    :param obj: The entire or part of configuration dictionary
    :param tree: The entire tree-structure configuration dictionary
    :return: Populated configuration dictionary
    """

    def resolve(d: Dict[str, Any], l: List[str]):
        return populate(d[l[0]]) if len(l) == 1 else resolve(d[l[0]], l[1:])

    def populate(value: any) -> any:
        if isinstance(value, str):
            for var in re.findall(r'{{\$[a-zA-Z0-9_.]+\(.*\)}}', value):
                # Parses a function-calling statement in configuration value "{{$func({'arg': value, ...})}}"
                # and calls the specified function in 'func' module.
                value = value.replace(var, getattr(funcs, re.search(r'^[a-zA-Z0-9_.]+', var[3:-2]).group(0))
                                                                   (**ast.literal_eval('{%s}' % re.sub(r'^[a-zA-Z0-9_.]+\(|\)$', '', var[3:-2]))))

            for var in re.findall(r'{{\$[a-zA-Z0-9_.]+}}', value):
                # Replaces {{$...}} with variables in 'vars' module.
                value = value.replace(var, getattr(vrs, var[3:-2]))

            for var in re.findall(r'{{[a-zA-Z0-9_.]+}}', value):
                # The first level of the configuration tree 'tree' does not have any leaf since its nodes represent the configurations files.
                # Therefore, there would be no scenarios where the variable 'tree' containing None value was passed to 'resolve' function.
                value = value.replace(var, str(resolve(tree, var[2:-2].split('.'))))

            if value is not None and isinstance(value, str):
                # Sometimes a variable in the configuration file may refer to another configuration that does not exist.
                # In which case the returned value would be None.
                value = value.replace('\\{', '{')

        return value

    if isinstance(obj, dict):
        obj = {key: _populate(value, tree or obj) if isinstance(value, (dict, list)) else populate(value) for key, value in obj.items()}
    else:
        obj = [_populate(value, tree or obj) if isinstance(value, (dict, list)) else populate(value) for value in obj]

    return obj


def _load(path: str) -> dict:
    """Selects appropriate loader (YAML or JSON) based on file type

    :param path: Path to the configuration file
    :return: An unprocessed configuration dictionary
    """

    if re.search(r'\.(yml|yaml)$', path):
        return yaml.safe_load(open(path, 'r'))

    elif re.search(r'\.json$', path):
        return json.load(path)

    else:
        raise UnsupportedFileTypeError(path, SUPPORTED_FILE_TYPES)


def _load_dir(path: str) -> dict:
    """Loads configurations from YAML or JSON files in a directory

    :param path: Path to the configuration directory
    :return: An unprocessed configuration dictionary
    """

    return {re.sub(r'\.(%s)$' % '|'.join(SUPPORTED_FILE_TYPES), '', file): _load(join(path, file)) for file in listdir(path)
            if isfile(join(path, file)) and re.search(r'\.(%s)$' % '|'.join(SUPPORTED_FILE_TYPES), file)}


def _traverse(tree: Dict[str, Any], active_branch: List[str]) -> Any:
    """Traverses the tree-structure configuration dictionary

    :param tree: The configuration dictionary
    :param active_branch: A list of node names in the branch of interest
    :return: A subtree or value of a leaf
    """
    if len(active_branch) > 1:
        return _traverse(tree[active_branch[0]], active_branch[1:])
    else:
        return tree[active_branch[0]]


def resolve(branch: str) -> Any:
    """Retrieves a subtree or value of specified node or leaf within the tree-structure configuration dictionary

    :param branch: A branch to node or leaf of interest
    :return: A subtree or value of a leaf
    """
    return _traverse(_conf, branch.split('.'))


_conf = _populate(_load_dir(settings.DOREST['CONFIGS']['PATH']))
