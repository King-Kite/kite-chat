# Generated by Django 3.1.1 on 2021-04-24 19:40

import chats.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('users', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='Chat',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, null=True, unique=True)),
                ('group', models.BooleanField(default=False)),
                ('active', models.BooleanField(default=True)),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('admin', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='administrator', to='users.contact')),
                ('blocked', models.ManyToManyField(blank=True, related_name='blocked_participants', to='users.Contact')),
                ('hidden_for', models.ManyToManyField(blank=True, related_name='hidden', to='users.Contact')),
                ('participants', models.ManyToManyField(related_name='chats', to='users.Contact')),
            ],
        ),
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('form', models.CharField(choices=[('M', 'Message'), ('R', 'Request')], max_length=1)),
                ('message', models.TextField()),
                ('seen', models.BooleanField(default=False)),
                ('date', models.DateTimeField(auto_now=True)),
                ('chat', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='notify_chat', to='chats.chat')),
                ('recipient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notify_me', to='users.contact')),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notify', to='users.contact')),
            ],
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField()),
                ('media', models.FileField(blank=True, null=True, upload_to=chats.models.media_folder)),
                ('time', models.DateTimeField(auto_now_add=True)),
                ('kind', models.CharField(choices=[('A', 'Audio'), ('D', 'Document'), ('I', 'Image'), ('V', 'Video'), ('T', 'Text')], default='T', max_length=1, verbose_name='type')),
                ('chat', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='chats.chat')),
                ('cleared_by', models.ManyToManyField(blank=True, related_name='clearers', to='users.Contact')),
                ('contact', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='users.contact')),
                ('seen_by', models.ManyToManyField(blank=True, related_name='receivers', to='users.Contact')),
            ],
        ),
        migrations.CreateModel(
            name='Presence',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('channel_name', models.CharField(max_length=100)),
                ('time', models.DateTimeField(auto_now_add=True)),
                ('chat', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='chats.chat')),
                ('contact', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.contact')),
            ],
            options={
                'unique_together': {('chat', 'contact')},
            },
        ),
    ]
