#!/bin/bash

# Create .env file if it doesn't exist
if [ ! -f ./server/.env ]; then
  echo "Creating .env file..."
  cat > ./server/.env << EOL
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=jsonplaceholder
JWT_SECRET=your_jwt_secret_key_here
PORT=3000
EOL
  echo ".env file created successfully"
else
  echo ".env file already exists"
fi

# Start the application with Docker Compose
echo "Starting the application..."
docker-compose up -d

echo "Application is running at http://localhost:3000"
echo "Default admin credentials:"
echo "Email: admin@example.com"
echo "Password: password123" 