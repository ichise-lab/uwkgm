from django.shortcuts import redirect

from uwkgm import url_prefix


def home_page(request):
    response = redirect('%s/admin/' % url_prefix)
    return response
