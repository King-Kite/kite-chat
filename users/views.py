from django.contrib.auth import get_user_model
from rest_framework import generics
from rest_framework import mixins
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import SettingsAccountSerializer


User = get_user_model()

class SettingsAccountView(generics.UpdateAPIView, mixins.RetrieveModelMixin):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = User.objects.all()
    serializer_class = SettingsAccountSerializer
    lookup_field = 'username'

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        if serializer.errors:
            pass
        return Response(serializer.data)
