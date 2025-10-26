#!/bin/bash
set -e  

echo "Starting full project setup..."

echo "Installing root dependencies..."
npm install

echo "Installing server dependencies..."
cd server
npm install

if [ ! -f "../.env" ]; then
  echo ".env file not found in project root. Please create it first."
  exit 1
fi

echo "Creating database..."
node scripts/createDatabase.js

echo "Creating tables..."
node scripts/schema.js

echo "Seeding database..."
node scripts/seed.js

echo "Installing client dependencies..."
cd ../client
npm install

echo "Setup complete!"
echo "To start the app:"
echo "Run 'npm run dev' from project root (this will setup DB & start server)"