from functools import wraps
from typing import Any, Callable, TypeVar

from rest_framework.response import Response


VT = TypeVar('VT')


def lazy(lazy_decorator: Callable[..., Any]) -> Callable[..., Any]:
    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        @wraps(func)
        def wrapper(*args: VT, **kwargs: VT) -> Any:
            lazy.is_active, output = False, lazy_decorator(func)(*args, **kwargs) if lazy.is_active else func(*args, **kwargs)
            return Response({'data': output})
        return wrapper

    def _activate(func: Callable[..., Any]):
        lazy.is_active = True
        return func()

    lazy.is_active, lazy.activate = False, _activate
    return decorator
