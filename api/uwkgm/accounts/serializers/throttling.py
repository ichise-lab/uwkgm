"""Throttling serializers

Serializers convert data models to Python datatypes. However, Django REST Framework cannot handle relations between fields automatically.
'SlugRelatedField' objects are needed to serialize the relations.

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""


from rest_framework import serializers

from accounts.models import CustomUser, ThrottleBurstPermit, ThrottleBurstRequest


class BurstRequestSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(queryset=CustomUser.objects.all(), slug_field='username')

    class Meta:
        model = ThrottleBurstRequest
        fields = '__all__'


class BurstPermitSerializer(serializers.ModelSerializer):
    granter = serializers.SlugRelatedField(queryset=CustomUser.objects.all(), slug_field='username')
    request = serializers.SlugRelatedField(queryset=ThrottleBurstRequest.objects.all(), slug_field='id', required=False)
    user = serializers.SlugRelatedField(queryset=CustomUser.objects.all(), slug_field='username')

    class Meta:
        model = ThrottleBurstPermit
        fields = '__all__'


class BurstPermitLimitedSerializer(BurstPermitSerializer):
    """An additional burst permit serializer that removes confidential data when users with no administrative or burst-granting privilege
    request the detail of any permits they were granted
    """

    granter = None
    user = None

    class Meta(BurstPermitSerializer.Meta):
        fields = None
        exclude = ['granter', 'user']
