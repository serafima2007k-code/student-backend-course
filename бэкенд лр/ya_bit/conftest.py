import pytest


@pytest.fixture
def sample_numbers():
    """Возвращает кортеж с числами для тестирования"""
    return (5, 10, 15)
@pytest.fixture
def temporary_data():
    # ПОДГОТОВКА
    data = [1, 2, 3, 4, 5]
    print("\nДанные подготовлены:", data)
    
    yield data  # <--- В этот момент запустится сам тест
    
    # ОЧИСТКА (выполнится после теста)
    data.clear()
    print("Данные очищены! Список пуст:", data)