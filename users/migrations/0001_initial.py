# Generated by Django 3.1.1 on 2021-04-24 19:40

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('logged_in', models.BooleanField(default=False)),
                ('last_login', models.DateTimeField(auto_now=True)),
                ('blocked', models.ManyToManyField(blank=True, related_name='_contact_blocked_+', to='users.Contact')),
                ('people', models.ManyToManyField(blank=True, related_name='_contact_people_+', to='users.Contact')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='contact', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(default='images/profile/default.png', upload_to='images/profile')),
                ('location', models.CharField(blank=True, max_length=30, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='FriendRequest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField()),
                ('accepted', models.BooleanField(default=False)),
                ('recipient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='recipient', to='users.contact')),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sender', to='users.contact')),
            ],
            options={
                'unique_together': {('recipient', 'sender', 'accepted'), ('sender', 'recipient', 'accepted')},
            },
        ),
    ]
