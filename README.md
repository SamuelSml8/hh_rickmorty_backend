<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Rick & Morty API - Housy Host Test

## Description

This project is part of a technical test for **Housy Host**, featuring a backend application built with **NestJS** and **PostgreSQL**. The API provides functionalities for managing characters from the **Rick & Morty** series, including features such as listing, filtering, and updating characters through a cron job that runs every 30 minutes.

## Technologies Used

- **NestJS**: Backend framework
- **TypeORM**: ORM for database interactions
- **PostgreSQL**: Relational database for storing characters
- **Axios**: HTTP client for making requests to the Rick & Morty API
- **Cron**: For scheduling regular database updates

## Getting Started

Follow these steps to set up and run the project locally:

### 1. Clone the Repository

You can clone the repository using either HTTPS or SSH:

#### HTTP option

```bash
$ git clone https://github.com/SamuelSml8/hh_rickmorty_backend.git
```

#### SSH option

```bash
$ git clone git@github.com:SamuelSml8/hh_rickmorty_backend.git
```

### 2. Install Dependencies

Navigate to the project directory and install the necessary dependencies:

```bash
$ cd hh_rickmorty_backend
$ npm install
```

### 3. Configure Environment Variables

Create a .env file in the root directory of the project by copying the contents from .env.example. Update the values with your local or remote database connection details and JWT settings:

```bash
# APPLICATION PORT
PORT=3000 # Port where the application will run

# DATABASE CONFIGURATION
DB_HOST=localhost # Database host
DB_PORT=5432 # Database port
DB_USER= # PostgreSQL username
DB_PASSWORD= # PostgreSQL password
DB_NAME= # Name of the database to use
```

### 4. Running the app

Run the application using the following command:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

- The application will start and be accessible at http://localhost:3001.
- The Swagger documentation will start and be accessible at [http://localhost:3001/api-doc](http://localhost:3001/api-doc).

### 5. Running Cron Job

The cron job to refresh the character database runs every 30 minutes automatically. You can also trigger the refresh manually using the provided API endpoint.

## API Endpoints

The API provides the following key endpoints for character management:

### **Characters**

- **`POST /characters/import`**: Brings 200 characters and saves them in the local database.
- **`GET /characters/:name`**: Filters characters by name with pagination.
- **`POST /characters/refresh`**: Manually triggers a refresh of the character data from the Rick & Morty API.

### Links

- [Swagger Documentation](http://localhost:3000/api-doc)
- [Postman Collection]()

## Database Updates via Cron Job

The application includes a cron job that automatically updates the character data every 30 minutes by fetching the latest characters from the Rick & Morty API. This ensures the database remains synchronized with the external API.

## Stay in touch

- Author - [Samuel Vera Miranda](www.linkedin.com/in/samuelsml)

## License

Nest is [MIT licensed](LICENSE).
