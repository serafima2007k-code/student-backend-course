from http_errors import status_code_translator


def test_status_code_translator():
    result = status_code_translator(418)
    assert result == "I'm a teapot"