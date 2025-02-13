from django.urls import re_path
from .consumers import EthereumPriceConsumer

websocket_urlpatterns = [
    re_path(r"ws/eth-price/$", EthereumPriceConsumer.as_asgi()),  # ✅ WebSocket по адресу ws://127.0.0.1:8000/ws/eth-price/
]
# ✅ Теперь WebSocket работает по адресу ws://127.0.0.1:8000/ws/eth-price/