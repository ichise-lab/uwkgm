"""Throttling policies

The throttling classes in this module extend Django REST Framework's throttling classes
and can be set as the throttling policy for 'REST_FRAMEWORK' in the project's settings.

To set the policies for a specific endpoint, use Django REST Frameworks' 'throttle_classes' decorator.

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""


from datetime import datetime

from rest_framework.request import Request
from rest_framework.throttling import BaseThrottle, ScopedRateThrottle
from rest_framework.views import APIView

from accounts.models.throttling import ThrottleBurstPermit


class UserScopedRateThrottle(ScopedRateThrottle):
    """User-specific throttling
    Note: Parts of the code and comments here were derived directly from 'ScopedRateThrottle'
    """

    scope_attr = 'throttle_custom_scope'

    def __init__(self):
        # Override the usual SimpleRateThrottle, because we can't determine
        # the rate until called by the view.
        pass

    def allow_request(self, request: Request, view: APIView) -> bool:
        # We can only determine the scope once we're called by the view.
        self.scope = getattr(view, self.scope_attr, None)

        # If a view does not have a `throttle_scope` always allow the request
        if not self.scope:
            return True

        # Determine the allowed request rate as we normally would during
        # the `__init__` call.
        self.rate = self.get_rate()
        self.num_requests, self.duration = self.parse_rate(self.rate)

        permits = ThrottleBurstPermit.objects.filter(user=request.user, name=self.scope)
        max_rate = self.num_requests / self.duration

        # Find a burst permit given to the user that is valid at the time of the request and has maximum rate
        for permit in permits:
            permit_starts = not permit.start or datetime.now() > permit.start.replace(tzinfo=None)
            permit_expires = not permit.expire or datetime.now() < permit.expire.replace(tzinfo=None)

            if permit_starts and permit_expires:
                permit_rate = permit.limit / permit.duration

                if max_rate < permit_rate:
                    self.num_requests, self.duration = permit.limit, permit.duration
                    max_rate = permit_rate

        # We can now proceed as normal.
        return super().allow_request(request, view)


class NoThrottle(BaseThrottle):
    def allow_request(self, request: Request, view: APIView) -> bool:
        return True
