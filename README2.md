# NC-News-Backend

Backend API for nc-news project. This is an article managment data base allowing for users to create articles, comments and search though them.

## Getting Started

Clone this repo :

`git clone https://github.com/jimstev2447/be-nc-news.git`
`cd be-nc-news`

### Setting up the project

#### Prerequisites

you will need to have nmp and node.js installed

`npm install npm -g`
[https://docs.npmjs.com/downloading-and-installing-node-js-and-npm]

#### Installing

once you have those installed you can install the dependencies required
`cd` into your repo then,
`npm install` - this will install the requires dependencies

you will need to make a knex file in order to like to your DB, to do this ...

### Creating Migrating and Seeding

There are scripts to seed and migrate the db, testing will do this for you.

`npm run setup-dbs` - creates the db's
`npm run seed` - seeds db'd

## Testing

There are two test scripts

`npm test` runs the tests for the app which tests all the endpoints and expected behavoiurs

`npm run test-utils` runs tests for the db utils

scripts to run tests for app and utils

## Hosted Site

[Site hosted using heroku ...](https://nc-news-project-backend-js.herokuapp.com/)

## Built with

list
node
pg
knex
mocha
npm

### Authors

### Acknowledgments
