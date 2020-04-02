"""Endpoint description generator

Each function description consists of:
---
    {
        name: Name of the function,
        methods: Accepted HTTP method
        traceback: A stack of the function's module and packages within the structured API endpoints,
        description: Function description derived from the function's docstring
        arguments: {
            required: [ ... Required parameter descriptions ... ],
            optional: [ ... Optional parameter descriptions ... ]
        },
        return: {
            annotation: Annotation of the return value,
            description: Description of the return value
        }
    }
---

Each function parameter description consists of:
---
    {
        name: Name of the parameter,
        annotation: Annotation of the parameter if provided
        description: Description of the parameter if provided
        example: Example input of the parameter if provided
        default: Default value of the parameter if provided (optional para
    }
---

The Dorest project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import inspect
import json
import re
import sys
import typing
from collections import namedtuple
from typing import Any, Callable, Dict, List, Tuple, Type

from .glossary import Glossary
from dorest.libs.modules import get_module as _get_module


class Param:
    """Endpoint function parameter descriptor

    In the describing process, the description of each function parameter is stored as an instance of 'Param'
    """

    def __init__(self, name: str, description: List[str] = None, example: List[str] = None, annotation: Type = None, default: Any = None):
        self.name = name
        self.annotation = annotation
        self.description = description
        self.example = example
        self.default = default

    def __str__(self):
        return str(self.__dict__)

    @property
    def brief(self) -> str:
        """Returns the first line of the parameter description"""
        return self.description[0] if self.description is not None else None

    def rest(self, brief: bool = True) -> Dict[str, Any]:
        """Generates REST-compliant description of the parameter"""
        return {'name': self.name,
                'annotation': str(self.annotation),
                'description': self.brief if brief else self.description,
                'example': ' '.join(self.example) if self.example is not None else '',
                'default': str(self.default) if self.default is not inspect._empty and self.default is not None else ''}


class Endpoint:
    """Endpoint function descriptor"""

    def __init__(self, func: Callable[..., Any]):
        self.func = func
        self.description, param_descriptions, param_examples, rd = self._describe_function()
        self.args, self.kwargs = self._inspect_arguments(param_descriptions, param_examples)
        self.returns = namedtuple('returns', ['annotation', 'description'])(getattr(typing.get_type_hints(func), 'return', ''), rd)

        if not hasattr(sys.modules[func.__module__], func.__name__):
            del self.args[0]

    def rest(self, brief: bool = True) -> Dict[str, Any]:
        """Generates REST-compliant description of the endpoint function

        :param brief: If true, returns only the first line of all descriptions
        :return: A dictionary describing the endpoint
        """
        return {'name': self.func.__name__,
                'methods': getattr(self.func, 'meta')['methods'],
                'traceback': self.trace,
                'description': self.description,
                'arguments': {
                    'required': [a.rest(brief) for a in self.args],
                    'optional': [k.rest(brief) for k in self.kwargs],
                },
                'return': {'annotation': str(self.returns.annotation), 'description': self.returns.description}}

    @staticmethod
    def reduce(tree: Dict[str, Any]) -> Dict[str, Any]:
        """Merges any sequences of packages containing only one subpackage or module (other than the package's __init__.py)

        For example, '{package: {subpackage: {module: ... functions ...}}}' will be reduced to '{"package/subpackage/module": ... functions ...}

        :param tree: The tree structure of API endpoints
        :return: A description of the tree
        """

        def reducer(branch: List[str], sub_tree: Dict[str, Any]):
            if len(sub_tree) == 1 and list(sub_tree.keys())[0] != '*':
                branch.append(list(sub_tree.keys())[0])
                return reducer(branch, list(sub_tree.values())[0])
            else:
                return branch, sub_tree

        new_tree = dict()

        for key, sub_tree in tree.items():
            if key != '*' and len(sub_tree) == 1 and list(sub_tree.keys())[0] != '*':
                new_branch, new_sub_tree = reducer([], sub_tree)
                new_tree['/'.join([key] + new_branch)] = new_sub_tree
            else:
                new_tree[key] = sub_tree

        return new_tree

    def parse(self, *args, **kwargs):
        """Parses inputs from an API request before passing them to the target function
        :return: A dictionary of both required and optional inputs parsed from an API request
        """

        def find(name: str) -> Param:
            """Finds a parameter description from parameter name"""

            for parameter in self.args + self.kwargs:
                if parameter.name == name:
                    return parameter

            return Param(name)

        def guess(obj: Any) -> Any:
            """In case the parameter annotation is not provided, guesses and tries to parse the input"""

            if str(obj).lower() in ['true', 'false']:
                return obj.lower() == 'true'

            for type_candidate in [float, int]:
                try:
                    return type_candidate(obj)
                except ValueError:
                    continue
            
            try:
                return json.loads(obj, encoding='utf-8')
            except json.decoder.JSONDecodeError:
                return str(obj)

        def convert(param: Param, obj: Any) -> Any:
            """Converts a string input from an API call to the type that matches its associated function parameter"""

            if param.annotation is None:
                return guess(obj)

            if issubclass(param.annotation, bool):
                return obj.lower() == 'true'

            for type_candidate in [float, int, str]:
                if issubclass(param.annotation, type_candidate):
                    return type_candidate(obj)

            if any(issubclass(param.annotation, type_candidate) for type_candidate in [list, tuple, dict]):
                return json.loads(obj, encoding='utf-8')
            else:
                raise ValueError("Invalid type of argument '%s' (expected '%s' but '%s' was given)"
                                 % (param.name, param.annotation.__name__, type(obj).__name__))

        required_params = {} if len(args) == 0 else {self.args[i]: args[i] for i in range(len(self.args))}
        return {**{key.name: convert(key, value[0] if not isinstance(value, str) else value) for key, value in required_params.items()},
                **{key: convert(find(key), value[0] if not isinstance(value, str) else value) for key, value in kwargs.items()}}

    @property
    def trace(self):
        """Traces a stack of the endpoint function's module and packages within the structured API endpoints"""

        branch = self.func.__module__.split('.')

        # Remove part of the stack above the root of the structured API endpoints
        for i in range(1, len(branch)):
            sub_branch = '.'.join(branch[:i])
            module = _get_module(sub_branch)

            if hasattr(module, Glossary.ROOT.value):
                return '%s.%s' % ('.'.join(branch[i:]), self.func.__name__)

        return '%s.%s' % (self.func.__module__, self.func.__name__)

    def _describe_function(self) -> Tuple[List[str], Dict[str, List[str]], Dict[str, List[str]], List[str]]:
        """Describes an endpoint function

        Reads the function's docstring line by line and extracts the function description, parameter descriptions,
        parameter example inputs, and return description

        :return: A tuple of ([description], [parameter descriptions], [parameter examples], [return description])
        """

        lines = [] if self.func.__doc__ is None else inspect.cleandoc(self.func.__doc__).split('\n')
        description_lines = list()
        param_descriptions, current_param = dict(), None        # A dictionary of {[param name]: [list of param description lines]}
        param_examples = dict()                                 # A dictionary of {[param name]: [list of param example lines]}
        return_description, cr = '', bool                       # Return description lines stored as a list

        for i, line in enumerate(lines):
            if line.startswith(':param'):
                current_param = re.sub(r'(^:param +|:.*)', '', line)
                param_descriptions[current_param] = [re.sub(r'^:(?!:).*?: *', '', line)]
                param_examples[current_param] = list()

            elif line.startswith(':return:'):
                return_description = [re.sub(r'^:return: +', '', line)]
                current_param, cr = None, True

            elif current_param is not None:
                if ':ex:' in line:
                    param_examples[current_param].append(line.replace(':ex:', '').strip())

                else:
                    param_descriptions[current_param].append(line.strip())

            elif cr is True:
                return_description.append(line.strip())

            elif line != '':
                description_lines.append(line.strip())

        return description_lines, param_descriptions, param_examples, return_description

    def _inspect_arguments(self, param_descriptions: Dict[str, List[str]], param_examples: Dict[str, List[str]]) -> Tuple[List[Param], List[Param]]:
        """Describes endpoint function parameters, including their annotations, examples, and default values

        :param param_descriptions: Descriptions of parameters in the function's docstring
        :param param_examples: Example inputs of parameters in the function's docstring
        :return: A tuple containing lists of required and optional parameters
        """

        annotations = dict()
        sig = inspect.signature(self.func)

        for parameter in sig.parameters:
            try:
                annotations[parameter] = sig.parameters[parameter].annotation.__origin__
            except AttributeError:
                annotations[parameter] = sig.parameters[parameter].annotation

        params = [Param(name=param,
                        description=param_descriptions[param] if param in param_descriptions else None,
                        example=param_examples[param] if param in param_examples else None,
                        annotation=annotations[param],
                        default=sig.parameters[param].default)
                  for param in sig.parameters if param not in param_descriptions or param_descriptions[param][0] != '__hidden__']

        return [param for param in params if param.default == sig.empty], [param for param in params if param.default != sig.empty]
