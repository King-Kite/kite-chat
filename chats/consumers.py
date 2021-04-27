import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.db import IntegrityError
from django.db.models import Q
from django.utils.timezone import now
from users.models import Contact, FriendRequest
from users.serializers import ContactSerializer
from .models import Chat, Message, Notification, Presence
from .serializers import DiscussionSerializer, MessageSerializer, NotificationSerializer


class ChatConsumer(WebsocketConsumer):

    """ Getters Start """

    # Get Contact Function
    def get_contact(self, username):
        try:
            contact = Contact.objects.get(Q(user__username=username))
            return contact
        except Contact.DoesNotExist:
            pass
        return None

    # Get Chat Function
    def get_chat(self, chat_name):
        try:
            chat = Chat.objects.get(name=chat_name)
            return chat
        except Chat.DoesNotExist:
            pass
        return None

    # Get User Data Function
    def get_user_data(self, data):
        contact = self.get_contact(data['username'])
        if contact:
            result = {}
            room_group_name = 'chat_%s' % contact.user.username
            serializer = ContactSerializer(contact)
            result['command'] = 'get_user_data'
            result['data'] = serializer.data
            return self.send_notification_alert(result, room_group_name)
        return None
     
    # Get User Contacts Function   
    def get_user_contacts(self, data):
        contact = self.get_contact(data['username'])
        if contact:
            room_group_name = 'chat_%s' % contact.user.username
            contacts = []
            for people in contact.people.all():
                serializer = ContactSerializer(people)
                data = serializer.data
                contacts.append(data)
            data = {'command':'get_user_contacts', 'data':contacts}
            return self.send_notification_alert(data, room_group_name)
        return None

    # Get User Discussions Function
    def get_user_discussions(self, data):
        contact = self.get_contact(data['username'])
        if contact:
            room_group_name = 'chat_%s' % contact.user.username
            discussions = []
            chats = Chat.objects.exclude(name=contact.user.username
                ).filter(participants=contact, active=True).exclude(hidden_for=contact)
            for chat in chats:
                serializer = DiscussionSerializer(chat, context={'contact': contact})
                data = serializer.data
                discussions.append(data)
            data = {'command':'get_user_discussions', 'data':discussions}
            return self.send_notification_alert(data, room_group_name)
        return None

    # Get User Notifications Function
    def get_user_notifications(self, data):
        contact = self.get_contact(data['username'])
        if contact:
            room_group_name = 'chat_%s' % contact.user.username
            notify = []
            notifications = Notification.objects.filter(
                                recipient=contact).order_by('-date')
            for notification in notifications:
                serializer = NotificationSerializer(notification)
                data = serializer.data
                notify.append(data)
            content = {'command':'get_user_notifications', 'data':notify}
            return self.send_notification_alert(content, room_group_name)
        return None

    # Get Message Function
    def get_message(self, id, chat, contact):
        try:
            message = Message.objects.get(id=id, chat=chat, contact=contact)
            return message
        except Message.DoesNotExist:
            pass
        return None

    # Get Recipient Information Function
    def get_recipient_info(self, data):
        chat = self.get_chat(data['chat_name'])
        contact = self.get_contact(data['username'])

        if chat and contact:
            result = {}
            serializer = DiscussionSerializer(chat, context={'contact': contact})
            result['command'] = 'get_recipient_info'
            result['data'] = serializer.data
            room_group_name = 'chat_%s' % (contact.user.username)
            return self.send_notification_alert(result, room_group_name)
        return None

    # Get Contact Information Function
    def get_contact_info(self, data):
        me = self.get_contact(data['username'])
        contact = self.get_contact(data['contact'])

        if me:
            room_group_name = 'chat_%s' % me.user.username
            if contact is None:
                content = {
                    'command': 'get_contact_info',
                    'data': {
                        'error': 'No Contact with specified Username!',
                        'recipient': data['contact'],
                    }
                }
            elif contact is not None:
                data = {'user_info': {
                    'recipient': contact.user.username,
                    'image_url': contact.user.profile.image.url,
                    'first_name': contact.user.first_name,
                    'last_name': contact.user.last_name,
                }}
                content = {
                    'command': 'get_contact_info',
                    'data': data
                }
            return self.send_notification_alert(content, room_group_name)
        return None


    # Get Friend Request
    def get_friend_request(self, sender, recipient):
        contact_1 = self.get_contact(sender)
        contact_2 = self.get_contact(recipient)
        if contact_1 and contact_2:
            try:
                frdrequest = FriendRequest.objects.filter(
                    sender=contact_1,
                    recipient=contact_2,
                    accepted=False
                )
                return frdrequest.first()
            except FriendRequest.DoesNotExist:
                pass
        return None

    # Fetch Messages Function
    def fetch_messages(self, data):
        chat = self.get_chat(data['chat_name'])
        contact = self.get_contact(data['username'])
        if contact and chat:
            messages = Message.objects.filter(chat=chat).exclude(
                cleared_by=contact).order_by('-time')[:data['number']]

            content = {
                'command': 'fetch_messages',
                'data': self.messages_to_json(messages)
            }
            return self.send_message(content)
        return None
    
    """ Getters Stop """

    """ Creators Start """

    # Create or Get New Chat
    def create_chat(self, data):
        sender = self.get_contact(data['sender'])
        recipient = self.get_contact(data['recipient'])
        message = data['message']
        if sender and recipient:
            chat = None;
            chats = Chat.objects.filter(participants=sender, group=False).exclude(name=sender.user.username)
            for c in chats:
                if recipient in c.participants.all():
                    chat = c;
                    chat.hidden_for.remove(recipient);
                    chat.hidden_for.remove(sender);
                    break;
                else:
                    chat_name = '%s_%s' % (sender.user.username, recipient.user.username)
                    try:
                        new_chat = Chat.objects.create(name=chat_name)
                        new_chat.participants.set([sender, recipient])
                        chat = new_chat
                    except IntegrityError:
                        pass
            if chat is not None:
                message = Message.objects.create(
                    chat=chat, contact=sender, message=message)
                message.seen_by.add(sender)
                room_group_name = 'chat_%s' % sender.user.username
                serializer = DiscussionSerializer(chat, context={'contact': sender})
                discussion = serializer.data
                data = {'command':'new_discussion', 'data':discussion}
                self.send_notification_alert(data, room_group_name)
                return self.send_notification_alert(
                    {'command': 'create_chat', 'data': chat.name, 'username': sender.user.username}, room_group_name)
        return None

    # Create New Presence Function
    def new_presence(self, data):
        chat = self.get_chat(data['chat_name'])
        contact = self.get_contact(data['username'])
        if chat and contact:
            presence = Presence.objects.filter(chat=chat, contact=contact).first()
            if presence is not None:
                self.delete_presence(presence)
            try:
                presence = Presence.objects.create(
                    channel_name=self.channel_name,
                    chat=chat,
                    contact=contact
                )
                data = {
                    'command': 'new_presence',
                    'presence': presence
                }
                return data
            except IntegrityError:
                pass
        return None
    
    # Create New Message Function
    def new_message(self, data):
        chat = self.get_chat(data['chat_name'])
        contact = self.get_contact(data['username'])
        message = str(data['message'])
        if chat and contact:
            msg = Message.objects.create(
                chat=chat, contact=contact, message=message
            )
            msg.seen_by.add(contact)
            return self.after_message(chat, contact, msg)
        return None

    # Create New Media Function
    def new_media(self, data):
        chat = self.get_chat(data['chat_name'])
        contact = self.get_contact(data['username'])
        message = self.get_message(data['message'], chat, contact)

        if chat and contact and message:
            return self.after_message(chat, contact, message)
        return None

    # Create New Friend Request
    def new_friend_request(self, data):
        sender = self.get_contact(data['sender'])
        recipient = self.get_contact(data['recipient'])
        message = data['message']
        if sender and recipient:
            room_group_name = 'chat_%s' % sender.user.username
            if sender == recipient:
                content = {
                    'command': 'new_friend_request',
                    'data': {
                        'error': "You cannot add yourself as a new contact.",
                        'friend': None
                    }
                }
            elif recipient not in sender.people.all():
                frd_request = self.get_friend_request(sender, recipient)
                if frd_request:
                    content = {
                        'command': 'new_friend_request',
                        'data': {
                            'error': f"You already sent {recipient.user.username.capitalize()} a friend request.",
                            'friend': None
                        }
                    }
                else:
                    frd_request = FriendRequest.objects.create(
                        sender=sender, recipient=recipient, message=message
                    )
                    try:
                        chat = Chat.objects.exclude(name=frd_request.sender.user.username).filter(
                            group=False, participants=frd_request.sender).filter(
                            participants=frd_request.recipient).first()
                        serializer = DiscussionSerializer(chat, context={'contact': frd_request.sender})
                        data = serializer.data
                        content = {
                            'command': 'new_friend_request',
                            'data': {
                                'success': f"You successfully sent {recipient.user.username.capitalize()} a friend request.",
                                'friend': data
                            }
                        }
                    except Chat.DoesNotExist:
                        content = {
                            'command': 'new_friend_request',
                            'data': {
                                'success': f"You successfully sent {recipient.user.username.capitalize()} a friend request.",
                                'friend': None
                            }
                        }
                chat = Chat.objects.exclude(name=frd_request.sender.user.username).filter(
                            group=False, participants=frd_request.sender).filter(
                            participants=frd_request.recipient).first()
                serializer = DiscussionSerializer(chat, context={'contact': recipient})
                discussion = serializer.data
                content2 = {
                    'command': "new_discussion",
                    'data': discussion
                }
                room_group_name2 = 'chat_%s' % recipient.user.username
                recipient_chat = Chat.objects.get(name=recipient.user.username)
                presence = self.check_presence(recipient_chat, recipient)
                if presence:
                    self.send_notification_alert(content2, room_group_name2)
            else:
                content = {
                    'command': 'new_friend_request',
                    'data': {
                        'error': f"{recipient.user.username.capitalize()} is already on your contact list.",
                        'friend': None
                    }
                }
            return self.send_notification_alert(content, room_group_name)
        return None

    # Create New Notification Function
    def new_notification(self, data):
        notification = Notification.objects.create(
            sender=data['sender'],
            recipient=data['recipient'],
            chat=data['chat'],
            form=data['form'],
            message=data['message']
        )
        chat = self.get_chat(data['recipient'])
        contact = self.get_contact(data['recipient'])
        presence = self.check_presence(chat, contact)
        if presence:
            room_group_name = 'chat_%s' % contact.user.username
            serializer = NotificationSerializer(notification)
            data = serializer.data
            content = {'command':'new_notification', 'data':data}
            self.send_notification_alert(content, room_group_name)
            if notification.form == 'M':
                messages = Message.objects.filter(chat=notification.chat).exclude(seen_by=contact)
                if messages.exists():
                    room_group_name = 'chat_%s' % contact.user.username
                    data = {'chat_name':notification.chat.name, 'count': messages.count()}
                    content = {'command':'update_discussions', 'data':data}
                    self.send_notification_alert(content, room_group_name)
        return notification

    # Create Notification After Message(!) Function
    def after_message(self, chat, contact, message):
        contact2 = chat.participants.exclude(id=contact.id).first()
        presence = self.check_presence(chat, contact2)
        if presence or contact in contact2.blocked.all():
            message.seen_by.add(contact2)
            message.cleared_by.add(contact2)
        else:
            msg = f'{contact.user.username.capitalize()} just sent you a new message!'
            content = {
                    'sender': contact,
                    'recipient': contact2,
                    'chat': chat,
                    'message': msg,
                    'form': 'M'
                }
            self.new_notification(content)
        content = {
            'command': 'new_message',
            'data': self.message_to_json(message)
        }
        return self.send_chat_message(content)

    """ Creator Stop """

    """ Checker Start """

    def check_presence(self, chat, contact):
        presences = Presence.objects.filter(
            chat=chat,
            contact=contact
        )
        if presences.exists():
            return True
        return False

    def check_notification(self, data):
        chat = self.get_chat(data['chat_name'])
        contact = self.get_contact(data['username'])

        if chat and contact:
            notifications = Notification.objects.filter(
                recipient=contact, chat=chat, seen=False)
            if notifications.exists():
                for notification in notifications:
                    notification.seen = True
                    notification.save()

                room_group_name = 'chat_%s' % contact.user.username
                content = {'command':'seen_notifications', 'data':chat.name}
                self.send_notification_alert(content, room_group_name)

            messages = Message.objects.filter(chat=chat).exclude(seen_by=contact)
            if messages.exists():
                for message in messages:
                    message.seen_by.add(contact)

                room_group_name = 'chat_%s' % contact.user.username
                data = {'chat_name':chat.name, 'count': 0}
                content = {'command':'update_discussions', 'data':data}
                self.send_notification_alert(content, room_group_name)
        return None

    """ Checker Stop """

    """ Deleter Start """

    # Delete Presence Function
    def delete_presence(self, presence):
        channel_name = presence.channel_name
        room_group_name = 'chat_%s' % presence.chat.name

        async_to_sync(self.channel_layer.group_discard)(
            room_group_name,
            channel_name
        )

        return presence.delete()

    # Delete Contact Function
    def delete_contact(self, data):
        chat = self.get_chat(data['chat_name'])
        sender = self.get_contact(data['username'])
        recipient = self.get_contact(data['friend'])
        if chat and sender and recipient:
            sender.people.remove(recipient)
            recipient.people.remove(sender)
            message = f'{sender.user.username.capitalize()} unfriended you!'
            data = {
                'sender' : sender,
                'recipient' : recipient,
                'chat' : chat,
                'form' : 'M',
                'message' : message,
            }
            room_group_sender = 'chat_%s' % (sender.user.username)
            room_group_recipient = 'chat_%s' % (recipient.user.username)
            content_sender = {
                'command': 'remove_contact',
                'data': recipient.user.username
            }
            content_recipient = {
                'command': 'remove_contact',
                'data': sender.user.username
            }
            content = {
                'command': 'remove_discussion',
                'data': chat.name
            }
            self.send_chat_message({'command': 'stop_chat', 'data': chat.name})
            self.new_notification(data)
            self.send_notification_alert(content_sender, room_group_sender)
            self.send_notification_alert(content, room_group_sender)
            recipient_chat = Chat.objects.get(name=recipient.user.username)
            presence = self.check_presence(recipient_chat, recipient)
            if presence is True:
                self.send_notification_alert(content_recipient, room_group_recipient)
                self.send_notification_alert(content, room_group_recipient)
            chat.delete()
        return None

    # Delete Friend Request Function
    def delete_friend_request(self, data):
        chat = self.get_chat(data['chat_name'])
        sender = data['username']
        recipient = data['friend']
        deleted_by = data['who_acted']
        frd_request = self.get_friend_request(sender, recipient)

        if frd_request is None:
            return None

        if sender == deleted_by:
            message = f'{sender.capitalize()} deleted his Friend Request!'
            notification_sender = frd_request.sender
            notification_recipient = frd_request.recipient
        else:
            message = f'{recipient.capitalize()} rejected your Friend Request!'
            notification_sender = frd_request.recipient
            notification_recipient = frd_request.sender

        data = {
            "sender": notification_sender,
            "recipient": notification_recipient,
            "chat": chat,
            "form": 'R',
            "message": message
        }
        self.new_notification(data)

        content_sender = {
            'command': 'handle_request',
            'data': {'command': 'delete', 'chat_name': chat.name, 'friend': recipient}
        }
        room_sender = f'chat_{sender}'
        content_recipient = {
            'command': 'handle_request',
            'data': {'command': 'delete', 'chat_name': chat.name, 'friend': sender}
        }
        room_recipient = f'chat_{recipient}'
        self.send_notification_alert(content_sender, room_sender)
        self.send_notification_alert(content_recipient, room_recipient)
        self.send_notification_alert({'command': 'remove_discussion', 'data': chat.name}, room_sender)
        self.send_notification_alert({'command': 'remove_discussion', 'data': chat.name}, room_recipient)
        chat.delete()

        return frd_request.delete()

    # Clear History Function
    def clear_history(self, data):
        contact = self.get_contact(data['username'])
        if contact:
            if data['chat_name'] != "all":
                chat = self.get_chat(data['chat_name'])
                if chat:
                    messages = Message.objects.filter(chat=chat)
                    for message in messages:
                        message.cleared_by.add(contact)
            else:
                chats = Chat.objects.filter(participants=contact)
                for chat in chats:
                    messages = Message.objects.filter(chat=chat)
                    for message in messages:
                        message.cleared_by.add(contact)
            return True
        return None

    # Hide Chat Function
    def hide_chat(self, data):
        contact = self.get_contact(data['username'])
        content = {'command': 'remove_discussion', 'data': data['chat_name'] }
        room_group_name = 'chat_%s' % contact.user.username
        if contact:
            if data['chat_name'] != "all":
                chat = self.get_chat(data['chat_name'])
                if chat:
                    chat.hidden_for.add(contact)
            else:
                chats = Chat.objects.filter(participants=contact)
                for chat in chats:
                    chat.hidden_for.add(contact)
            return self.send_notification_alert(content, room_group_name)
        return None

    # Block Contact Function
    def block_contact(self, data):
        command = 'block_contact'
        chat = self.get_chat(data['chat_name'])
        sender = self.get_contact(data['username'])
        recipient = self.get_contact(data['friend'])

        if sender and recipient:
            room_group_name = 'chat_%s' % sender.user.username
            if chat:
                if sender in chat.blocked.all():
                    chat.blocked.remove(sender)
                elif sender not in chat.blocked.all():
                    chat.blocked.add(sender)

            if recipient in sender.blocked.all():
                sender.blocked.remove(recipient)
                content = {'command': command, 'data': {'command':'unblock', 'friend': recipient.user.username}}
            elif recipient not in sender.blocked.all():
                sender.blocked.add(recipient)
                content = {'command': command, 'data': {'command':'block', 'friend': recipient.user.username}}
            return self.send_notification_alert(content, room_group_name)
        return None

    # Disconnect Presence Function
    def disconnect_presence(self, data):
        chat = self.get_chat(data['chat_name'])
        contact = self.get_contact(data['username'])
        if contact and chat:
            presence = Presence.objects.filter(
                contact=contact, chat=chat).first()
            if presence is not None:
                return self.delete_presence(presence)
        else:
            return None

    # Accept Friend Request Function
    def accept_friend_request(self, data):
        chat = self.get_chat(data['chat_name'])
        sender = data['username']
        recipient = data['friend']

        frd_request = self.get_friend_request(sender, recipient)
        if frd_request is not None:
            frd_request.accepted = True
            frd_request.sender.people.add(frd_request.recipient)
            frd_request.recipient.people.add(frd_request.sender)

            message = f'{recipient.capitalize()} accepted your Friend Request!'

            data = {
                "sender": frd_request.recipient,
                "recipient": frd_request.sender,
                "chat": chat,
                "form": 'R',
                "message": message
            }
            self.new_notification(data)

            r_serializer = ContactSerializer(frd_request.recipient)
            r_friend = r_serializer.data
            s_serializer = ContactSerializer(frd_request.sender)
            s_friend = s_serializer.data

            content_sender = {
                'command': 'handle_request',
                'data': {'command': 'accept', 'chat_name': chat.name, 'friend': r_friend}
            }
            room_sender = f'chat_{sender}'
            content_recipient = {
                'command': 'handle_request',
                'data': {'command': 'accept', 'chat_name': chat.name, 'friend': s_friend}
            }
            room_recipient = f'chat_{recipient}'
            self.send_notification_alert(content_sender, room_sender)
            self.send_notification_alert(content_recipient, room_recipient)
            self.send_notification_alert({'command': 'update_discussions', 
                'data': {'chat_name':chat.name, 'count': "accept"}}, room_sender)
            self.send_notification_alert({'command': 'update_discussions', 
                'data': {'chat_name':chat.name, 'count': "accept"}}, room_recipient)
            return frd_request.delete()
        return None

    """ Deleter Stop """

    """ Helpers Start """

    # Messages To JSON Function
    def messages_to_json(self, messages):
        result = []
        for message in messages:
            result.append(self.message_to_json(message))
        return result

    # Message To JSON Function
    def message_to_json(self, message):
        serializer = MessageSerializer(message)
        data = serializer.data
        return data

    """ Helpers Stop """


    commands = {
        'get_user_data' : get_user_data,
        'get_user_contacts' : get_user_contacts,
        'get_user_discussions' : get_user_discussions,
        'get_user_notifications': get_user_notifications,
        'fetch_messages': fetch_messages,
        'new_message': new_message,
        'new_media': new_media,
        'new_friend_request': new_friend_request,
        'get_contact_info': get_contact_info,
        'get_recipient_info': get_recipient_info,
        'new_presence': new_presence,
        'disconnect_presence': disconnect_presence,
        'check_notification': check_notification,
        'accept_friend_request': accept_friend_request,
        'delete_friend_request': delete_friend_request,
        'create_chat': create_chat,
        'clear_history': clear_history,
        'hide_chat': hide_chat,
        'block_contact': block_contact,
        'delete_contact': delete_contact,
    }

    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        chat = self.get_chat(self.room_name)
        # user = self.scope['user']

        # if chat and user and user.is_anonymous is False:
        if chat:

            # Join room group
            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name,
                self.channel_name
            )

            self.accept()
        else:
            self.close()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )
        presence = Presence.objects.filter(
            channel_name=self.channel_name).first()
        if presence:
            if presence.chat.name == presence.contact.user.username:
                contact = presence.contact
                contact.logged_in = False
                contact.save()
            presence.delete()
        self.close()

    # Receive message from WebSocket
    def receive(self, text_data):
        data = json.loads(text_data)
        self.commands[data['command']](self, data)

    def send_chat_message(self, message):
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    def send_message(self, message):
        self.send(text_data=json.dumps(message))

    # Receive message from room group
    def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        self.send(text_data=json.dumps(message))

    def send_notification_alert(self, alert, room_group_name):
        # Send notification to room group
        async_to_sync(self.channel_layer.group_send)(
            room_group_name,
            {
                'type': 'notification_alert',
                'alert': alert
            }
        )

    # Receive notification from room group
    def notification_alert(self, event):
        alert = event['alert']

        # Send notification to WebSocket
        self.send(text_data=json.dumps(alert))

"""
    def check_participants(self, data):
        sender = data['sender']
        chat = data['chat']
        form = data['form']
        data = {
            'chat': chat,
            'sender': sender
        }
        participants = chat.participants.exclude(id=sender.id)

        if form == 'R':
            message = f'{sender.user.username.capitalize()} sent you a friend request!'
        else:
            message = f'{sender.user.username.capitalize()} just sent you a new message!'

        for participant in participants:
            presences = self.check_presence(chat, participant)
            if presences or (participant in chat.blocked.all()) or (sender in participant.blocked.all()):
                pass
            else:
                content = {
                    'sender': sender,
                    'recipient': participant,
                    'chat': chat,
                    'message': message,
                    'form': form
                }
                self.new_notification(content)
"""