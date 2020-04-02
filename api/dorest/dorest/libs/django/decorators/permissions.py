"""Extensions to Django's permission validation mechanism

The Dorest project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from django.utils.translation import ugettext_lazy as _

from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response


def require(validators: tuple):
    """Django's standard permission_required decorator does not recognize 'user' in the 'request'
    received by Django rest_framework's APIView, resulting in the user being treated as anonymous.

    This custom implementation solves the issue, as well as removes a redirect URL since
    this channel of communication does not provide a user interface.

    :param: validators: A tuple of permission validators.
                        By default, a user must have all required permissions to perform an action.
                        However, if only one permission was needed, set 'or' as the first member of the tuple.

                        For example:
                        (p1, p2, ('or', p3, p4))
                        In this case, a user must have permissions p1 and p2, and she must also have p3 or p4
                        in order to perform an action.
    """

    def decorator(func):
        def wrapper(*args, **kwargs):
            """Receives HTTP request handler (function) of Django rest_framework's APIView class.
            ---

            args: [0] an object of a class inherited from Django's view
                  [1] an object of rest_framework.request.Request
            """

            if _require_operator(validators, args[1], args[0], **kwargs):
                return func(*args, **kwargs)
            else:
                return Response({'detail': _('Permission required')}, status=403)

        return wrapper

    return decorator


def _require_operator(validators: tuple, request: Request, view: APIView, **kwargs) -> bool:
    """Validates and applies AND operator on the results produced by the validators
    
    :param validators: A tuple of validators
    :param request: A request sent from Django REST framework
    :param view: Django REST framework API view
    :param kwargs: Validator's argument
    :return: Validation result
    """
    
    def validate(validator):
        if type(validator) is tuple or type(validator) is list:
            return _require_operator(validator, request, view)

        elif type(validator) is str:
            return request.user.has_perm(validator)

        else:
            v = validator()

            try:
                return v.has_permission(request, view, **kwargs)
            except TypeError:
                return v.has_permission(request, view)

    # 'operator_or()' returns a list with 'or' as its first member
    if type(validators) is not tuple and type(validators) is not list:
        return validate(validators)

    elif validators[0] == 'or':
        return any([validate(v) for v in validators[1:]])

    else:
        return all([validate(v) for v in validators])


def operator_or(*args):
    """Another form of 'or' operator in 'permissions._require_operator'.
    Instead of setting the first member of the tuple as 'or', e.g., 'permissions.require(p1, p2, ("or", p3, p4))',
    this function offers a different format that does not include an operator as a member.

    For convenience, import this function as '_or'.
    The above example can then be written as 'permissions.require(p1, p2, _or(p3, p4))'.
    """

    return ('or',) + args
