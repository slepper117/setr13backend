# setr13backend - SETR - IPCA

Trabalho realizado para a disciplina de Sistemas Embebidos e em Tempo Real

## Objetivo

Construir uma Web Api para o registo de entradas e saídas dos trabalhadores da empresa, assim como o autorizar o seu acesso a certas áreas da empresa e reserva de salas de reunião.

## Diagrama de Entidade-Relação

O projeto é executado com o apoio de um servidor de PostgreSQL, com a seguinte estrutura:

![Diagrama de Entidade-Relação](models/setr.drawio.png)

## Controlo de Versão

### Versão 1.0

- Startup e configurações iniciais

### Versão 2.0

- Configuração do middleware de erros
- Configuração do Knex
- Estruturação dos controladores e rotas
- Definição do controlador das salas, áreas e marcação de ponto

### Versão 2.1

- Alterações na base de dados

### Versão 2.2

- Adição da Autenticação
- Adição do controlo de acesso às salas
- Alteração do controlador de salas, areas e reservas

### Versão 3.0

- Ultimas adições de segurança
- Alterações à base de dados
- Correção de Bugs
- Testes e adição de novas validações

### Versão 3.1

- Configuração do Logger
- Preparação da documentação

### Versão 3.2

- Correção de pequenos Bugs
