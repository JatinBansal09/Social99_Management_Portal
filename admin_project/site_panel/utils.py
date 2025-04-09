import random
from django.core.mail import send_mail
import hashlib

def generate_otp():
    """Generate a 6-digit OTP"""
    return str(random.randint(100000, 999999))

def send_otp_email(email, otp):
    """Send an OTP email to the user"""
    subject = "Password Reset OTP"
    message = f"Your OTP for password reset is: {otp}"
    from_email = "admin@example.com"  # Replace with your email
    recipient_list = [email]
    send_mail(subject, message, from_email, recipient_list)


def get_browser_identifier(request):
    user_agent = request.META.get('HTTP_USER_AGENT', '')
    ip_address = request.META.get('REMOTE_ADDR', '')

    # Create a unique identifier for the browser session
    identifier_string = f"{user_agent}-{ip_address}"
    browser_id = hashlib.sha256(identifier_string.encode()).hexdigest()  # Use hashlib to create a hash

    return browser_id