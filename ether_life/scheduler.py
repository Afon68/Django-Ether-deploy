from apscheduler.schedulers.background import BackgroundScheduler
import atexit

def start():
    print("✅ Планировщик запущен!")  # 🔥 Проверка
    
    from .views import update_eth_price  # ✅ Импортируем `views.py` только внутри функции

    scheduler = BackgroundScheduler()
    scheduler.add_job(update_eth_price, "interval", hours=1/20)
    scheduler.start()

    # Останавливаем планировщик при завершении Django-сервера
    atexit.register(lambda: scheduler.shutdown(wait=False))
