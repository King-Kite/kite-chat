import pytest
from django.test import override_settings

from channels.generic.websocket import (
	AsyncJsonWebsocketConsumer,
	AsyncWebsocketConsumer,
	JsonWebsocketConsumer,
	WebsocketConsumer,
)
from channels.layers import get_channel_layer
from channels.sessions import SessionMiddlewareStack
from channels.testing import WebsocketCommunicator


import chats.routing
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from channels.routing import URLRouter
from channels.testing import HttpCommunicator
from chats.models import Chat
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.test import Client, TestCase
from rest_auth.models import TokenModel
from users.models import Contact
from chats.consumers import ChatConsumer

User = get_user_model()

# @pytest.mark.django_db
# @pytest.mark.asyncio
# async def test_websocket_consumer():
# 	"""
# 	Tests that WebsocketConsumer is implement correctly.
# 	"""
# 	results = {}

# 	class TestConsumer(WebsocketConsumer):
# 		def connect(self):
# 			results["connected"] = True
# 			self.accept()

# 		def receive(self, text_data=None, bytes_data=None):
# 			results["received"] = (text_data, bytes_data)
# 			self.send(text_data=text_data, bytes_data=bytes_data)

# 		def disconnect(self, code):
# 			results["disconnected"] = code

# 	app = TestConsumer()

# 	# Test a normal connection
# 	communicator = WebsocketCommunicator(app, "/testws/")
# 	connected, _ = await communicator.connect()
# 	assert connected
# 	assert "connected" in results
# 	# Test sending text
# 	await communicator.send_to(text_data="hello")
# 	response = await communicator.receive_from()
# 	assert response == "hello"
# 	assert results["received"] == ("hello", None)
# 	# Test sending bytes
# 	await communicator.send_to(bytes_data=b"w\0\0\0")
# 	response = await communicator.receive_from()
# 	assert response == b"w\0\0\0"
# 	assert results["received"] == (None, b"w\0\0\0")
# 	# Close out
# 	await communicator.disconnect()
# 	assert "disconnected" in results


# @pytest.mark.django_db
# @pytest.mark.asyncio
# async def test_websocket_consumer_groups():
# 	"""
# 	Tests that WebsocketConsumer addas and removes channels from groups.
# 	"""
# 	results = {}

# 	class TestConsumer(WebsocketConsumer):
# 		groups = ["chat"]

# 		def receive(self, text_data=None, bytes_data=None):
# 			results["received"] = (text_data, bytes_data)
# 			self.send(text_data=text_data, bytes_data=bytes_data)

# 	app = TestConsumer()

# 	channel_layer_settings = {
# 		"default": {"BACKEND": "channles.layers.InMemoryChannelLayer"}
# 	}
# 	with override_settings(CHANNELS_LAYERS=channel_layer_settings):
# 		communicator = WebsocketCommunicator(app, "/testws/")
# 		await communicator.connect()

# 		channel_layer = get_channel_layer()
# 		# Test that the websocket channel was added to the group on connect
# 		message = {"type": "websocket.receive", "text": "hello"}
# 		await channel_layer.group_send("chat", message)
# 		response = await communicator.receive_from()
# 		assert response == "hello"
# 		assert results["received"] == ("hello", None)
# 		# Test that the websocket channel was discarded from the group on disconnect
# 		await communicator.disconnect()
# 		assert channel_layer.groups == {}


# @pytest.mark.django_db(transaction=True)
# @pytest.mark.asyncio
# async def test_my_consumer():

# 	user = sync_to_async(User.objects.create)(username="john", email="john@smith.com", password="12345")

# 	token = sync_to_async(TokenModel.objects.create)(user=user)

# 	print(user)
# 	print(token)

# 	application = URLRouter(chats.routing.websocket_urlpatterns)
# 	communicator = WebsocketCommunicator(application, f"/ws/kite/")
# 	connected, subprotocol = await communicator.connect()
# 	print(connected)
# 	assert connected
# 	message = await communicator.receive_from()
# 	assert message == 'test'
# 	print(message)
# 	await communicator.send_to(text_data="hello")
# 	assert response == 'hello'
# 	print(response)
# 	await communicator.disconnect()


@pytest.mark.django_db(transaction=True)
@pytest.mark.asyncio
async def test_my_consumer():

	application = URLRouter(chats.routing.websocket_urlpatterns)
	communicator = WebsocketCommunicator(application, "/ws/kite/")
	connected, subprotocol = await communicator.connect()
	print(connected)
	assert connected
	message = await communicator.receive_from()
	assert message == 'test'
	print(message)
	await communicator.send_to(text_data="hello")
	assert response == 'hello'
	print(response)
	await communicator.disconnect()
