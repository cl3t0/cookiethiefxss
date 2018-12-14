# Cookiethiefxss


O nosso sistema é constituido por dois programas. Um em Python, que é tudo o que o usuário precisa, e o outro em NodeJs, que trás a maior parte da segurança do nosso método.

A plano de ataque original para sequestro de sessão:

	- Encontrar uma falha XSS em um site com sistema de login.
	- Criar um script simples, que ao ser executado irá enviar o cookie da vítima à sua máquina.

Como podemos observar, esse plano tem algumas falhas, entre elas:

	- Ser pouco otimizado. Ou seja, perde muito tempo gerando um link, abrindo a sua máquina para a rede, e ainda tratando esses dados.
	- Ao abrir a sua máquina, você fica muito exposto. (Lembrando que para o cookie ser enviado, é necessário um endereço no próprio script, que fica na URL. Se a vítima apenas olhar para a URL ela consegue seu IP.)

Nossa solução:

	- Criar um script em Python, que otimiza o trabalho, deixando MUITO mais leve para o usuário.
	- Com a criação de um servidor, é possível deixá-lo como comunicador do navegador da vítima com a sua máquina (logicamente deixando o usuário camuflado).

Como usar?

	- Baixe o código do client (Python), para usar na sua máquina, e crie um servidor com o código do server (JavaScript). Rode-o utilizando o NodeJs.

	- AVISO: Não esqueça de editar a linha 12 do código do client (Python) para a endereço do servidor. ```
server = 'http://seuservidor/'
```

	- O único trabalho manual é encontrar uma falha XSS em um site de sua escolha e colocar as tags <script> e </script> na URL. Depois disso é apenas colocar o URL no client (Python) que ele faz tudo! Ele vai gerar um link para ser enviado à vítima, e quando ela clicar, o cookie já aparecerá na sua tela! Bom uso!

## Autores

* **[Pedro Cleto](https://github.com/cl3t0)** - *Estudante*
* **[Lucas Gabriel](https://github.com/JackC0der)** - *Estudante*
* **[Davi William](https://github.com/daviwms999)** - *Estudante*
