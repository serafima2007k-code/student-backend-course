from django.http import HttpResponse


def description(request):
    return HttpResponse('Страница О нас')