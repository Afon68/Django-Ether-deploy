"""
ASGI config for display_ether project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""


# import os
# from django.core.asgi import get_asgi_application
# from channels.routing import ProtocolTypeRouter, URLRouter
# from ether_life.routing import websocket_urlpatterns

# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "display_ether.settings")

# application = ProtocolTypeRouter({
#     "http": get_asgi_application(),
#     "websocket": URLRouter(websocket_urlpatterns)  # Подключаем WebSocket маршруты
# })




import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "display_ether.settings")
django.setup()  # 🔥 Добавляем этот вызов перед импортами из Django

from ether_life.routing import websocket_urlpatterns  # ✅ Переместили вниз

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter(websocket_urlpatterns),
})


# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'display_ether.settings')
# django.setup()  # ✅ Явно загружаем Django перед WebSockets

# application = ProtocolTypeRouter({
#     "http": get_asgi_application(),
#     "websocket": AuthMiddlewareStack(
#         URLRouter(websocket_urlpatterns)
#     ),
# })


# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'display_ether.settings')
# django.setup()  # ✅ Загружаем Django

# application = ProtocolTypeRouter({
#     "http": get_asgi_application(),
#     "websocket": AuthMiddlewareStack(
#         URLRouter(websocket_urlpatterns)
#     ),
# })

