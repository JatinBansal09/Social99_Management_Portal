from django.utils import timezone
from django.contrib.sessions.models import Session
from django.utils.deprecation import MiddlewareMixin
from django.conf import settings 
from django.utils.timezone import now

class SessionTimeoutMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            # Check if the session has expired
            session_key = request.session.session_key
            try:
                session = Session.objects.get(session_key=session_key)
                if session.expire_date < timezone.now():
                    # Log the user out if the session has expired
                    from django.contrib.auth import logout
                    logout(request)
            except Session.DoesNotExist:
                pass

        response = self.get_response(request)
        return response
    

class ForceSessionExpiryMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        if request.session.get_expire_at_browser_close():
            # Ensure the session cookie is a session cookie (no expiration date)
            if request.session.session_key:
                response.set_cookie(
                    settings.SESSION_COOKIE_NAME,
                    request.session.session_key,
                    max_age=None,  # No max age (session cookie)
                    expires=None,  # No expiration date
                    path=settings.SESSION_COOKIE_PATH,
                    domain=settings.SESSION_COOKIE_DOMAIN,
                    secure=settings.SESSION_COOKIE_SECURE or None,
                    httponly=settings.SESSION_COOKIE_HTTPONLY or None,
                    samesite=settings.SESSION_COOKIE_SAMESITE,
                )
        return response
    
class UpdateLastActivityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            # Convert datetime to ISO format (string) before storing it in the session
            request.session['last_activity'] = now().isoformat()
        response = self.get_response(request)
        return response