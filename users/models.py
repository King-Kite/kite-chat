from django.contrib.auth.models import User
from django.db import models

class Profile(models.Model):
	user     = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
	image    = models.ImageField(upload_to='images/profile', default='images/profile/default.png')
	location = models.CharField(max_length=30, blank=True, null=True)

	def __str__(self):
		return self.user.username


class Contact(models.Model):
	user       = models.OneToOneField(User, on_delete=models.CASCADE, related_name='contact')
	people     = models.ManyToManyField('self', blank=True, related_name='contacts')
	blocked    = models.ManyToManyField('self', blank=True, related_name='blocked_people')
	logged_in  = models.BooleanField(default=False)
	last_login = models.DateTimeField(auto_now=True)

	def __str__(self):
		return self.user.username

	def get_full_name(self):
		first_name = self.user.first_name.capitalize()
		last_name = self.user.last_name.capitalize()
		full_name = f'{first_name} {last_name}'
		return full_name


class FriendRequest(models.Model):
	sender    = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name='sender')
	recipient = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name='recipient')
	message   = models.TextField()
	accepted  = models.BooleanField(default=False)

	class Meta:
		unique_together = [['sender', 'recipient', 'accepted'], ['recipient', 'sender', 'accepted']]

	def __str__(self):
		return '%s %s' % (self.sender, self.recipient)