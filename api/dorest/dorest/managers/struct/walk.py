"""Tree-structure description generator for structured API endpoints

The Dorest project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import os
from importlib import import_module
from typing import List

from .describe import Endpoint


def walk(branch: str, reduce: bool = False) -> dict:
    """Walks and generates descriptions of structured API endpoints

    The structure of the returned dictionary is as followed:
    ---
        {
            'package': {
                'subpackage': {
                    'module': {
                        '*': [ ... function descriptions ... ]
                    }
                }
            }
        }
    ---

    In case the structural organization of an API results in some packages containing only one subpackage or module (other than the package's
    __init__.py), with the 'reduce' parameter true, all sequences of these packages will be merged in the returned dictionary.
    When reduced, the above example will become:
    ---
        {
            'package/subpackage/module': {
                '*': [ ... function descriptions ... ]
            }
        }
    ---

    :param branch: The root of structured API endpoints (or a part of interest within the structure)
    :param reduce: Reduces the returned dictionary
    :return: A description of the tree
    """

    def attach_endpoint(sub_api_tree: dict, sub_branch: List[str], endpoint: callable) -> None:
        if len(sub_branch):
            sub_branch_head = sub_branch.pop(0)

            if sub_branch_head not in sub_api_tree:
                sub_api_tree[sub_branch_head] = dict()

            attach_endpoint(sub_api_tree[sub_branch_head], sub_branch, endpoint)

        else:
            if '*' not in sub_api_tree:
                sub_api_tree['*'] = [Endpoint(endpoint).rest(brief=True)]
            else:
                sub_api_tree['*'].append(Endpoint(endpoint).rest(brief=True))

    root_module = import_module(branch)
    root_path = os.path.dirname(root_module.__file__)

    # Generate a list of all Python scripts
    py_files = [os.path.join(dirpath, filename) for dirpath, dirnames, filenames in os.walk(root_path) for filename in filenames
                if os.path.splitext(filename)[1] == '.py']

    # Generate a list of all modules for import from the list of Python scripts
    modules = [('%s.%s' % (branch, py_file.replace(os.path.dirname(root_module.__file__), '').replace('__init__', '').replace('.py', '')
                           .replace('/', '.').strip('.'))).strip('.') for py_file in py_files]

    # Remove the root endpoint
    modules = [module for module in modules if module != branch]
    api_tree = dict()

    # Fill the API tree with descriptions of the functions
    for module in modules:
        sub_module = import_module(module)
        funcs = [obj for obj in [getattr(sub_module, attr) for attr in dir(sub_module)]
                 if hasattr(obj, 'meta') and obj.__module__ == sub_module.__name__]
        sub_branch = module.replace(branch, '').strip('.')

        for func in funcs:
            attach_endpoint(api_tree, sub_branch.split('.'), func)

    return api_tree if not reduce else Endpoint.reduce(api_tree)
