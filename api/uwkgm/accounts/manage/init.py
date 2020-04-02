"""Account initialization

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import os
import re
import yaml
from typing import Any, Dict

from django.contrib.auth.models import Group, Permission
from django.db.utils import IntegrityError

from dorest import configs
from dorest.libs.django.exceptions import ObjectNotFound
from dorest.libs.sh import verbose

from accounts.models import CustomUser


def superusers(clean: bool = False, replace: bool = False, ignore_errors: bool = False) -> Dict[str, str]:
    """Initializes superusers preconfigured in 'accounts.yaml' in the 'configs' directory
    See the '_users_output' function for how the emails and passwords are stored

    :param clean: Remove all existing superusers in the init configuration
    :param replace: Replace existing superusers with the ones specified in the init configuration
    :param ignore_errors: Ignore errors and continue the initialization process
    :return: A dictionary containing new superusers' username as keys and passwords as values
    """

    if clean:
        CustomUser.objects.filter(is_superuser=True).delete()

    user_list = dict()
    for user_config in configs.resolve('accounts.init.superusers'):
        try:
            if replace:
                try:
                    user = CustomUser.objects.get_by_natural_key(user_config['username'])
                    user.delete()
                    verbose.warn("User '%s' found and deleted" % user_config['username'])

                except ObjectNotFound:
                    pass

            CustomUser.objects.create_superuser(user_config['username'], user_config['email'], user_config['password'], is_active=True)
            user_list[user_config['email']] = user_config['password']

        except IntegrityError:
            message = "User '%s' or email '%s' already exists" % (user_config['username'], user_config['email'])
            if ignore_errors:
                verbose.error(message)
            else:
                raise IntegrityError(message)

    _users_output(user_list, 'superusers')
    return user_list


def users(replace: bool = False, ignore_errors: bool = False) -> Dict[str, str]:
    """Initializes users preconfigured in 'accounts.yaml' in the 'configs' directory
    See the '_users_output' function for how the emails and passwords are stored

    :param replace: Replace existing users with the ones specified in the init configuration
    :param ignore_errors: Ignore errors and continue the initialization process
    :return: A dictionary containing new superusers' username as keys and passwords as values
    """

    user_list = dict()
    if 'users' in configs.resolve('accounts.init'):
        for user_config in configs.resolve('accounts.init.users'):
            try:
                if replace:
                    try:
                        user = CustomUser.objects.get_by_natural_key(user_config['username'])
                        user.delete()
                        verbose.warn("User '%s' found and deleted" % user_config['username'])

                    except ObjectNotFound:
                        pass

                user = CustomUser.objects.create_user(user_config['username'], user_config['email'], user_config['password'])

                if 'groups' in user_config:
                    user.groups.set([Group.objects.get_by_natural_key(g) for g in user_config['groups']])

                if 'permissions' in user_config:
                    user.user_permissions.set([Permission.objects.get(codename=p) for p in user_config['permissions']])

                [setattr(user, k, v) for k, v in user_config.items() if k not in ('username', 'password', 'email', 'groups', 'permissions')]

                user.save()
                user_list[user_config['email']] = user_config['password']

            except IntegrityError:
                message = "User '%s' or email '%s' already exists" % (user_config['username'], user_config['email'])
                if ignore_errors:
                    verbose.error(message)
                else:
                    raise IntegrityError(message)

    _users_output(user_list, 'users')
    return user_list


def _users_output(email_password: dict, file_prefix: str) -> None:
    """Saves account configuration (emails and passwords) to a directory specified in 'accounts.yaml' in the' configs' directory

    :param email_password: Emails and passwords to be saved
    :param file_prefix: A prefix before version number of the output file
    :return: None
    """

    if len(email_password) > 0:
        verbose.success('Initialized the following users:')
        [verbose.info.append('  %s (password=%s)' % (u, p)) for u, p in email_password.items()]

        local_dir = configs.resolve('accounts.init.output.path')

        if not os.path.exists(local_dir):
            os.makedirs(local_dir)
            n = 1
        else:
            # Increases the files' running number (n) to avoid replacing existing files
            n = max([int(f[-8:-4]) for f in os.listdir(local_dir) if os.path.isfile(os.path.join(local_dir, f)) and
                    re.search(r'^%s_\d{4}\.yml$' % re.escape(file_prefix), f)] + [0]) + 1

        local_file = '%s/%s_%04d.yml' % (local_dir, file_prefix, n)

        with open(local_file, 'w') as yml:
            yaml.dump(email_password, yml, default_flow_style=False)

        verbose.info("The passwords are stored in '%s'" % local_file)
        verbose.info('We highly recommend that they should later be deleted, or encrypted and moved to a highly secure location.')


def groups(clean: bool = False) -> Dict[str, Any]:
    """Initializes groups preconfigured in 'accounts.yaml' in the 'configs' directory

    :param clean:
    :return:
    """
    if clean:
        Group.objects.all().delete()

    group_configs = configs.resolve('accounts.groups')

    for key, value in group_configs.items():
        group = Group.objects.get_or_create(name=key)[0]

        if 'permissions' in value:
            [group.permissions.add(Permission.objects.get(codename=p)) for p in value['permissions']]

        group.save()

    return configs.resolve('accounts.groups')
