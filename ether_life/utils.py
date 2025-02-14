import requests

def get_eth_price():
    url = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    response = requests.get(url)
    data = response.json()

    if "ethereum" in data and "usd" in data["ethereum"]:
        return data["ethereum"]["usd"]
    else:
        print("⚠️ Ошибка API: Некорректный ответ", data)
        return None
