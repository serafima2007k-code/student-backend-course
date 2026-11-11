-- Удаляем старые таблицы, если они были
DROP TABLE IF EXISTS dishes;
DROP TABLE IF EXISTS restaurants;

-- Создаем таблицу ресторанов
CREATE TABLE restaurants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    cuisine TEXT NOT NULL,
    rating REAL,
    address TEXT
);

-- Создаем таблицу блюд (связана с ресторанами)
CREATE TABLE dishes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    restaurant_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Индекс для быстрого поиска по кухне
CREATE INDEX idx_restaurants_cuisine ON restaurants(cuisine);