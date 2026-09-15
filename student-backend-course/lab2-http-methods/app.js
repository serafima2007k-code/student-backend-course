const express = require('express');
const app = express();
const port = 3001;

// Middleware для парсинга JSON из тела запроса
app.use(express.json());

// Middleware для логирования запросов
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ХРАНИЛИЩЕ ДАННЫХ В ПАМЯТИ 
let restaurants = [
  { id: 1, name: 'Пушкин', cuisine: 'Русская', address: 'Москва, Тверской б-р, 26А', rating: 4.8 },
  { id: 2, name: 'Bologna', cuisine: 'Итальянская', address: 'Москва, ул. Арбат, 10', rating: 4.5 },
  { id: 3, name: 'Sushi Bar', cuisine: 'Японская', address: 'СПб, Невский пр., 50', rating: 4.2 },
  { id: 4, name: 'Provence', cuisine: 'Французская', address: 'Москва, Кутузовский пр., 12', rating: 4.9 }
];

let nextId = 5;

// GET /restaurants — список с поиском, сортировкой и пагинацией
app.get('/restaurants', (req, res) => {
  let result = [...restaurants];

  // 1. ПОИСК по name (query: ?search=...)
  if (req.query.search) {
    const search = req.query.search.toLowerCase();
    result = result.filter(r => r.name.toLowerCase().includes(search));
  }

  // 2. СОРТИРОВКА (query: ?sort=field&order=asc|desc)
  if (req.query.sort) {
    const field = req.query.sort;
    const order = req.query.order === 'desc' ? -1 : 1;
    result.sort((a, b) => {
      if (a[field] < b[field]) return -1 * order;
      if (a[field] > b[field]) return 1 * order;
      return 0;
    });
  }

  // 3. ПАГИНАЦИЯ (query: ?page=1&limit=2)
  if (req.query.page && req.query.limit) {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const start = (page - 1) * limit;
    result = result.slice(start, start + limit);
  }

  res.json({ count: result.length, restaurants: result });
});

// GET /restaurants/:id — один ресторан
app.get('/restaurants/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const restaurant = restaurants.find(r => r.id === id);
  if (!restaurant) {
    return res.status(404).json({ error: 'Ресторан не найден' });
  }
  res.json(restaurant);
});

// POST /restaurants — создание с валидацией
app.post('/restaurants', (req, res) => {
  const { name, cuisine, address, rating } = req.body;

  // Проверка обязательных полей
  if (!name || !cuisine) {
    return res.status(400).json({ error: 'Поля name и cuisine обязательны' });
  }

  // Проверка типа и допустимых значений для rating
  if (rating !== undefined) {
    if (typeof rating !== 'number') {
      return res.status(400).json({ error: 'Поле rating должно быть числом' });
    }
    if (rating < 0 || rating > 5) {
      return res.status(400).json({ error: 'Поле rating должно быть в диапазоне от 0 до 5' });
    }
  }

  const newRestaurant = {
    id: nextId++,
    name,
    cuisine,
    address: address || '',
    rating: rating !== undefined ? rating : 0
  };
  restaurants.push(newRestaurant);
  res.status(201).json(newRestaurant);
});

// PUT /restaurants/:id — полное обновление
app.put('/restaurants/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = restaurants.findIndex(r => r.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Ресторан не найден' });
  }

  const { name, cuisine, address, rating } = req.body;

  // Валидация
  if (!name || !cuisine) {
    return res.status(400).json({ error: 'Поля name и cuisine обязательны' });
  }
  if (rating !== undefined && (typeof rating !== 'number' || rating < 0 || rating > 5)) {
    return res.status(400).json({ error: 'Поле rating должно быть числом от 0 до 5' });
  }

  restaurants[index] = {
    id,
    name,
    cuisine,
    address: address || '',
    rating: rating !== undefined ? rating : 0
  };
  res.json(restaurants[index]);
});

// DELETE /restaurants/:id — удаление (204 No Content)
app.delete('/restaurants/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = restaurants.findIndex(r => r.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Ресторан не найден' });
  }
  restaurants.splice(index, 1);
  // 204 No Content — успешное удаление без тела ответа
  res.status(204).send();
});

// ОБРАБОТКА 404 (для всех остальных маршрутов)
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// ЗАПУСК СЕРВЕРА
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});