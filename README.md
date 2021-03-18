# Barber-app-web-mobile
Projeto goBarber JavaScript/Typescript | ReactJS | React-Native | PostgreSQL: Docker image | TypeORM

## Available Scripts to project backend

In the project directory to backend, you can run into folder backend - project API nodejs/ use Typescript:

Install dependecies to project nodejs
### `cd backend` and `yarn`

### `yarn dev:server`

Run the API in the development mode.<br />
Open [http://localhost:3333](http://localhost:3333) to view it in the browser or use client Rest-API.

### `yarn start`
Run the API in the ts-node.<br />

# Recuperação de senha
**RF: Requisitos Funcionais**

- O usuário poderá recuperar sua senha informando o e-mail válido, previamente cadastrado no sistema;
- O usuário deve receber um e-mail com instruções de recuperação de senha;
- O usuário deve poder resetar sua senha;

**RNF: Requisitos Não Funcionais**

- Utilizar Mailtrap para testar envio de e-mail em ambientes de desenvolvimento;
- Utilizar o Amazon SES para envios em produção;
- O envio de e-mail deve acontecer em segundo plano (background job);

**RN: Regras de Negócio**

- O link enviado por e-mail para resetar senha, deve expirar em até 1 hora/60 minutos;
- O usuário precisa confirmar a nova senha ao resetar sua senha;

# Atualização de perfil
**RF: Requisitos Funcionais**
- O usuário deve poder atualizar seu perfil: nome, email e senha;

**RN: Regras de Negócio**
- O usuário não poder alterar seu e-mail para um e-mail já utilizado;
- Para atualizar sua senhao usuário deve informar a senha antiga;
- Para atualizar sua senha, o usuário precisa confirmar a nova senha;

# Painel do prestador
**RF: Requisitos Funcionais**

- O usuário deve poder listar seus agendamentos de um dia específico;
- O prestador deve receber uma notificação sempre que ocorrer um novo agendamento;
- O prestador deve poder visualizar as notificações não lidas;

**RNF: Requisitos Não Funcionais**

- Os agendamentos do prestador no dia devem ser amazenados em cache;
- A notificações do prestador devem ser amazenadas no mongoDB;
- As notifições do prestador devem ser enviadas em tempo-real usando Socket.io;

**RN: Regras de Negócio**

- O notificação deve ter um status lida ou não-lida para o controle do prestador;

# Agendamento de serviços
**RF: Requisitos Funcionais**

- O usuário deve poder listar todos os prestadores de serviços cadastrados;
- O usuário deve poder listar os dias de um mês com horário disponível do prestado;
- O usuário deve poder listar horários disponíveis em um dia específico de um prestador;
- O usuário deve poder um novo agendamento com um prestador;

**RNF: Requisitos Não Funcionais**

- A listagem de prestadores deve ser armazenado em cache;

**RN: Regras de Negócio**

- Cada agendamento deve durar uma hora - 1h;
- Os agendamentos deve estar disponíveis entre 8h00 às 18h00, primeiro horário 8h, último 17h;
- O usuário não pode agendar em um horário já ocupado;
- O usuário não pode agendar em um que já passou;
- O usuário não pode agendar serviços consigo mesmo, ou seja, ele não pode atender ele mesmo;
