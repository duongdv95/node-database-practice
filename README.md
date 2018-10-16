# todo-mysql-app

I created a todo app with the goal of practicing back end development using MySQL. This will help me complete the backend for
a [trello clone](https://github.com/duongdv95/trello-clone) I am attempting to make.

## Getting Started

git clone https://github.com/duongdv95/todo-mysql-app.git

Create a config.js file in the root folder with the following:

```javascript
const config = {
    db_host: {
        HOST: "YOUR MYSQL HOST",
        PORT: "YOUR MYSQL PORT",
        USER: "YOUR MYSQL DB USERNAME",
        PASSWORD: "YOUR MYSQL DB PASSWORD",
        DATABASE: "YOUR MYSQL DB NAME"
    }
}

module.exports = config;
```

npm install

node server.js
### Prerequisites

1. Node version 7+
2. MySQL database running locally or cloud (AWS)

### Installing

Deploying locally
1. Install node version 7+
2. Clone from this repo
3. Create config file with your DB credentials (check getting started)
4. run npm install
5. run node server.js

Deploying on heroku
1. Follow steps on [heroku](https://devcenter.heroku.com/articles/deploying-nodejs#next-steps)
2. Set environment variables to match your DB credentials
3. Deploy

## Built With

* [knex.js](https://knexjs.org/) - SQL query builder that helps your app communicate with MySQL database
* [node.js](https://nodejs.org/en/) - Javascript runtime that works as your backend
* [MySQL](https://www.mysql.com/) - SQL database

## Authors

* **Daniel Duong** - [duongdv95](https://github.com/duongdv95)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Thank you to PurpleBooth for creating this readme template
