from django.core.management.base import BaseCommand, CommandError
from chats.models import Presence

class Command(BaseCommand):
	help = 'Deletes all presences on server startup'

	def handle(self, *args, **options):
		presences = Presence.objects.all()
		presences.delete()
		# self.stdout.write(self.style.SUCCESS('Successfully deleted all presences!'))


	# def add_arguments(self, parser):
	# 	parser.add_argument('presence_ids', nargs='+', type=int)

	# def handle(self, *args, **options):
	# 	for presence_id in options['presence_ids']:
	# 		try:
	# 			presence = Presence.objects.get(pk=presence_id)
	# 		except Presence.DoesNotExist:
	# 			raise CommandError('Presence "%s" does not exist' % presence_id)
	# 		presence.delete()

	# 		self.stdout.write(self.style.SUCCESS('Successfully deleted presence "%s" % presence_id'))

	# def handle(self, *args, **options):
	# 	presences = Presence.objects.all()
	# 	for presence in presences:
	# 		try:
	# 			presence.delete()
	# 		except Presence.DoesNotExist:
	# 			raise CommandError('Presence Table is empty!')
	# 		self.stdout.write(self.style.SUCCESS('Successfully deleted presence'))
