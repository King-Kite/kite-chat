from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db import models
from users.models import Contact

MESSAGE_CHOICES = (
    ('A', 'Audio'),
    ('D', 'Document'),
    ('I', 'Image'),
    ('V', 'Video'),
    ('T', 'Text')
)

NOTIFICATION_CHOICES = (
    ('M', 'Message'),
    ('R', 'Request'),
)


class Chat(models.Model):
    name = models.CharField(max_length=100, unique=True, null=True)
    participants = models.ManyToManyField(Contact, related_name='chats')
    admin = models.ForeignKey(Contact, on_delete=models.SET_NULL, related_name='administrator', blank=True, null=True)
    group = models.BooleanField(default=False)
    active = models.BooleanField(default=True)
    hidden_for = models.ManyToManyField(
        Contact, related_name='hidden', blank=True)
    blocked = models.ManyToManyField(Contact, related_name='blocked_participants', blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.name:
            names = []

            for p in participants:
                names.append(p.user.username)

            self.name = '%s_%s' % (names[0], names[1])
        super().save(*args, **kwargs)

def media_folder(instance, filename):
    return 'images/chat/{}/{}'.format(instance.chat.name, filename)

class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='messages')
    contact = models.ForeignKey(
        Contact, on_delete=models.SET_NULL, blank=True, null=True)
    message = models.TextField()
    media = models.FileField(upload_to=media_folder, blank=True, null=True)
    cleared_by = models.ManyToManyField(
        Contact, related_name='clearers', blank=True)
    seen_by = models.ManyToManyField(
        Contact, related_name='receivers', blank=True)
    time = models.DateTimeField(auto_now_add=True)
    kind = models.CharField(verbose_name='type', max_length=1, choices=MESSAGE_CHOICES, default='T')


    def __str__(self):
        return '%s %s' % (self.contact, self.chat)

    def save(self, *args, **kwargs):
        if not self.message and not self.media:
            return ValidationError("Message or Media is unavailable!")
        return super().save(*args, **kwargs)


class Presence(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE)
    channel_name = models.CharField(max_length=100)
    time = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['chat', 'contact']

    def __str__(self):
        return '%s %s' % (self.chat, self.contact)

class Notification(models.Model):
	sender = models.ForeignKey(
        Contact, on_delete=models.CASCADE, related_name='notify')
	recipient = models.ForeignKey(
        Contact, on_delete=models.CASCADE, related_name='notify_me')
	chat = models.ForeignKey(
        Chat, on_delete=models.SET_NULL, related_name='notify_chat', null=True)
	form = models.CharField(max_length=1, choices=NOTIFICATION_CHOICES)
	message = models.TextField()
	seen = models.BooleanField(default=False)
	date = models.DateTimeField(auto_now=True)

	def __str__(self):
		return '%s %s' % (self.sender, self.form)

	def save(self, *args, **kwargs):
		if not self.chat:
			chat = Chat.objects.get(name=self.recipient.user.username)
			self.chat = chat
		return super().save(*args, **kwargs)
