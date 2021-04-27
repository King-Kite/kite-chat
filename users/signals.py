from chats.models import Chat, Notification, Presence
from django.db.models.signals import post_save, post_delete
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import Contact, FriendRequest, Profile


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
	if created:
		Profile.objects.create(user=instance)
		contact = Contact.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_profile(sender, instance,**kwargs):
	instance.profile.save()
	

@receiver(post_save, sender=Contact)
def add_to_base_chat(sender, instance, created, **kwargs):
	if created:
		chat = Chat.objects.create(name=instance.user.username)
		chat.participants.set([instance])


@receiver(post_save, sender=Presence)
def add_login_status(sender, instance, **kwargs):
	if instance.chat.name != instance.contact.user.username:
		pass
	else:
		instance.contact.logged_in = True
		instance.contact.last_login = instance.time
		instance.contact.save()

@receiver(post_delete, sender=Presence)
def remove_login_status(sender, instance, **kwargs):
	if instance.chat.name != instance.contact.user.username:
		pass
	else:
		instance.contact.logged_in = False
		instance.contact.save()


@receiver(post_save, sender=FriendRequest)
def add_friend_request_notification(sender, instance, created, **kwargs):
	def get_chat(sender, recipient):
		chats = Chat.objects.filter(participants=sender, group=False).exclude(name=sender.user.username)
		for chat in chats:
			if recipient in chat.participants.all():
				return chat
		return None

	if created:
		if get_chat(instance.sender, instance.recipient) is None:
			chat    = Chat.objects.create(
				name = f'{instance.sender.user.username}_{instance.recipient.user.username}'
			)
			chat.participants.set([instance.sender, instance.recipient])
		else:
			chat = get_chat(instance.sender, instance.recipient)
			
		message = f'{instance.sender.user.username.capitalize()} sent you a friend request!'

		notification  = Notification.objects.create(
			sender    = instance.sender,
			recipient = instance.recipient,
			chat      = chat,
			form      = 'R',
			message   = message
		)

@receiver(post_save, sender=FriendRequest)
def check_friend_request_notification(sender, instance, **kwargs):
	if instance.accepted == True:
		chat = Chat.objects.get(
			name = f'{instance.sender.user.username}_{instance.recipient.user.username}'
		)

		message = f'{instance.recipient.user.username.capitalize()} accepted your friend request!'

		notification  = Notification.objects.create(
			sender    = instance.recipient,
			recipient = instance.sender,
			chat      = chat,
			form      = 'R',
			message   = message
		)

# @receiver(post_delete, sender=Chat)
# def check_all_notifications(sender, instance, **kwargs):
# 	notifications      = Notification.objects.filter(chat=instance)
# 	if notifications.exists():
# 		for notification in notifications:
# 			notification.seen = True
# 			notification.save()