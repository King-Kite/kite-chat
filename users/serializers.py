from chats.models import Chat, Message
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Contact, Profile


class ContactSerializer(serializers.ModelSerializer):
    user_info = serializers.SerializerMethodField('get_user_info')
    last_login = serializers.SerializerMethodField('get_last_login')

    class Meta:
        model = Contact
        fields = ['id', 'logged_in', 'last_login', 'user_info']

    def get_last_login(self, obj):
        return str(obj.last_login)

    def get_unread_count(self, obj):
        count = 0
        chats = Chat.objects.filter(participants=obj, active=True)
        for chat in chats:
            messages = chat.messages.exclude(cleared_by=obj)
            for message in messages:
                if obj not in message.seen_by.all():
                    count += 1
        return count

    def get_user_info(self, obj):
        request = self.context.get("request")
        user = User.objects.filter(id=obj.user.id).first()
        content = {
            "username": user.username,
            "image_url": user.profile.image.url,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "full_name": obj.get_full_name(),
            "email": user.email,
            "location": user.profile.location,
            "contact_count": obj.people.count(),
            "chat_count": obj.chats.filter(active=True).exclude(name=user.username).count(),
            "unread_count": self.get_unread_count(obj),
        }

        return content


class ProfileSerializer(serializers.ModelSerializer):
    # image = Base64ImageField(max_length=None, required=False, use_url=True)
    image = serializers.ImageField(
        max_length=None, allow_empty_file=True, use_url=True, required=False)

    class Meta:
        model = Profile
        fields = ['image', 'location']

    def update(self, instance, validated_data):
        instance.image = validated_data.get('image')
        instance.location = validated_data.get('location')
        instance.save()
        return instance

class SettingsAccountSerializer(serializers.ModelSerializer):

    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'profile']

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile')
        instance.first_name = validated_data.get('first_name')
        instance.last_name = validated_data.get('last_name')
        instance.email = validated_data.get('email')
        instance.save()
        for key, value in profile_data.items():
            setattr(instance.profile, key, value)
        instance.profile.save(update_fields=profile_data.keys())
        return instance
