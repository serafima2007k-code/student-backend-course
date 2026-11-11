"""
Программа для версии Python >= 3.10.

Пример из документации Python.
https://docs.python.org/3/tutorial/controlflow.html#match-statements
"""

def http_error(status):
    match status:
        case 400:
            return "Bad request"
        case 404:
            return "Not found"
        case 418:
            return "I'm a teapot"
        case _:
            return "Something's wrong with the Internet"

if __name__ == '__main__':
    print(http_error(418))