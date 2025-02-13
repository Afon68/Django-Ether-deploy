from django.urls import path
from .views import get_latest_price_list
from .views import eth_price_with_js_view


app_name = 'ether_life'

urlpatterns = [
    path("", eth_price_with_js_view, name="eth_price"),
    # ✅ Теперь по адресу http://127.0.0.1:8000/latest-price-list/ будет JSON с ценой.
    path('latest-price-list/', get_latest_price_list, name="latest_price-list"),  # ✅ API для цены
]


