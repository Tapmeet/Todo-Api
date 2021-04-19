
# Cowbows Calender API

Express / Nodejs with [JWT authentication](https://jwt.io/introduction/), Mongoose  used for database

<br />

## Requirements
- [Node.js](https://nodejs.org/) >= 6.x

<br />

## Authentication
Authentication is based on [json web tokens](https://jwt.io). `passport-jwt` strategy is used to handle the email / password authentication.
After a successful login the generated token is sent to the requester. 

<br />

## API
### Login: `api/auth/login`
```
POST api/auth/login
Host: localhost:3000
Content-Type: application/json

{
    "email": "test@gmail.com",
    "password": "123456789"
}
```

### Signup: `api/auth/register`
```
POST api/auth/register
Host: localhost:3000
Content-Type: application/json

{
    "email": "test@gmail.com",
    "password": "123456789",
    "confirmPassword": "123456789",
    "name": "Test",
    "surname": "test"
}
```

<br />

## Setting up for development
* clone repo: `git clone https://github.com/amitctsol/cowboyAPI.git` 
* change directory to cowboyAPI: 
* create a file named .env which should contain the following default setup:
```

JWT_SECRET=THisIsMySceretKey!  // used in JWT signing
MONGO_LOCAL_CONN_URL=mongodb+srv://catalyst:D3v@c@t@lyst@cluster0-ytkzq.mongodb.net/cowboyscalender?retryWrites=true&w=majority // used in Moongoose Connection
SENDGRID_API_KEY=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 // used in emails
FROM_EMAIL=thecowboyscalendar@gmail.com  // used in emails
WEBSITEURL=http://cowboyscalender.s3-website.us-east-2.amazonaws.com/ // used for live website urls

```

<br />

## Scripts
**Install Modules**
```bash
$ npm i
$ npm start
```

<br />

**Run**
```bash
$ npm run start # classic start OR
$ npm run dev # with nodemon live update  
```
Runs the application with [nodemon]("https://nodemon.io/"). Server is listening on Port 3000 by default. This can be overwritten by `PORT` constant. 

<br />
