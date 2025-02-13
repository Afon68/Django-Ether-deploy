function updateList() {
    fetch('/latest-price-list/')  // ✅ Запрашиваем список цен
        .then(response => response.json())
        .then(data => { 
            console.log(data);
            
            let table = document.querySelector("table");  // Получаем таблицу
            table.innerHTML = `
                <tr>
                    <th>Время</th>
                    <th>Цена (USD)</th>
                    <th>Разница</th>
                </tr>`;  // Очищаем старые данные и добавляем заголовки

            for (let elem of data.price_list.slice(0,24).reverse()) {
                let row = table.insertRow(-1);  // Добавляем новую строку
                row.insertCell(0).innerText = elem.timestamp;  // Время

                
                let priceCell = row.insertCell(1)
                priceCell.innerHTML = elem.price + "  " + elem.direction;  // Цена + стрелка (HTML)
                //row.insertCell(2).innerText = elem.diff !== null ? elem.diff : "-";  // Разница // тернарный оператор {% endcomment %}
                let diffCell = row.insertCell(2);
                diffCell.innerText = elem.diff !== null ? elem.diff : "—";  // Разница

                if (elem.diff > 0) {
                    priceCell.style.color = "green";
                    diffCell.style.color = "green";  // Если положительное значение — зелёный
                    
                } else if (elem.diff < 0) {
                    diffCell.style.color = "red";  // Если отрицательное значение — красный
                    priceCell.style.color = "red";
                } else {
                    diffCell.style.color = "black";  // Если нет изменений — чёрный
            }
            
        }
        })
        .catch(error => console.error('Ошибка загрузки данных:', error));
}

setInterval(updateList, 60000);  // 🔄 Обновляем цену каждые 5 секунд
updateList();  // 🔥 Запускаем сразу при загрузке страницы