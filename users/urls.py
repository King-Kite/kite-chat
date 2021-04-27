from django.urls import include, path
from .views import SettingsAccountView


urlpatterns = [
	path('api/users/settings/account/<str:username>/', SettingsAccountView.as_view(), name='settings-account'),
]