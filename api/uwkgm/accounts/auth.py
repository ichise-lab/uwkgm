"""Custom configuration for Django REST Framework's token authentication

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from rest_framework.authentication import TokenAuthentication


class CustomTokenAuthentication(TokenAuthentication):
    keyword = 'Bearer'
