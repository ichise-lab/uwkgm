"""Predefined functions for YAML/JSON configuration files
Refer to __init__.py in this module's package for usage

The Dorest project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import importlib
import os
from typing import Any, Dict, List, Union

import yaml
from django.conf import settings
from django.utils.crypto import get_random_string

from dorest.configs.consts import SUPPORTED_FILE_TYPES


def load_usr_pwd(*, path: str, username: str) -> Union[str, None]:
    """Load password of a user. The password is stored in a password file supposedly produced by some scripts in 'accounts' app's management commands.
    There may be multiple versions of the password files, the format of the file names is prefix_dddd.yml, where d = [0-9].
    This function will look for passwords in the latest password files first, then the older versions.

    :param path: A directory that stores the password files
    :param username: Target user
    :return: Password or None if the password configuration did not exist
    """

    files = sorted([file for file in os.listdir(path) if os.path.isfile(os.path.join(path, file))])

    # Starts searching from the latest version of the password files
    for name, index in {file[:-9]: int(file[-8:-4]) for file in files if any([s in file for s in SUPPORTED_FILE_TYPES])}.items():
        i = index

        # If the username was not found in the latest version of the password files, checks the older versions
        while i:
            users = yaml.safe_load(open('%s/%s_%04d.yml' % (path, name, i), 'r'))

            if username in users:
                return users[username]

            i -= 1

    return None


def resolve_module_path(*, path: str):
    """Resolves an absolute directory of a module

    :param path: A string referring to a module in Python's import format
    :return: An absolute directory
    """
    return os.path.dirname(importlib.import_module(path).__file__)


def random_password(**kwargs) -> str:
    """Generates a random password using Django's random string generator

    :param kwargs: Accepts 'length' and 'allow_chars' as defined in the Django's function
    :return: A random password
    """
    return get_random_string(**kwargs)


def envyml(*, var: str) -> Any:
    """Loads environment variables defined in a YAML file located in Django project's environment directory.
    The path to the environment directory is stored in 'DOREST["ENV"]["PATH"]' in Django project's setting file.
    
    An environment file contains a tree-structure configuration, 
    with its top level indicating which environment its subtree configuration should be applied.
    
    For example, suppose there are two environments, 'development' and 'production',
    and a variable 'policy' defined in 'security.yaml' as followed:
    ---
    development:
        policy: insecure

    production:
        policy: secure
    ---
    Calling 'envyml("security.policy")', or "{{$envyml('var': 'security.policy')}}" in YAML configuration file,
    would return the value "secure" or "insecure" depending on the active environment.

    The name of the environment variable is stored in 'DOREST["ENV"]["NAME"]' in Django project's setting file.

    :param var: A branch to node of interest within an environment configuration file
    :return: A subtree or value of a leaf
    """

    def walk(sub_tree: Dict[str, Any], sub_path: List[str]) -> Any:
        return walk(sub_tree[sub_path[0]], sub_path[1:]) if len(sub_path) > 1 else sub_tree[sub_path[0]]

    path = var.split('.')
    return walk(yaml.safe_load(open('%s/%s.yaml' % (settings.DOREST['ENV']['PATH'], path[0]), 'r'))[os.environ[settings.DOREST['ENV']['NAME']]], path[1:])


def env(*, name: str) -> str:
    """Loads an environment variable

    :param name: The environment variable name
    :return: The value of the environment variable
    """
    
    return os.environ[name]
