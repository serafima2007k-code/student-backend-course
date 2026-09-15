from flask import Flask, jsonify, request
import time

app = Flask(__name__)

# 1. Логирование – выполняется перед каждым запросом
@app.before_request
def log_request():
    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {request.method} {request.path}")

# 2. Корневой маршрут – возвращает текст
@app.route('/')
def home():
    return 'Привет, мир! Это мой первый сервер на Flask.'

# 3. Маршрут /api/status – возвращает JSON
@app.route('/api/status')
def status():
    return jsonify({
        'status': 'ok',
        'uptime': time.time() - start_time,
        'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
    })

# 4. Маршрут с параметром – /api/users/<id>
@app.route('/api/users/<int:user_id>')
def get_user(user_id):
    return jsonify({
        'userId': user_id,
        'name': f'Пользователь {user_id}',
        'email': f'user{user_id}@example.com'
    })

# 5. Обработка 404 – для всех остальных адресов
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Маршрут не найден'}), 404

# Запускаем сервер
if __name__ == '__main__':
    start_time = time.time()
    app.run(port=3000, debug=True)