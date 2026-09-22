const express = require('express');
const app = express();
const port = 3008;

app.use(express.json());

// Логирование
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ========== ХРАНИЛИЩЕ ==========
let restaurants = [
  { id: 1, name: 'Пушкин', cuisine: 'Русская', rating: 4.8, address: 'Москва' },
  { id: 2, name: 'Bologna', cuisine: 'Итальянская', rating: 4.5, address: 'Москва' },
  { id: 3, name: 'Sushi Bar', cuisine: 'Японская', rating: 4.2, address: 'СПб' },
  { id: 4, name: 'Provence', cuisine: 'Французская', rating: 4.9, address: 'Москва' },
  { id: 5, name: 'Tiflis', cuisine: 'Грузинская', rating: 4.6, address: 'Москва' },
  { id: 6, name: 'Trattoria', cuisine: 'Итальянская', rating: 4.3, address: 'СПб' }
];

const dishes = {
  1: [{ id: 101, name: 'Борщ', price: 350 }],
  2: [{ id: 201, name: 'Паста', price: 550 }],
  3: [{ id: 301, name: 'Суши', price: 900 }]
};

// ====================================================
// GET /restaurants — все + search + filter + sort + pagination
// ====================================================
app.get('/restaurants', (req, res) => {
  let result = [...restaurants];

  // 1. ПОИСК (search)
  const search = req.query.search;
  if (search) {
    result = result.filter(r =>
      r.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // 2. ФИЛЬТРАЦИЯ (filter=field:value)
  const filter = req.query.filter;
  if (filter) {
    const [field, value] = filter.split(':');
    const allowedFilterFields = ['cuisine', 'rating'];

    if (!allowedFilterFields.includes(field)) {
      return res.status(400).json({
        error: `Фильтрация возможна только по полям: ${allowedFilterFields.join(', ')}`
      });
    }

    result = result.filter(r => {
      if (field === 'rating') {
        return parseFloat(r[field]) === parseFloat(value);
      }
      return String(r[field]).toLowerCase() === value.toLowerCase();
    });
  }

  // 3. СОРТИРОВКА (sort=field&order=asc|desc)
  const sort = req.query.sort;
  const order = req.query.order || 'asc';
  const allowedSortFields = ['id', 'name', 'rating'];

  if (sort) {
    if (!allowedSortFields.includes(sort)) {
      return res.status(400).json({
        error: `Поле сортировки должно быть одним из: ${allowedSortFields.join(', ')}`
      });
    }
    if (!['asc', 'desc'].includes(order)) {
      return res.status(400).json({ error: 'Параметр order должен быть asc или desc' });
    }
    result.sort((a, b) => {
      if (order === 'desc') return a[sort] < b[sort] ? 1 : -1;
      return a[sort] > b[sort] ? 1 : -1;
    });
  }

  // 4. ПАГИНАЦИЯ (page=1&limit=10) — ИСПРАВЛЕНО
  let page = 1;
  let limit = 10;

  if (req.query.page !== undefined) {
    page = parseInt(req.query.page);
    if (isNaN(page) || page < 1) {
      return res.status(400).json({ error: 'page должен быть >= 1' });
    }
  }

  if (req.query.limit !== undefined) {
    limit = parseInt(req.query.limit);
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return res.status(400).json({ error: 'limit должен быть от 1 до 100' });
    }
  }

  const totalCount = result.length;
  const totalPages = Math.ceil(totalCount / limit);
  const start = (page - 1) * limit;
  const paginated = result.slice(start, start + limit);

  // Ответ пагинации: count, page, limit, totalPages, items
  res.json({
    count: totalCount,
    page: page,
    limit: limit,
    totalPages: totalPages,
    items: paginated
  });
});

// GET /restaurants/:id — один ресторан
app.get('/restaurants/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: 'ID должен быть положительным числом' });
  }
  const restaurant = restaurants.find(r => r.id === id);
  if (!restaurant) {
    return res.status(404).json({ error: 'Ресторан не найден' });
  }
  res.json(restaurant);
});

// GET /restaurants/:id/dishes — вложенный ресурс
app.get('/restaurants/:id/dishes', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: 'ID должен быть положительным числом' });
  }
  const restaurant = restaurants.find(r => r.id === id);
  if (!restaurant) {
    return res.status(404).json({ error: 'Ресторан не найден' });
  }
  const list = dishes[id] || [];
  res.json({
    restaurantId: id,
    restaurant: restaurant.name,
    count: list.length,
    dishes: list
  });
});

// GET /cuisines/:cuisine/restaurants — элементы категории
app.get('/cuisines/:cuisine/restaurants', (req, res) => {
  const cuisine = req.params.cuisine;
  const filtered = restaurants.filter(r =>
    r.cuisine.toLowerCase() === cuisine.toLowerCase()
  );
  if (filtered.length === 0) {
    return res.status(404).json({ error: `Кухня "${cuisine}" не найдена` });
  }
  res.json({ cuisine, count: filtered.length, restaurants: filtered });
});

// ========== ОБРАБОТКА 404 ==========
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});