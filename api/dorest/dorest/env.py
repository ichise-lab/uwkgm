"""Environment-based configuration manager

The configuration manager reads JSON or YAML configuration files and applies configurations based on a specified environment variable.

For example, suppose a Django project 'greet' stores environment-based configuration files in 'greet/env/'.
One of the files named 'good.yaml' contains the following configuration:
---
    morning:
        message: Good morning

    afternoon:
        message Good afternoon
---

The Dorest configuration in the project configuration file ('greet/greet/settings.py') is as followed:
---
    DOREST = {
        'ENV': {
            'PATH': '%s/env' % BASE_DIR,
            'NAME': 'GREET_ENV'
        },
        ...
    }
---

Calling 'resolve("good.message")' would return 'Good morning' if the environment variable 'GREET_ENV' was set to 'morning'.

The Dorest project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import os
from typing import Any, Union

from django.conf import settings

from dorest import configs


def resolve(var: str) -> Union[dict, list, Any]:
    """Resolves a configuration variable based on a specified environment variable"""
    branch = var.split('.')
    return configs._traverse(_env[branch[0]][_env_name], branch[1:])


_env_name = os.environ[settings.DOREST['ENV']['NAME']]
_env_path = settings.DOREST['ENV']['PATH']
_env = configs._populate(configs._load_dir(settings.DOREST['ENV']['PATH']))
