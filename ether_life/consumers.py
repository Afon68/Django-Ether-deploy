import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import EthereumPrice
from asgiref.sync import sync_to_async  # ✅ Добавляем
from django.utils.timezone import localtime

class EthereumPriceConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("✅ WebSocket подключен!")
        await self.accept()
        
        # Запускаем цикл обновления цены
        self.keep_running = True
        asyncio.create_task(self.send_price_updates())

    async def disconnect(self, close_code):
        print(f"❌ WebSocket отключен, код: {close_code}")
        self.keep_running = False

    async def send_price_updates(self):
        while self.keep_running:
            try:
                # ✅ Получаем **последние 10 записей**
                latest_prices = await sync_to_async(
                    lambda: list(EthereumPrice.objects.order_by("-timestamp")[:10])
                )()

                # Преобразуем данные для JSON
                price_list = [{"timestamp": str(p.timestamp).strftime("%d.%m.%Y %H:%M:%S"), "price": float(p.price)} for p in latest_prices]
                
                # ✅ Отправляем новые данные на фронт
                await self.send(text_data=json.dumps({"prices": price_list}))

                await asyncio.sleep(60)  # ⏳ Обновляем каждые 10 секунд
            except Exception as e:
                print(f"❌ Ошибка WebSocket: {e}")
                break

