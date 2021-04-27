from django.core.management import call_command

call_command('delete_all_presence')
call_command('runserver')