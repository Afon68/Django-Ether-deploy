#!/usr/bin/env bash
# Устанавливаем зависимости
pip install -r requirements.txt
# Собираем статику
python manage.py collectstatic --noinput
# Применяем миграции
python manage.py migrate --noinput
# Запускаем сервер с Daphne
daphne -b 0.0.0.0 -p 8000 display_ether.asgi:application
