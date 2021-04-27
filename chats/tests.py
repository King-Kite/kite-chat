import pytest
from channels.generic.websocket import (
	AsyncJsonWebsocketConsumer,
	AsyncWebsocketConsumer,
	JsonWebsocketConsumer,
	WebsocketConsumer,
)
from channels.layers import get_channel_layer
from channels.sessions import SessionMiddlewareStack
from channels.testing import WebsocketCommunicator
from django.test import override_settings

@pytest.mark.django_db
@pytest.mark.asyncio
async def test_websocket_consumer():
	"""
	Tests that WebsocketConsumer is implement correctly.
	"""
	results = {}

	class TestConsumer(WebsocketConsumer):
		def connect(self):
			results["connected"] = True
			self.accept()

		def receiver(self, text_data=None, bytes_data=None):
			results["received"] = (text_data, bytes_data)
			self.send(text_data=text_data, bytes_data=bytes_data)

		def disconnect(self, code):
			results["disconnected"] = code

	app = TestConsumer()

	# Test a normal connection
	communicator = WebsocketCommunicator(app, "/testws/")
	connected, _ = await communicator.connect()
	assert connected
	assert "connected" in results
	# Test sending text
	await communicator.send_to(text_data="hello")
	response = await communicator.receive_from()
	assert response == "hello"
	assert results["received"] == ("hello", None)
	# Test sending bytes
	await communicator.send_to(bytes_data=b"w\0\0\0")
	response = await communicator.receive_from()
	assert response == b"w\0\0\0"
	assert results["received"] == (None, b"w\0\0\0")
	# Close out
	await communicator.disconnect()
	assert "disconnected" in results





# import pytest
# import chats.routing
# from channels.routing import URLRouter
# from channels.testing import HttpCommunicator, WebsocketCommunicator
# from chats.models import Chat
# from django.contrib.auth import get_user_model
# from django.db.models import Q
# from django.test import Client, TestCase
# from rest_auth.models import TokenModel
# from users.models import Contact
# from .consumers import ChatConsumer

# @pytest.mark.django_db(transaction=True)
# @pytest.mark.asyncio
# async def test_consumer():
# 	class MyConsumer(TestCase):
# 		def setUp(self):
# 			"""Initialise variables."""
# 			User = get_user_model()
# 			self.user = User.objects.create(username='kite', email='john@smith.io', password='12345')
# 			self.chat = Chat.objects.get(name='kite') or Chat.objects.create(name='kite')
# 			self.token = TokenModel.objects.create(user=self.user)	

# 	communicator = WebsocketCommunicator(MyConsumer(), "/ws/kite/")
# 	connected, _ = await communicator.connect()
# 	assert connected

# class ConsumerTest(TestCase):
# 	def setUp(self):
# 		"""Initialise variables."""
# 		User = get_user_model()
# 		self.user = User.objects.create(username='kite', email='john@smith.io', password='12345')
# 		self.chat = Chat.objects.get(name='kite') or Chat.objects.create(name='kite')
# 		TokenModel.objects.create(user=self.user)

# 	# @pytest.mark.django_db(transaction=True)
# 	# @pytest.mark.asyncio
# 	async def test_my_consumer(self):
# 		application = URLRouter(chats.routing.websocket_urlpatterns)
# 		communicator = WebsocketCommunicator(application, "/ws/kite/")
# 		connected, subprotocol = await communicator.connect()
# 		print(connected)
# 		assert connected
# 		message = await communicator.receive_from()
# 		assert message == 'test'
# 		print(message)
# 		await communicator.send_to(text_data="hello")
# 		assert response == 'hellopopo'
# 		print(response)
# 		await communicator.disconnect()

# class ConsumerTest(TestCase):
# 	def setUp(self):
# 		"""Initialise variables."""
# 		User = get_user_model()
# 		self.user = User.objects.create(username='kite', email='john@smith.io', password='12345')
# 		self.chat = Chat.objects.get(name='kite') or Chat.objects.create(name='kite')
# 		TokenModel.objects.create(user=self.user)

# 	async def test_my_consumer(self):
# 		application = URLRouter(chats.routing.websocket_urlpatterns)
# 		communicator = WebsocketCommunicator(application, "ws/kite/")
# 		# communicator = WebsocketCommunicator(application, f"ws/kite/?token={self.user.auth_token.key}")
# 		connected, subprotocol = await communicator.connect()
# 		print(connected)
# 		assert connected
# 		message = await communicator.receive_from()
# 		assert message == 'test'
# 		print(message)
# 		await communicator.send_to(text_data="hello")
# 		assert response == 'hellopopo'
# 		print(response)
# 		await communicator.disconnect()

# class ConsumerTest(TestCase):
# 	async def test_my_consumer(self):
# 		communicator = HttpCommunicator(ChatConsumer, "GET", "/test/")
# 		response = await communicator.get_response()
# 		self.assertEqual(response["body"], b"test_response")
# 		self.assertEqual(response['status'], 200)

# async def test_my_consumer():
# 	application = URLRouter(chats.routing.websocket_urlpatterns)
# 	communicator = WebsocketCommunicator(application, "/kite/")
# 	connected, subprotocol = await communicator.connect()
# 	assert connected
# 	message = await communicator.receive_from()
# 	assert message == 'test'
# 	print(message)
# 	await communicator.send_to(text_data="hello")
# 	assert response == 'hellopopo'
# 	print(response)
# 	await communicator.disconnect()
