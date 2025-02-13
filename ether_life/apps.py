from django.apps import AppConfig
from .scheduler import start

class EtherLifeConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ether_life'

    def ready(self):
        """Запускаем планировщик при старте Django"""
        try:
            from .scheduler import start
            start()  # ✅ Запуск только при успешной загрузке Django
        except Exception as e:
            print(f"Ошибка при запуске планировщика: {e}")