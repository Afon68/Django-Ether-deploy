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
                // row.insertCell(0).innerText = elem.timestamp;  // Время
                row.insertCell(0).innerText = convertISOToLocal(elem.timestamp);  // Время

                
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

function convertISOToLocal(isoString) {
    console.log(`isoString = ${isoString}`);
    let date = new Date(isoString);
    timeLable = date.toLocaleString()
    return timeLable.slice(0,6) + timeLable.slice(8,10) + timeLable.slice(11); 
}

// function convertISOToLocal(parametr) {
//     console.log(`parametr = ${parametr}`);

//     // Разбираем строку "18.03.2025 15:52:07"
//     let parts = parametr.split(" ");
//     let dateParts = parts[0].split("."); // ["18", "03", "2025"]
//     let timePart = parts[1]; // "15:52:07"

//     // Формируем ISO-строку
//     let isoString = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${timePart}.000Z`;
//     console.log(`Тип времени: ${typeof isoString}`);
//     console.log(`Время: ${isoString}`);

//     // Проверяем, можно ли разобрать дату
//     let timestamp = Date.parse(isoString);
//     if (isNaN(timestamp)) {
//         console.error("Неверный формат даты:", isoString);
//         return "Invalid Date";
//     }
//         timeLable = new Date(timestamp).toLocaleString();
//     return timeLable.slice(0,6) + timeLable.slice(8);
// }
