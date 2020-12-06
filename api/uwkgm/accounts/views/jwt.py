import datetime

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken

from dorest.decorators import mandate

from accounts.models.accounts import CustomUser


@api_view(['POST'])
@permission_classes([IsAdminUser])
@mandate(strict_fields=['email'])
def gen_demo_token(request: Request) -> Response:
    """
    Create a token for live demo
    """

    duration = 3600

    if 'secs' in request.data:
        duration = int(request.data['secs'])
    elif 'mins' in request.data:
        duration = int(request.data['mins']) * 60
    elif 'hours' in request.data:
        duration = int(request.data['hours']) * 3600
    elif 'days' in request.data:
        duration = int(request.data['days']) * 86400

    user = CustomUser.objects.get_by_natural_key(request.data['email'])
    token = AccessToken.for_user(user)
    token.set_exp(lifetime=datetime.timedelta(seconds=duration))
    token.payload['username'] = user.username

    return Response({'access': str(token)})
