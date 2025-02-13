from django.utils import timezone

from django.shortcuts import render
from .models import EthereumPrice
from .utils import get_eth_price
from django.utils.timezone import localtime, now
from datetime import timedelta
from django.http import JsonResponse

def update_eth_price():
    """Записываем новую цену только если она изменилась"""
    price = get_eth_price()
    last_price = EthereumPrice.objects.order_by('-timestamp').first()
    print(last_price)
    print(price)
    if last_price is None or float(last_price.price) != price:
        EthereumPrice.objects.create(price=price)
        print(f"✅ Новая цена {price} записана в БД!")
    else:
        print(f"🔄 Цена не изменилась ({price}), запись пропущена.")

def get_latest_price_list(request):
    prices = EthereumPrice.objects.all().order_by('-timestamp')[:25] # Последние 24 записи
    prices_with_diff = []
    previous_price = None
    # print(prices)
    for i in range(len(prices)):
        prices[i].timestamp = localtime(prices[i].timestamp).strftime("%d.%m.%Y %H:%M:%S")
        if i != len(prices) - 1:
            diff = round(prices[i].price - prices[i+1].price , 2)  # ✅ Вычитаем здесь
            if diff > 0:
                direction = '<span class="up">&uarr;</span>'  # 🔼 Красная стрелка вверх
            elif diff < 0:
                direction = '<span class="down">&darr;</span>'  # 🔽 Зелёная стрелка вниз
            else:
                direction = '<span class="neutral">➖</span>'  # ➖ Серый прочерк
        else:
            diff = None
            direction = '<span class="neutral">➖</span>'  # Если данных ещё нет
        prices_with_diff.append({"timestamp":prices[i].timestamp,"price": prices[i].price, "diff": diff, "direction": direction})
    print("✅ Отправляем данные с views.get_latest_price_list на фронт(update_list.js.then(response => response.json()))")
    return JsonResponse({"price_list": prices_with_diff if prices_with_diff else "Нет списка данных"})

def eth_price_with_js_view(request):
    return render(request,"eth_price.html")



