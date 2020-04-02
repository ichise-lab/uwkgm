"""Django's admin page configuration for account management

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Permission

from accounts.models import CustomUser, ThrottleBurstPermit, ThrottleBurstRequest


class ThrottleBurstRequestAdmin(admin.ModelAdmin):
    list_display = ['user', 'api', 'name', 'limit', 'duration', 'start', 'expire']
    search_fields = ['user__username']
    list_filter = ['api', 'name']


class ThrottleBurstPermitAdmin(admin.ModelAdmin):
    list_display = ['user', 'api', 'name', 'limit', 'duration', 'start', 'expire', 'granter', 'request']
    search_fields = ['user__username', 'granter__username']
    list_filter = ['api', 'name', 'granter']


class ThrottleExpansionRequestInline(admin.TabularInline):
    model = ThrottleBurstRequest
    extra = 0


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'first_name', 'last_name']

    fieldsets = UserAdmin.fieldsets + (('Identification', {'fields': (('is_email_verified'),)}),
                                       ('Additional information', {'fields': ()}))
    inlines = [ThrottleExpansionRequestInline]


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(ThrottleBurstPermit, ThrottleBurstPermitAdmin)
admin.site.register(ThrottleBurstRequest, ThrottleBurstRequestAdmin)
admin.site.register(Permission)
