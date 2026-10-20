"""Модуль с тестами для математических функций."""
import pytest


def add_sum(a, b):
    """Складывает два числа."""
    return a + b


@pytest.mark.smoke
def test_add():
    """Тест сложения."""
    assert add_sum(2, 3) == 5, 'сумма не равна ожидаемой'


@pytest.mark.regression
def test_type_result():
    """Тест типа результата."""
    assert isinstance(add_sum(2, 3), int), 'не соответствует типу данных'


def test_addition_with_fixture(sample_numbers):
    """Тест с фикстурой."""
    a, b, expected = sample_numbers
    assert a + b == expected


def test_data_processing(temporary_data):
    """Тест обработки данных."""
    assert sum(temporary_data) == 15
    temporary_data.append(6)