"""The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import os

from django.apps import AppConfig


class AccountsConfig(AppConfig):
    name = 'accounts'

    def ready(self):
        # This method is called not only when the server starts but during migration as well.
        # The initialization scripts can only be executed after the migration has finished.
        # Therefore, while 'UWKGM_STATE' is 'migrating', the following initialization script must be skipped.
        if 'UWKGM_STATE' in os.environ and os.environ['UWKGM_STATE'] == 'running':
            from accounts.models import CustomUser
            from accounts.manage.init import groups as init_groups, superusers as init_superusers, users as init_users

            if len(CustomUser.objects.filter()) == 0:
                init_groups()
                init_superusers()
                init_users()
