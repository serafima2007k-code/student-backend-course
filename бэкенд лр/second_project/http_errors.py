def status_code_translator(status):
    if status == 400:
        return "Bad request"
    if status == 404:
        return "Not found"
    if status == 418:
        return "I'm a teapot"
    return "Something's wrong with the Internet"уЗ