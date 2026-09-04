const express = require('express');
const app = express();
const port = 300;

// Логирование (продвинутый уровень)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 1. Текстовый эндпоинт
app.get('/', (req, res) => {
  res.send('Hello, студент!');
});

// 2. JSON-эндпоинт 1 – список блюд
app.get('/api/dishes', (req, res) => {
  res.json({
    dishes: [
      { id: 1, name: 'Borscht', price: 300 },
      { id: 2, name: 'Pelmeni', price: 250 }
    ]
  });
});

// 3. JSON-эндпоинт 2 – список меню
app.get('/api/menus', (req, res) => {
  res.json({
    menus: [
      { id: 101, name: 'Lunch Menu', items: ['Borscht', 'Pelmeni'] },
      { id: 102, name: 'Dinner Menu', items: ['Steak', 'Salad'] }
    ]
  });
});

// 4. Параметризированный эндпоинт – блюдо по ID
app.get('/api/dishes/:id', (req, res) => {
  const dishId = parseInt(req.params.id);
  res.json({
    requestedId: dishId,
    status: 'success',
    message: `Информация о блюде с ID ${dishId}`,
    dish: {
      id: dishId,
      name: `Блюдо ${dishId}`,
      price: 200 + dishId * 10
    }
  });
});

// 5. Обработка 404
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});