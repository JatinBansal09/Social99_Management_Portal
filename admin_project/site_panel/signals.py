from django.db.models.signals import post_save
from django.contrib.auth.signals import user_logged_out
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import UserSession
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=User)
def create_or_update_user_session(sender, instance, created, **kwargs):
    """
    Create a UserSession when a user is created or updated.
    """
    if created:
        # Create a session record for new users
        UserSession.objects.create(user=instance)
        logger.info(f"Created UserSession for new user: {instance.username}")
    else:
        # Update session info for existing users if needed
        if hasattr(instance, 'session_info'):
            instance.session_info.save()
            logger.info(f"Updated UserSession for existing user: {instance.username}")
        else:
            logger.warning(f"User {instance.username} does not have a session_info attribute.")

@receiver(user_logged_out)
def clear_user_session(sender, request, user, **kwargs):
    try:
        user_session = UserSession.objects.get(user=user)
        user_session.session_key = None
        user_session.save()
    except UserSession.DoesNotExist:
        pass