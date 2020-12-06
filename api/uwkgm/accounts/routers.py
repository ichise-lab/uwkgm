"""URL routers

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from rest_framework.routers import Route, SimpleRouter


class CustomUserRouter(SimpleRouter):
    routes = [
        Route(
            url=r'^{prefix}/{lookup}$',
            name='{basename}-detail',
            mapping={'get': 'retrieve', 'delete': 'destroy', 'patch': 'partial_update'},
            detail=True,
            initkwargs={'suffix': 'Detail'}
        ),
        Route(
            url=r'{prefix}$',
            name='{basename}-create',
            mapping={'post': 'create', 'get': 'list'},
            detail=True,
            initkwargs={'suffix': 'Create'}
        )
    ]
