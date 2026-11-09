def get_greeting():
    greetings = 'Hello'
    greetings = update_greetings(greetings)
    return greetings + '!'


def update_greetings(local_greetings):
    new_greetings = local_greetings + ' world'
    return new_greetings


if __name__ == '__main__':
    result = get_greeting()
    print(result)