from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from rest_auth.models import TokenModel

@database_sync_to_async
def get_user(token_key):
	try:
		token = TokenModel.objects.get(key=token_key)
		return token.user
	except TokenModel.DoesNotExist:
		return AnonymousUser()

class TokenAuthMiddleware(BaseMiddleware):

	def __init__(self, inner):
		self.inner = inner

	async def __call__(self, scope, receive, send):
		try:
			query = dict((x.split('=') for x in scope['query_string'].decode().split("&")))
			token_key = query.get('token')
			scope['user'] = await get_user(token_key)
			return await super().__call__(scope, receive, send)
		except:
			pass
		return None