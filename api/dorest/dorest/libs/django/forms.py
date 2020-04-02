"""Django REST Framework's form-related operators

The Dorest project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from typing import Any, Dict

from django.db.models.fields import Field
from django.db.models.fields.related import RelatedField, ForeignKey


def extract_fields(obj: Any) -> Dict[str, Any]:
    """A recursive function that extracts all fields in a Django model, including related fields (e.g. many-to-many)

    :param obj: A Django model
    :return: A dictionary containing fields and associated values
    """

    sub_content = {}

    if obj is not None:

        # Gets a list of any Django model fields
        fields = type(obj)._meta.get_fields()

        for field in fields:

            if issubclass(field.__class__, ForeignKey):
                sub_content[field.name] = extract_fields(getattr(obj, field.name))
            elif issubclass(field.__class__, RelatedField):
                sub_content[field.name] = [extract_fields(sub_obj) for sub_obj in list(getattr(obj, field.name).all())]
            elif issubclass(field.__class__, Field):
                sub_content[field.name] = getattr(obj, field.name)

    return sub_content
