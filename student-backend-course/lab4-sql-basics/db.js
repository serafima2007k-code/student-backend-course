const fs = require('fs'); 
const Database = require('better-sqlite3');
const db = new Database('lab4.db');


// Включаем поддержку внешних ключей (FOREIGN KEY) в SQLite
db.pragma('foreign_keys = ON');

// ============ 1. ВЫПОЛНЕНИЕ SQL-СКРИПТА ============
// Читаем файл init_db.sql и выполняем всё, что там написано
const sqlScript = fs.readFileSync('init_db.sql', 'utf8');
db.exec(sqlScript);

// ============ 2. INSERT (ВСТАВКА) ============
const insertRest = db.prepare('INSERT INTO restaurants (name, cuisine, rating, address) VALUES (?, ?, ?, ?)');
insertRest.run('Пушкин', 'Русская', 4.8, 'Москва');
insertRest.run('Bologna', 'Итальянская', 4.5, 'Москва');
insertRest.run('Sushi Bar', 'Японская', 4.2, 'СПб');
insertRest.run('Provence', 'Французская', 4.9, 'Москва');
insertRest.run('Tiflis', 'Грузинская', 4.6, 'Москва');
insertRest.run('Trattoria', 'Итальянская', 4.3, 'СПб');

const insertDish = db.prepare('INSERT INTO dishes (restaurant_id, name, price) VALUES (?, ?, ?)');
insertDish.run(1, 'Борщ', 350);
insertDish.run(1, 'Пельмени', 400);
insertDish.run(2, 'Паста Карбонара', 550);
insertDish.run(3, 'Суши-сет', 900);
insertDish.run(4, 'Круассан', 200);
console.log('Данные вставлены');

// ============ 3. SELECT + ORDER BY + LIMIT (Сортировка и Пагинация) ============
console.log('\n--- Пагинация: страница 1 (LIMIT 2 OFFSET 0) ---');
console.log(db.prepare('SELECT name, rating FROM restaurants ORDER BY rating DESC LIMIT 2 OFFSET 0').all());

console.log('\n--- Пагинация: страница 2 (LIMIT 2 OFFSET 2) ---');
console.log(db.prepare('SELECT name, rating FROM restaurants ORDER BY rating DESC LIMIT 2 OFFSET 2').all());

// ============ 4. WHERE + LIKE (Поиск) ============
console.log('\n--- Рестораны с рейтингом > 4.5 ---');
console.log(db.prepare('SELECT * FROM restaurants WHERE rating > ?').all(4.5));

console.log('\n--- Поиск по названию (LIKE) ---');
console.log(db.prepare("SELECT name FROM restaurants WHERE name LIKE ?").all('%Пуш%'));

// 4.1. BETWEEN (Средний уровень) - ДОБАВЛЕНО
console.log('\n--- 8. Диапазон (BETWEEN 4.3 AND 4.6) ---');
console.log(db.prepare('SELECT name, rating FROM restaurants WHERE rating BETWEEN ? AND ?').all(4.3, 4.6));

// 4.2. IN (Средний уровень) - ДОБАВЛЕНО
console.log('\n--- 9. Список значений (IN "Итальянская", "Русская") ---');
console.log(db.prepare("SELECT name, cuisine FROM restaurants WHERE cuisine IN (?, ?)").all('Итальянская', 'Русская'));

// ============ 5. АГРЕГАЦИЯ и GROUP BY ============
console.log('\n--- Статистика (COUNT, AVG, MAX, MIN) ---');
console.log(db.prepare('SELECT COUNT(*) as total, AVG(rating) as avg_rating, MAX(rating) as max_r, MIN(rating) as min_r FROM restaurants').get());

console.log('\n--- Группировка по кухне ---');
console.log(db.prepare('SELECT cuisine, COUNT(*) as count FROM restaurants GROUP BY cuisine').all());

// ============ 6. UPDATE и DELETE ============
db.prepare('UPDATE restaurants SET rating = ? WHERE id = ?').run(5.0, 1);
console.log('\n--- Рейтинг ресторана id=1 обновлён ---');

db.prepare('DELETE FROM restaurants WHERE id = ?').run(6);
console.log('--- Ресторан id=6 удалён ---');

// ============ 7. INNER JOIN (Объединение) ============
console.log('\n--- INNER JOIN: Рестораны и их блюда ---');
const innerJoin = db.prepare(`
  SELECT r.name AS restaurant, d.name AS dish, d.price
  FROM restaurants r
  INNER JOIN dishes d ON r.id = d.restaurant_id
`).all();
console.log(innerJoin);

// ============ 8. LEFT JOIN ============
console.log('\n--- LEFT JOIN: Все рестораны (даже если нет блюд) ---');
const leftJoin = db.prepare(`
  SELECT r.name AS restaurant, d.name AS dish
  FROM restaurants r
  LEFT JOIN dishes d ON r.id = d.restaurant_id
`).all();
console.log(leftJoin);

// ============ 9. GROUP BY + HAVING ============
console.log('\n--- GROUP BY + HAVING: Кухни, где больше 1 ресторана ---');
const having = db.prepare(`
  SELECT cuisine, COUNT(*) as count
  FROM restaurants
  GROUP BY cuisine
  HAVING count > 1
`).all();
console.log(having);

// ============ 10. ПОДЗАПРОС (SELECT внутри SELECT) ============
console.log('\n--- Подзапрос: Рестораны с рейтингом выше среднего ---');
const subquery = db.prepare(`
  SELECT name, rating FROM restaurants
  WHERE rating > (SELECT AVG(rating) FROM restaurants)
`).all();
console.log(subquery);

// ============ 11. ТРАНЗАКЦИЯ (BEGIN, ROLLBACK) ============
console.log('\n--- Транзакция (с откатом) ---');
try {
  // db.transaction создает безопасную обертку
  const transaction = db.transaction(() => {
    insertRest.run('Test', 'Test', 5.0, 'Тест');
    // Если тут выбросить ошибку (throw new Error), изменения откатятся
    throw new Error('Отмена тестовой транзакции'); 
  });
  transaction();
} catch (e) {
  console.log('Транзакция отменена (ROLLBACK). Ресторан Test не добавлен.');
}

db.close();

