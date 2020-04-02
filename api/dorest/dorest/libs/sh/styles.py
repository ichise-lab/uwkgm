"""Styling for command-line interface

The Dorest project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from django.utils.termcolors import make_style

TITLE = make_style(opts=('bold',))
HIGHLIGHT = make_style(fg='cyan')
SUCCESS = make_style(fg='green')
WARNING = make_style(opts=('bold',), fg='yellow')
ERROR = make_style(fg='red')
