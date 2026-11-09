from gameparts import Board
from gameparts.exceptions import CellOccupiedError, FieldIndexError


# Новая функция для сохранения результата
def save_result(result):
    # Открываем файл в режиме 'a' (добавление)
    file = open('results.txt', 'a', encoding='utf-8')
    file.write(result + '\n')
    file.close()


def main():
    game = Board()
    current_player = 'X'
    running = True
    game.display()

    while running:

        print(f'Ходит {current_player}')

        while True:
            try:
                row = int(input('Введите номер строки: '))
                if row < 0 or row >= game.field_size:
                    raise FieldIndexError
                column = int(input('Введите номер столбца: '))
                if column < 0 or column >= game.field_size:
                    raise FieldIndexError
                if game.board[row][column] != ' ':
                    raise CellOccupiedError
            except FieldIndexError:
                print(
                    'Значение должно быть неотрицательным и меньше '
                    f'{game.field_size}.'
                )
                print('Введите значения для строки и столбца заново.')
                continue
            except CellOccupiedError:
                print('Ячейка занята.')
                print('Введите другие координаты.')
                continue
            except ValueError:
                print('Буквы вводить нельзя. Только числа.')
                print('Введите значения для строки и столбца заново.')
                continue
            except Exception as e:
                print(f'Возникла ошибка: {e}')
            else:
                break

        game.make_move(row, column, current_player)
        game.display()
        
        # Проверка на победу или ничью и сохранение результата
        if game.check_win(current_player):
            result = f'Победили {current_player}.'
            print(result)
            save_result(result)
            running = False
        elif game.is_board_full():
            result = 'Ничья!'
            print(result)
            save_result(result)
            running = False

        current_player = 'O' if current_player == 'X' else 'X'


if __name__ == '__main__':
    main()