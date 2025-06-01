# JSONPlaceholder Clone API

A complete backend API that replicates the behavior and structure of [JSONPlaceholder](https://jsonplaceholder.typicode.com), with extended support for full REST operations, JWT-based authentication, structured user data storage, and containerized deployment.

## Features

- **Full CRUD operations** for users based on the JSONPlaceholder model
- **JWT Authentication** for protected endpoints
- **PostgreSQL Database** with proper schema and relations
- **Docker and Docker Compose** for easy deployment
- **Comprehensive test suite**
- **Data seeding** with initial sample data

## Tech Stack

- **Backend**: NestJS (TypeScript)
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Containerization**: Docker & Docker Compose
- **Testing**: Jest

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development without Docker)

### Running with Docker

1. Clone the repository
2. Start the application with Docker Compose:

```bash
docker-compose up
```

The API will be available at http://localhost:3000

### Local Development

1. Clone the repository
2. Install dependencies:

```bash
cd server
npm install
```

3. Create a `.env` file in the server directory with the following content:

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=jsonplaceholder
JWT_SECRET=your_jwt_secret_key_here
PORT=3000
```

4. Start the PostgreSQL database:

```bash
docker-compose up postgres
```

5. Run the application:

```bash
npm run start:dev
```

## API Endpoints

### Users

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create a new user (protected)
- `PATCH /users/:id` - Update a user (protected)
- `DELETE /users/:id` - Delete a user (protected)

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token

## Authentication

Protected endpoints require a valid JWT token. To obtain a token:

1. Register a user with `POST /auth/register`
2. Login with `POST /auth/login` to get a token
3. Use the token in the Authorization header: `Bearer YOUR_TOKEN`

## Data Models

The API follows the JSONPlaceholder data structure:

```typescript
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    }
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  }
}
```

## Testing

Run the test suite:

```bash
cd server
npm test
```

## Project Structure

```
server/
├── src/
│   ├── auth/              # Authentication module
│   ├── config/            # Configuration module
│   ├── database/          # Database connection module
│   ├── seed/              # Data seeding module
│   ├── users/             # Users module
│   ├── app.controller.ts  # Main app controller
│   ├── app.module.ts      # Main app module
│   ├── app.service.ts     # Main app service
│   └── main.ts            # Application entry point
├── test/                  # End-to-end tests
├── Dockerfile             # Docker configuration
└── package.json           # Dependencies and scripts
```

## License

This project is licensed under the MIT License. 