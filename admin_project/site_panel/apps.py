from django.apps import AppConfig

class SitePanelConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'site_panel'

    def ready(self):
        import site_panel.signals  # if you're using Django signals