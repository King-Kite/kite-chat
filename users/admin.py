from django.contrib import admin
from .models import Contact, FriendRequest, Profile

class ContactAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'logged_in', 'last_login')


class FriendRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'recipient', 'accepted')
    list_filter = ('sender', 'recipient', 'accepted')

class ProfileAdmin(admin.ModelAdmin):
	list_display = ('id', 'user')
	list_filter = ('id', 'user')

admin.site.register(Contact, ContactAdmin)
admin.site.register(FriendRequest, FriendRequestAdmin)
admin.site.register(Profile, ProfileAdmin)