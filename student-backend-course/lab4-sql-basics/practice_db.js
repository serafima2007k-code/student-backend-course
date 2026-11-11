// Подключаем библиотеку для работы с SQLite
const Database = require('better-sqlite3');
// Создаем или открываем файл базы данных
const db = new Database('lab4.db');

// ============ 1. СОЗДАНИЕ ТАБЛИЦЫ ============
db.exec(`
  CREATE TABLE IF NOT EXISTS cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT NOT NULL,
    population INTEGER,
    country TEXT DEFAULT 'Россия',
    area REAL
  )
`);
// AUTOINCREMENT - автоматически ставит id (1, 2, 3...)
// PRIMARY KEY - уникальный идентификатор строки

// Очищаем таблицу, если запускаем код повторно
db.exec('DELETE FROM cities');

// ============ 2. INSERT (ВСТАВКА) ============
// prepare() создает "шаблон" запроса, run() подставляет данные
const insert = db.prepare('INSERT INTO cities (name, population, country, area) VALUES (?, ?, ?, ?)');
insert.run('Москва', 13000000, 'Россия', 2561);
insert.run('Санкт-Петербург', 5600000, 'Россия', 1439);
insert.run('Новосибирск', 1600000, 'Россия', 505);
insert.run('Екатеринбург', 1500000, 'Россия', 1112);
insert.run('Казань', 1250000, 'Россия', 425);
insert.run('Алматы', 2000000, 'Казахстан', 682);
console.log('Данные вставлены');

// ============ 3. SELECT (ВЫБОРКА) ============
console.log('\n--- Все города ---');
// .all() выполняет запрос и возвращает массив объектов (все строки)
const all = db.prepare('SELECT * FROM cities').all();
console.log(all);

// ============ 4. WHERE (ФИЛЬТРАЦИЯ) ============
console.log('\n--- Города с населением > 1.5 млн ---');
// Знак ? заменяется на 1500000 (защита от SQL-инъекций)
const big = db.prepare('SELECT * FROM cities WHERE population > ?').all(1500000);
console.log(big);

// ============ 5. ORDER BY (СОРТИРОВКА) ============
console.log('\n--- Сортировка по населению (убывание) ---');
const sorted = db.prepare('SELECT * FROM cities ORDER BY population DESC').all();
console.log(sorted);

// ============ 6. LIMIT (ОГРАНИЧЕНИЕ) ============
console.log('\n--- Первые 3 города ---');
const limited = db.prepare('SELECT * FROM cities LIMIT 3').all();
console.log(limited);

// ============ 7. UPDATE (ОБНОВЛЕНИЕ) ============
db.prepare('UPDATE cities SET population = ? WHERE id = ?').run(13500000, 1);
console.log('\nГород id=1 обновлён');

// ============ 8. DELETE (УДАЛЕНИЕ) ============
db.prepare('DELETE FROM cities WHERE id = ?').run(6);
console.log('Город id=6 удалён');

// ============ 9. АГРЕГАЦИЯ ============
console.log('\n--- Статистика ---');
// .get() возвращает ровно один объект (одну строку с результатами)
const stats = db.prepare(`
  SELECT
    COUNT(*) as total,
    SUM(population) as totalPopulation,
    AVG(population) as avgPopulation,
    MAX(population) as maxPopulation,
    MIN(population) as minPopulation
  FROM cities
`).get();
console.log(stats);

// ============ 10. LIKE (ПОИСК) ============
console.log('\n--- Поиск по подстроке "бург" ---');
const search = db.prepare('SELECT * FROM cities WHERE name LIKE ?').all('%бург%');
console.log(search);

// Закрываем базу
db.close();