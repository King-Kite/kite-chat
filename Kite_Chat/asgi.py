import os
from .settings import BASE_DIR
import chats.routing

# from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from chats.middleware.middleware import TokenAuthMiddleware
from django.core.asgi import get_asgi_application
# from whitenoise import WhiteNoise

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Kite_Chat.settings')

application = ProtocolTypeRouter({
	# "http":  WhiteNoise(get_asgi_application(), root=f'{BASE_DIR}/static/'),
	"http": get_asgi_application(),
	"websocket": AllowedHostsOriginValidator(
		# AuthMiddlewareStack(
				TokenAuthMiddleware(
					URLRouter(
							chats.routing.websocket_urlpatterns
						)
				)
			# )
		),
	})

# application = WhiteNoise(application)