from django.contrib import admin
from .models import Chat, Message, Notification, Presence

class ChatAdmin(admin.ModelAdmin):
	list_display = ['id', 'name']

class MessageAdmin(admin.ModelAdmin):
	list_display = ['id', 'chat', 'contact', 'kind', 'time']
	list_filter  = ['chat', 'contact', 'kind', 'time']

class NotificationAdmin(admin.ModelAdmin):
	list_display = ['id', 'sender', 'recipient', 'form', 'seen']
	list_filter  = ['id', 'sender', 'recipient', 'form', 'seen']

class PresenceAdmin(admin.ModelAdmin):
	list_display = ['id', 'chat', 'contact', 'time']
	list_filter = ['id', 'chat', 'contact']



admin.site.register(Chat, ChatAdmin)
admin.site.register(Message, MessageAdmin)
admin.site.register(Notification, NotificationAdmin)
admin.site.register(Presence, PresenceAdmin)
