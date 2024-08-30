# Project README

## Overview

This project consists of a React frontend and a Node.js backend. The frontend uses React and Vite for development, while the backend is built with Node.js and Express. The project uses Knex for database migrations and seeding.

Make sure to install all necessary dependencies for both frontend and backend by running:

```bash
npm install
```
For handling Excel file operations, install the xlsx package:

```bash
npm install xlsx
```



## Frontend

The frontend is developed using React. Use the following command to start the development server:

```bash
npm run dev
```

## Backend
The backend is developed using Node.js and Express. Start the backend server with:


```bash
npm start
```

## Database
The project uses Knex.js for database migrations and seeding. Ensure you have configured your knexfile.cjs correctly with your database settings.

## Running Migrations
To apply the latest migrations, run:

```bash
npx knex migrate:latest --knexfile ./knexfile.cjs
```

## Rolling Back Migrations
To roll back the last batch of migrations, use:

```bash
npx knex migrate:rollback --knexfile ./knexfile.cjs
```
## Running Seed Files
To run all seed files, use:

```bash
npx knex seed:run --knexfile ./knexfile.cjs
```

To run a specific seed file, use:

```bash
npx knex seed:run --specific assets.cjs --knexfile ./knexfile.cjs
```

## Rolling Back Seed Files
To roll back the last batch of seed files, use:

```bash
npx knex seed:rollback --knexfile ./knexfile.cjs
```

npx knex migrate:make drop_assets_table --knexfile ./knexfile.cjs



