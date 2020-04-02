"""'CustomUser' objects serializer

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from copy import deepcopy
from typing import Any, Dict, List, Union

from django.contrib.auth.models import Group, Permission
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ObjectDoesNotExist
from django.http.request import QueryDict
from django.utils.translation import ugettext_lazy as _

from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.fields import empty

from dorest import configs
from dorest.libs.django.exceptions import ObjectNotFound

from accounts.models import CustomUser


class PermissionSerializer(serializers.ModelSerializer):
    """A serializer corresponding to 'Permission' class (part of 'CustomUser' and 'Group' class)"""

    class Meta:
        model = Permission
        exclude = ['id']


class GroupSerializer(serializers.ModelSerializer):
    """A serializer corresponding to 'Group' class (part of 'CustomUser' class)"""

    permissions = PermissionSerializer(many=True)

    class Meta:
        model = Group
        exclude = ['id']


class CustomUserSerializer(serializers.ModelSerializer):
    """A serializer corresponding to 'CustomUser' class"""

    groups = GroupSerializer(many=True)
    user_permissions = PermissionSerializer(many=True)

    # The following attributes store user's data which cannot be serialized directly (except 'username').
    # The 'password' needs to be hashed, and the 'group' and 'user_permissions' need to be set using their specific methods
    # before all can be stored in the database.
    data_groups: List[str]
    data_user_permissions: List[str]
    data_username: str
    data_password: str

    class Meta:
        model = CustomUser

        # Currently exclude 'id' since it is automatically generated,
        # and 'password' since it needs to be hashed before storing in the database
        exclude = configs.resolve('accounts.fields.full.exclude')

    def __init__(self, instance: CustomUser = None, data: Union[Dict[str, Any], QueryDict] = empty, **kwargs):
        """An object of 'CustomUserSerializer' can be created using an existing 'CustomUser' object (for updating),
        a dictionary compatible with the 'CustomUser' class (for creating), or a 'QueryDict' from an API request.
        """

        # A 'QueryDict' object as part of 'WSGIRequest' is immutable.
        # To make the data immutable for serialization, the object needs to be copied using 'deepcopy'
        if isinstance(data, QueryDict):
            data = {key: value[0] for key, value in dict(deepcopy(data)).items()}

        if data is not empty:
            self.data_groups = data.get('groups', None)
            self.data_password = data.pop('password', None)
            self.data_user_permissions = data.get('user_permissions', None)

            try:
                self.data_username = data['username']
            except KeyError:
                ValidationError("Missing 'username' field")

            # The 'groups' and 'user_permissions' data will be filled later during the creating or updating process
            # using their specific methods
            data['groups'] = []
            data['user_permissions'] = []

        super().__init__(instance=instance, data=data, **kwargs)

    def create(self, validated_data) -> CustomUser:
        del validated_data['groups']
        del validated_data['user_permissions']
        return self._set_password(self._link_groups_and_permissions(super().create(validated_data)))

    def update(self, instance, validated_data) -> CustomUser:
        del validated_data['groups']
        del validated_data['user_permissions']

        if 'email' in validated_data and instance.email != validated_data['email']:
            validated_data['is_email_verified'] = False

        return self._set_password(self._link_groups_and_permissions(super().update(instance, validated_data)))

    def _link_groups_and_permissions(self, user: CustomUser) -> CustomUser:
        """Links a 'CustomUser' object to its specified groups and permissions"""

        groups, permissions = self.data_groups, self.data_user_permissions
        groups, permissions = [groups] if isinstance(groups, str) else groups, [permissions] if isinstance(permissions, str) else permissions

        try:
            if groups is not None:
                if len(groups) > 0 and len(groups[0]) > 0:
                    user.groups.set([Group.objects.get_by_natural_key(group) for group in groups])
                else:
                    user.groups.set([])

            if permissions is not None:
                if len(permissions) > 0 and len(permissions[0]) > 0:
                    user.user_permissions.set([Permission.objects.get(codename=permission) for permission in permissions])
                else:
                    user.user_permissions.set([])

        except ObjectDoesNotExist as error:
            raise ObjectNotFound(_(str(error)))

        user.save()
        return user

    def _set_password(self, user: CustomUser) -> CustomUser:
        """Uses Django's 'AbstractBaseUser' model's 'set_password' method to hash the given password"""

        if self.data_password is not None:
            user.set_password(self.data_password)
            user.save()

        return user

    def validate(self, attrs):
        """Uses Django's 'validate_password' function to validate the given username and password"""

        if hasattr(self, 'data_username') and hasattr(self, 'data_password'):
            validate_password(self.data_password, user=self.data_username)

        return super().validate(attrs)


class CustomUserLimitedSerializer(CustomUserSerializer):
    """An additional 'CustomUser' serializer that limits account information being sent to the user since some information are not
    useful for viewing (e.g. password) and some are sensitive (e.g. 'is_superuser')
    """

    class Meta(CustomUserSerializer.Meta):
        exclude = configs.resolve('accounts.fields.limited.exclude')
        read_only_fields = configs.resolve('accounts.fields.limited.read_only')

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)

    def _link_groups_and_permissions(self, user: CustomUser):
        return user


class CustomUserBriefSerializer(CustomUserSerializer):
    """An additional 'CustomUser' serializer that only serializes username"""

    class Meta(CustomUserSerializer.Meta):
        exclude = None
        fields = ['username']
