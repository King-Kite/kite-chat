from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView

from django.conf import settings
from django.conf.urls.static import static

admin.site.site_header = "Kite Administration"
admin.site.site_title = "Kite Administration Portal"
admin.site.index_title = "Kite Administration Portal"


urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
	path('api-auth/', include('rest_framework.urls')),
	# path('emoji/', include('emoji.urls')),
	path('rest-auth/', include('rest_auth.urls')),
	path('rest-auth/registration/', include('rest_auth.registration.urls')),
	path('', include('users.urls')),
	path('', include('chats.urls')),
	path('', TemplateView.as_view(template_name='index.html')),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
