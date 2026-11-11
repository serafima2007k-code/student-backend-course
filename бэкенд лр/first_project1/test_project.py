from prediction import weather_report


def test_weather_report():
    result = weather_report()
    assert isinstance(result, str)