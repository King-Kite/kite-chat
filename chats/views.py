from django.db.models import Q
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from users.models import Contact
from .models import Chat, Message

class MessageCreateView(APIView):
	authentication_classes = (TokenAuthentication,)
	permission_classes = (IsAuthenticated,)

	def get_chat(self, name):
		try:
			return Chat.objects.get(name=name)
		except Chat.DoesNotExist:
			pass
		return None

	def get_contact(self, username):
		try:
			return Contact.objects.get(Q(user__username=username))
		except Contact.DoesNotExist:
			pass
		return None

	def post(self, request, *args, **kwargs):
		chat = self.get_chat(request.data.get("chat"))
		contact = self.get_contact(request.data.get("contact"))
		media = request.data.get("media")
		media_type = request.data.get("media_type")
		if chat and contact and media and media_type and contact in chat.participants.all():
			message = Message.objects.create(
				chat=chat,
				contact=contact,
				media=media,
				kind=media_type
			)
			message.seen_by.add(contact)
			data = {
				'command': 'new_media',
				'chat_name': chat.name,
				'username': contact.user.username,
				'message': message.id
			}
			return Response(data, status=status.HTTP_201_CREATED)
		return Response(status=status.HTTP_400_BAD_REQUEST)
