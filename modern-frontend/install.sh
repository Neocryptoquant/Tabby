#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Install dev dependencies
echo "Installing dev dependencies..."
npm install --save-dev @testing-library/jest-dom @testing-library/react @types/jest @types/node @types/react @types/react-dom @types/react-router-dom typescript

# Install additional dependencies
echo "Installing additional dependencies..."
npm install @mui/x-date-pickers formik yup

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    echo "REACT_APP_API_URL=http://localhost:8000" > .env
    echo "REACT_APP_API_KEY=your_api_key_here" >> .env
    echo "REACT_APP_API_SECRET=your_api_secret_here" >> .env
fi

# Start the development server
echo "Starting development server..."
npm start
