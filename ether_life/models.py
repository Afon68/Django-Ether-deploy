from django.db import models

class EthereumPrice(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)  # Время записи
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Цена ETH

    def __str__(self):
        return f"{self.timestamp}: {self.price}"
    
# 🔹 timestamp → автоматически записывает время.
# 🔹 price → хранит цену Ethereum.
