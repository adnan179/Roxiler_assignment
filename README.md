# Transaction Dashbaord

## Description

This project is a web application for visualizing transaction data using interactive charts and tables. It includes frontend components built with React and backend APIs developed with Node.js and Express. The application fetches transaction data from a database, displays it in a table, and visualizes statistics using bar charts and pie charts.

## Features

- View transaction data in a paginated table format.
- Filter transactions by month and search by keyword.
- Visualize transaction statistics with dynamic bar charts and pie charts.
- Responsive design for optimal viewing across devices.

## Technologies Used

### Frontend

- React
- React Router
- Chart.js (for rendering bar charts)
- Material-UI (for UI components and styling)
- Axios (for API requests)

### Backend

- Node.js
- Express.js
- MongoDB 
- Mongoose (for MongoDB object modeling)
- Cors (for handling Cross-Origin Resource Sharing)

## Getting Started

### Prerequisites

- Node.js (version >= 12.0.0)
- npm (or yarn)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/project-name.git
   cd project-name
2. **Install front end dependencies:**
   ```bash
   cd frontend
   npm install
3. **Install back end dependencies:**
   ```bash
   cd backend
   npm install
4. **Replace the URL to connect to your mongoDB Atlas in the backend/server file**
5. **Open up two terminals separately:**
   ```bash
   cd frontend
   npm start
   cd backend
   nodemon server
