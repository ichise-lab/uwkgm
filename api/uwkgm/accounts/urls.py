"""Request URL handler

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.views import TokenVerifyView

from .routers import CustomUserRouter
from accounts.views import accounts, helps, throttling, dashboard
from accounts.views import password, activation, jwt
from accounts.serializers.jwt import CustomObtainPairView


urlpatterns = [
    # JWT token endpoints
    path('tokens/obtain', CustomObtainPairView.as_view(), name='token_obtain_pair'),
    path('tokens/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('tokens/verify', TokenVerifyView.as_view(), name='token_verify'),

    path('register/code/obtain', accounts.gen_registration_code, name='register_code_obtain'),
    path('register/code/apply', accounts.apply_registration_code, name='register_code_apply'),

    # Lists of available options for account settings
    path('groups', helps.HelpViews.Groups.as_view(), name='view_groups'),
    path('permissions', helps.HelpViews.Permissions.as_view(), name='view_permissions'),

    # Password reset mechanism
    path('password/reset', password.PasswordView.Reset.as_view(), name='change_others_password'),
    path('password/reset/<uidb64>/<token>', password.PasswordView.Reset.as_view(), name='password_reset_confirm'),

    # Individual user operations
    path('<str:username>/activate', activation.ActivationViews.Activate.as_view(), name='account_activate'),
    path('<str:username>/deactivate', activation.ActivationViews.Deactivate.as_view(), name='deactivate_account'),
    path('<str:username>/register', accounts.register, name='account_register'),

    # UI backend operations
    path('<str:username>/dashboard/basic', dashboard.Basic.as_view(), name='account_usage'),

    # Throttling endpoints
    path('<str:username>/throttling/burst/requests/',
         throttling.BurstRequestViewSet.as_view(actions={'get': 'list', 'post': 'create'}),
         name='throttle_burst_requests'),
    path('<str:username>/throttling/burst/requests/<str:id>',
         throttling.BurstRequestViewSet.as_view(actions={'get': 'retrieve', 'patch': 'partial_update', 'delete': 'destroy'}),
         name='throttle_burst_request'),
    path('<str:username>/throttling/burst/permits/',
         throttling.BurstPermitViewSet.as_view(actions={'get': 'list', 'post': 'create'}),
         name='throttle_burst_permits'),
    path('<str:username>/throttling/burst/permits/<str:id>',
         throttling.BurstPermitViewSet.as_view(actions={'get': 'retrieve', 'patch': 'partial_update', 'delete': 'destroy'}),
         name='throttle_burst_permit'),
]

router = CustomUserRouter()
router.register(r'', accounts.UserViewSet)
urlpatterns += router.urls
