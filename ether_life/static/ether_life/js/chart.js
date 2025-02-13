
const ctx = document.getElementById('ethChart').getContext('2d');
                    console.log("✅ WebSocket доступен, используем его.");
                    const ethChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: [],
                            datasets: [{
                                label: 'Ethereum Price (USD)',
                                data: [],
                                borderColor: "gray",  // Базовый цвет линии
                                backgroundColor: "rgba(0, 0, 255, 0.1)",
                                borderWidth: 2, // Базовая толщина
                                fill: true,
                                pointRadius: 3, // Радиус точек
                                pointBackgroundColor: "gray", // Цвет точек
                                segment: {
                                    borderColor: ctx => {
                                        const chart = ctx.chart;
                                        const { data } = chart.data.datasets[0];
                                        const index = ctx.p1DataIndex;  // Индекс текущей точки
                    
                                        // Если нет предыдущей точки, оставляем серый цвет
                                        if (index === 0) return "gray";
                    
                                        // Меняем цвет линии в зависимости от направления
                                        return data[index] > data[index - 1] ? "green" : "red";
                                    },
                                    borderWidth: ctx => {
                                        const chart = ctx.chart;
                                        const { data } = chart.data.datasets[0];
                                        const index = ctx.p1DataIndex;
                    
                                        // Если нет предыдущей точки, оставляем стандартную толщину
                                        if (index === 0) return 2;
                    
                                        // Толстая линия при росте, тонкая при падении
                                        return data[index] < data[index - 1] ? 7 : 1;
                                    }
                                }
                            }]
                        },
                        options: {
                            scales: {
                                x: { title: { display: true, text: "Время" } },
                                y: { title: { display: true, text: "Цена (USD)" } }
                            }
                        }
                    });
                    
            
                // ✅ Подключаем WebSocket
                const socket = new WebSocket("ws://127.0.0.1:8000/ws/eth-price/");
                socket.onmessage = function (event) {
                    console.log("📩 Данные от WebSocket:", event.data);
                    const data = JSON.parse(event.data);
            
                    // ✅ Получаем **самую последнюю цену**
                    let latest_price = data.prices[0].price;
                    let previous_price = data.prices[1].price;
            
                    // ✅ Отображаем текущую цену
                    let priceElement = document.getElementById("eth-price");
                    priceElement.innerText = latest_price + " USD " + (latest_price > previous_price ? "↑" : "↓");
                    priceElement.style.color = latest_price > previous_price ? "green" : "red";
                    document.getElementById("current").style.color = latest_price > previous_price ? "green" : "red";
                
                    // ✅ 1. Разворачиваем массив, чтобы новые данные были в конце
                    const sortedPrices = data.prices;
                
                    // ✅ 2. Перебираем весь массив и обновляем график
                    ethChart.data.labels = [];
                    ethChart.data.datasets[0].data = [];
                    //ethChart.data.datasets[0].borderColor = [];
                    sortedPrices.forEach(priceData => {
                        
                        ethChart.data.labels.unshift(priceData.timestamp);
                        ethChart.data.datasets[0].data.unshift(priceData.price);
                    });
                    // красим сегменты(звенья) графика и фон под ними
                    ethChart.data.datasets[0].segment = {
                        borderColor: ctx => {
                            const index = ctx.p1DataIndex; // Индекс второй точки сегмента
                            if (!index || index === 0) return "gray"; // Первая точка — серая
                            return ethChart.data.datasets[0].data[index] > ethChart.data.datasets[0].data[index - 1] 
                                ? "green"  // 📈 Если цена растёт — зелёный
                                : "red";    // 📉 Если падает — красный
                        },
                        backgroundColor: ctx => {
                            const index = ctx.p1DataIndex;
                            if (!index || index === 0) return "rgba(128, 128, 128, 0.1)"; // Серый, если первая точка
                            return ethChart.data.datasets[0].data[index] > ethChart.data.datasets[0].data[index - 1] 
                                ? "rgba(0, 255, 0, 0.1)"  // 📈 Зелёная прозрачность
                                : "rgba(255, 0, 0, 0.1)";  // 📉 Красная прозрачность
                        }
                    };
                    // цвет межзвеньевой точки
                    ethChart.data.datasets[0].borderColor = sortedPrices.reverse().map((priceData, i) => {
                        if (i === 0) return "gray";
                        return sortedPrices[i].price > sortedPrices[i - 1].price ? "green" : "red";
                    });
                     // размер межзвеньевой точки
                    ethChart.data.datasets[0].borderWidth = sortedPrices.map((priceData, i) => {
                        if (i === 0) return 2;
                        return sortedPrices[i].price > sortedPrices[i - 1].price ? 4 : 4;
                    });
                    
                    
                
                    // ✅ 4. Обновляем график
                    ethChart.update();
                };
            
                socket.onclose = function(event) {
                    console.log("WebSocket закрыт, код:", event.code);
                };
            
                socket.onerror = function (error) {
                    console.error("WebSocket Ошибка: ", error);
                };