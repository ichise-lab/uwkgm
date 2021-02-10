import os
from sys import platform

from . import db


url_prefix = 'api/v%s' % ('.'.join(os.environ['UWKGM_API_VERSION'].split('.')[:2])) if 'UWKGM_API_VERSION' in os.environ else None
