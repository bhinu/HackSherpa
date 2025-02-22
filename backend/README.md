# Points Management API
=====================================

## Project Title
The Points Management API is a Flask-based web service designed to manage user points across different payers.

## Description
This API provides a simple and efficient way to add, spend, and check points for various payers. It supports the following operations:

* Add points for a specific payer with a timestamp
* Spend points across payers based on specific rules (oldest first, no payer balance goes negative)
* Fetch the current point balances for all payers

## Table of Contents
1. [Installation Instructions](#installation-instructions)
2. [Usage](#usage)
3. [API Endpoints](#api-endpoints)
4. [Contributing Guidelines](#contributing-guidelines)
5. [License](#license)

## Installation Instructions
To run this project, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/points-management-api.git
   ```
2. **Install Python 3.8 or above**: [Download Python](https://www.python.org/downloads/).
3. **Create a virtual environment (optional but recommended)**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # For macOS/Linux
   venv\Scripts\activate     # For Windows
   ```
4. **Install the required Python packages**:
   ```bash
   pip install flask
   ```
5. **Run the Flask server**:
   ```bash
   python app.py
   ```
6. The server will start at `http://127.0.0.1:8000`.

## Usage
To test the API, follow these steps:

1. Start the Flask server:
   ```bash
   python app.py
   ```
2. Use a tool like [Postman](https://www.postman.com/) or `curl` to send requests to the endpoints.
3. **Example Test Flow**:
   * Add Transactions:
     ```json
     { "payer": "DANNON", "points": 300, "timestamp": "2022-10-31T10:00:00Z" }
     { "payer": "UNILEVER", "points": 200, "timestamp": "2022-10-31T11:00:00Z" }
     { "payer": "DANNON", "points": -200, "timestamp": "2022-10-31T15:00:00Z" }
     { "payer": "MILLER COORS", "points": 10000, "timestamp": "2022-11-01T14:00:00Z" }
     { "payer": "DANNON", "points": 1000, "timestamp": "2022-11-02T14:00:00Z" }
     ```
   * Spend Points:
     ```json
     { "points": 5000 }
     ```
   * Check Balances:
     ```json
     {
       "DANNON": 1000,
       "UNILEVER": 0,
       "MILLER COORS": 5300
     }
     ```

## API Endpoints
The following API endpoints are available:

### Home
* **URL**: `/`
* **Method**: GET
* **Description**: Displays a welcome message and available endpoints.
* **Response**:
  ```json
  {
      "message": "Welcome to the Points API. Available endpoints:",
      "endpoints": {
          "/add": "POST - Add points",
          "/spend": "POST - Spend points",
          "/balance": "GET - Get current balances"
      }
  }
  ```

### Add Points
* **URL**: `/add`
* **Method**: POST
* **Description**: Add points for a specific payer with a timestamp.
* **Request Body**:
  ```json
  {
      "payer": "DANNON",
      "points": 1000,
      "timestamp": "2022-11-02T14:00:00Z"
  }
  ```
* **Response**:
  ```json
  {
      "message": "Transaction added successfully."
  }
  ```

### Spend Points
* **URL**: `/spend`
* **Method**: POST
* **Description**: Spend points based on rules (oldest first, no payer balance goes negative).
* **Request Body**:
  ```json
  {
      "points": 5000
  }
  ```
* **Response**:
  ```json
  [
      { "payer": "DANNON", "points": -100 },
      { "payer": "UNILEVER", "points": -200 },
      { "payer": "MILL