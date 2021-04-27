from django.urls import path
from .views import MessageCreateView

urlpatterns = [
    path('api/chats/create/message/',
    	MessageCreateView.as_view(), name='create-message'),
]
