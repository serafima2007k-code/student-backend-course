const express = require('express');
const app = express();
const port = 3000;

// ОБЯЗАТЕЛЬНО: чтобы читать JSON из тела запроса
app.use(express.json());

// Начальные данные
let items = [
  { id: 1, name: 'Товар 1', price: 100, quantity: 5 },
  { id: 2, name: 'Товар 2', price: 200, quantity: 3 },
  { id: 3, name: 'Товар 3', price: 300, quantity: 10 }
];

let nextId = 4;

// GET /items — все товары
app.get('/items', (req, res) => {
  res.json({ count: items.length, items });
});

// GET /items/:id — товар по ID
app.get('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find(i => i.id === id);
  if (!item) {
    return res.status(404).json({ error: 'Элемент не найден' });
  }
  res.json(item);
});

// POST /items — создание товара С ПРОВЕРКОЙ
app.post('/items', (req, res) => {
  // ПРОВЕРКА обязательных полей
  if (!req.body || !req.body.name || !req.body.price) {
    return res.status(400).json({
      error: 'Неверные данные: нужны поля name и price'
    });
  }

  const newItem = {
    id: nextId++,
    name: req.body.name,
    price: req.body.price,
    quantity: req.body.quantity || 0
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT /items/:id — обновление
app.put('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find(i => i.id === id);
  if (!item) {
    return res.status(404).json({ error: 'Элемент не найден' });
  }
  Object.assign(item, req.body);
  res.json(item);
});

// DELETE /items/:id — удаление
app.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = items.findIndex(i => i.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Элемент не найден' });
  }
  const deleted = items.splice(index, 1)[0];
  res.json({ message: 'Элемент удалён', deleted });
});

// Запуск
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});