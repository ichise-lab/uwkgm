"""Prints styled messages to command-line interface

Usage example:
---
from dorest import verbose

verbose.info('Some information')
verbose.info.append('Second line of the information')
---

The Dorest project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import os
import sys
import datetime

from dorest.libs.sh import styles


_verbose = '--verbose' in sys.argv or os.environ.get('DOREST_VERBOSE')


class _Say:
    def __init__(self, category: str, style: callable = None):
        def no_style(string: str) -> str:
            return string

        self.category = category
        self.style = style or no_style

    def __call__(self, message: str, caller: callable = None) -> None:
        if _verbose:
            now = datetime.datetime.now()

            sys.stdout.write(self.style(now.isoformat().replace('T', ' ')[:19].ljust(21)))
            sys.stdout.write(self.style('[ %s ]  ' % self.category.ljust(9)))

            if caller is not None:
                sys.stdout.write(self.style('%s.%s\n' % (caller.__module__, caller.__name__)))

            sys.stdout.write(self.style(':  %s\n' % message))
            sys.stdout.flush()


class _Append:
    def __init__(self, style: callable = None):
        def no_style(string: str) -> str:
            return string

        self.style = style or no_style

    def __call__(self, message):
        sys.stdout.write(self.style(':  %s\n' % message))
        sys.stdout.flush()


def verbose(on=True):
    global _verbose
    _verbose = on


info = _Say('INFO')
highlight = _Say('IMPORTANT', styles.HIGHLIGHT)
success = _Say('SUCCESS', styles.SUCCESS)
warn = _Say('WARNING', styles.WARNING)
error = _Say('ERROR', styles.ERROR)

info.append = _Append()
highlight.append = _Append(styles.HIGHLIGHT)
success.append = _Append(styles.SUCCESS)
warn.append = _Append(styles.WARNING)
error.append = _Append(styles.ERROR)
