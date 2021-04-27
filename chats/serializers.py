import os
from django.db.models import Q
from django.http import Http404
from django.utils.timezone import now
from rest_framework import serializers
from users.models import FriendRequest
from .models import Chat, Contact, Message, Notification


class DiscussionSerializer(serializers.ModelSerializer):
    user_info = serializers.SerializerMethodField('get_user_info')

    class Meta:
        model = Chat
        fields = ['name', 'user_info']

    def get_user_info(self, obj):
        contact_1 = self.context.get("contact")
        contact_2 = obj.participants.exclude(id=contact_1.id).first()
        if (contact_1 is not None) and (contact_2 is not None):
            is_friend = self.check_contact(contact_1, contact_2)
            frd_request = self.get_friend_request(contact_1, contact_2)
            user = contact_2.user

            if frd_request is not None:
                frnd_request = {
                    "sender": frd_request.sender.user.username,
                    "recipient": frd_request.recipient.user.username,
                    "message": frd_request.message,
                }
            else:
                frnd_request = {
                    "sender": "",
                    "recipient": "",
                    "message": "",
                }

            user_info = {
                "blocked": self.get_blocked_contact(obj, contact_1, contact_2),
                "username": user.username,
                "image_url": user.profile.image.url,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "full_name": user.contact.get_full_name(),
                "logged_in": user.contact.logged_in,
                "last_login": str(user.contact.last_login),
                "is_friend": is_friend,
                "frnd_request": frnd_request,
                "unread_count": self.get_unread_count(obj, contact_1),
                "last_message": self.get_last_message(obj, contact_2, contact_1)['message'],
                "last_msg_time": self.get_last_message(obj, contact_2, contact_1)['time'],
            }
            return user_info
        return None

    def check_contact(self, contact_1, contact_2):
        if (contact_1 in contact_2.people.all()) or (contact_2 in contact_1.people.all()):
            return True
        return False

    def get_friend_request(self, contact_1, contact_2):
        try:
            frdrequest = FriendRequest.objects.filter(
                Q(sender=contact_1, recipient=contact_2) |
                Q(sender=contact_2, recipient=contact_1)
            )
            return frdrequest.first()
        except FriendRequest.DoesNotExist:
            raise Http404("Friend Request Does Not Exist!")
        return None

    def get_unread_count(self, chat, contact):
        count = 0
        messages = Message.objects.filter(chat=chat)
        if messages.exists():
            for message in messages:
                if contact not in message.seen_by.all():
                    count += 1
                else:
                    pass
        return count

    def get_last_message(self, chat, contact, contact_2):
        message = Message.objects.filter(
            chat=chat, contact=contact).exclude(cleared_by=contact_2).last()
        if message:
            if len(message.message) <= 58:
                return {'message': message.message, 'time': str(message.time)}
            else:
                msg = message.message[0:59] + "..."
                return {'message': msg, 'time': str(message.time)}
        return {'message': "", 'time': str(now())}

    def get_blocked_contact(self, chat, contact1, contact2):
        if contact2 in chat.blocked.all() or contact2 in contact1.blocked.all():
            return True
        return False


class MessageSerializer(serializers.ModelSerializer):
    chat_name = serializers.SerializerMethodField('get_chat_name')
    username = serializers.SerializerMethodField('get_username')
    user_image = serializers.SerializerMethodField('get_user_image')
    media = serializers.SerializerMethodField('get_media_file')
    msg_time = serializers.SerializerMethodField('get_msg_time')

    class Meta:
        model = Message
        fields = ['chat_name', 'id', 'username', 'user_image', 'message', 'media', 'kind', 'msg_time']

    def get_chat_name(self, obj):
        return obj.chat.name

    def get_username(self, obj):
        return obj.contact.user.username

    def get_user_image(self, obj):
        return obj.contact.user.profile.image.url

    def get_media_file(self, obj):
        if obj.media and obj.media.storage.exists(obj.media.name):
            return {
                'name': os.path.basename(obj.media.name),
                'size': obj.media.size,
                'url': obj.media.url
            }
        return None

    def get_msg_time(self, obj):
        return str(obj.time)


class NotificationSerializer(serializers.ModelSerializer):
    user_info = serializers.SerializerMethodField('get_user_info')
    date = serializers.SerializerMethodField('get_date')
    chat_name = serializers.SerializerMethodField('get_chat_name')

    class Meta:
        model = Notification
        fields = ['id', 'sender', 'recipient', 'chat_name',
                  'message', 'seen', 'date', 'user_info']

    def get_date(self, obj):
        return str(obj.date);

    def get_chat_name(self, obj):
        if obj.chat:
            return obj.chat.name
        return obj.recipient.user.username;

    def get_user_info(self, obj):
        contact = obj.sender
        user = contact.user

        user_info = {
            "username": user.username,
            "image_url": user.profile.image.url,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "full_name": user.contact.get_full_name(),
            "logged_in": user.contact.logged_in,
            "last_login": str(user.contact.last_login)
        }

        return user_info

