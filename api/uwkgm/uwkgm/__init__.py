import os
from sys import platform
from typing import Any, Dict, List

import pymysql
import yaml


url_prefix = 'api/v%s' % ('.'.join(os.environ['UWKGM_API_VERSION'].split('.')[:2]))


def envyml(name: str, base_dir: str, var: str) -> Any:
    def walk(sub_tree: Dict[str, Any], sub_path: List[str]) -> Any:
        return walk(sub_tree[sub_path[0]], sub_path[1:]) if len(sub_path) > 1 else sub_tree[sub_path[0]]

    path = var.split('.')
    return walk(yaml.safe_load(open('%s/env/%s.yaml' % (base_dir, path[0]), 'r'))[os.environ[name]], path[1:])


if platform == 'darwin':
    pymysql.install_as_MySQLdb()
