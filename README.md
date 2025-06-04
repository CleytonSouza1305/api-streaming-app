# 🎬 API - App de Streaming

API RESTful para autenticação de usuários, gerenciamento de perfis, histórico de visualização e favoritos. Projetada para integrar com um frontend de um app de streaming usando a API do TMDB.

---

## 🚀 Tecnologias Utilizadas

- Node.js
- Express.js
- PostgreSQL
- JWT (autenticação)
- bcrypt (criptografia de senha)
- dotenv
- uuid

---

## 📦 Instalação

```bash
git clone https://github.com/CleytonSouza1305/api-streaming-app.git
cd seu-app-streaming

npm install

cp .env.example .env

node src/database/createTables.js

npm start

```
## 🔐 Autenticação

A autenticação dos usuários será realizada utilizando JWT (JSON Web Token), por meio da biblioteca jsonwebtoken. Após um login bem-sucedido, o servidor gerará um token contendo informações do usuário autenticado. Esse token será enviado ao cliente e deverá ser incluído nas requisições subsequentes para acessar rotas protegidas.

O token terá um tempo de expiração de 7 dias, garantindo uma sessão prolongada, mas segura.

O token deve ser enviado no cabeçalho da requisição HTTP, no formato:
- Authorization: `Bearer ${token}`

---

## 📌 Endpoints

#### 🔹 GET
- /auth/users 

**Descrição:**  
Retorna a lista de todos os usuários cadastrados, podendo ser acessado somente por usuários com a role admin. Caso não seja um admin, a requisição retornará um erro.


**Requer autenticação:** ✅ Sim (JWT - Bearer Token)

- /auth/users/:id

**Descrição:**  
Retorna um usuário cadastrado através do id passado na requisição como parâmetro. Em caso de erro, a requisição retornará um 404 — usuário não encontrado. Caso contrário, retorna o objeto com os dados do usuário específico.


**Requer autenticação:** ✅ Sim (JWT - Bearer Token)


#### 🔸 POST
- /auth/register 

**Descrição:**  
Rota para cadastrar um novo usuário. Necessita informar no body as seguintes informações: <br>
{ <br>
  "name": "string",<br>
  "email": "string",<br>
  "password": "string",<br>
  "phone": "string"<br>
} <br>
Caso retorne erro, será informado o erro específico na response da requisição


**Requer autenticação:** ❌ Não (JWT - Bearer Token)

- /auth/login

**Descrição:**  
Rota para fazer login e receber seu token de verificação. Necessita informar no body as seguintes informações: <br>
{ <br>
  "email": "string",<br>
  "password": "string"<br>
} <br>
Caso retorne erro, será informado o erro específico na response da requisição,
se não, retorna o token do usuário autenticado.


**Requer autenticação:** ❌ Não (JWT - Bearer Token)
---
