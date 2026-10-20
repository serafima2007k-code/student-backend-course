def calculate_sum_and_average(numbers):
    total_sum = 0
    for num in numbers:
        total_sum += num

    average = total_sum / len(numbers)
    return total_sum, average

my_numbers = [10, 20, 30, 40, 57] 

total, avg = calculate_average(my_numbers)
print(f'Сумма чисел: {total}')
print(f'Среднее значение: {avg}')