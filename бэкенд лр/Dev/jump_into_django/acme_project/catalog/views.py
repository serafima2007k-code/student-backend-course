from django.http import HttpResponse

def product_list(request):
    return HttpResponse("Список всех товаров (Каталог)")

def product_detail(request, pk):
    return HttpResponse(f'Товар номер {pk}')