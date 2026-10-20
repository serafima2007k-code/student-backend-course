"""Это модуль с примерами функций. Это docstring модуля (исправляет D100)."""

import os  # Два импорта в одной строке (E401)
import sys  # Теперь каждый импорт на своей строке


def very_long_function_name(param_one, param_two, param_three):
    """Вернуть сумму трёх параметров. Это docstring функции (исправляет D103)."""
    print("Hello World!")  # T201 остался, так как это пример
    return param_one + param_two + param_three  # Убрали лишние скобки (E201)


def complex_function(a, b, c):  # Добавили пробелы после запятых (E231)
    """Вернуть сумму трёх параметров. Это docstring функции (исправляет D103)."""
    # Упростили нечитаемо сложную функцию (C901)
    if a > b and b < c:
        for i in range(5):  # Сократили вложенность
            if c == a:
                pass
    return a + b + c

# Добавили пустую строку в конце файла (W292)