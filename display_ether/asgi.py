"""
ASGI config for display_ether project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

from display_ether.settings import BASE_DIR
from whitenoise import WhiteNoise
import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "display_ether.settings")
django.setup()  # 🔥 Добавляем этот вызов перед импортами из Django

django_asgi_app = get_asgi_application()
application = WhiteNoise(django_asgi_app, root=os.path.join(BASE_DIR, 'staticfiles'))

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

