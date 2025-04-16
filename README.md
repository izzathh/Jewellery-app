# Jewellery App

A full-stack application for managing jewellery inventory and user interactions. This project contains a **client** built with ReactJS and a **server** built with NodeJS. The server connects to required databases (e.g., MySQL and MongoDB) to manage data persistence.

## Table of Contents

- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Server Setup](#server-setup)
  - [Client Setup](#client-setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Details](#project-details)

## Project Overview

This project is a jewellery management application, featuring a modern ReactJS client and a robust NodeJS server. The server is configured to communicate with MongoDB to store and retrieve jewellery details, user data, and other related entities.


## Prerequisites

Before installing and running the project, make sure that you have the following installed on your system:

- [NodeJS](https://nodejs.org) (v14 or later recommended)
- [npm](https://www.npmjs.com/) (comes with NodeJS)
- [MongoDB](https://www.mongodb.com/)

*Optional:* A code editor such as Visual Studio Code.

## Installation

Follow the steps below to setup the project on your local machine.

### Server Setup

1. **Navigate to the server folder:**

    ```bash
    cd jewellery-app/server
    ```

2. **Install server dependencies:**

    ```bash
    npm install
    ```

     ```bash
    npm install -g nodemon
    ```

3. **Configure Environment Variables:**

    Create a `.env.development` file in the server folder with the following (adjust to your database configuration):

    ```env
    MONGODB_URI=mongodb+srv://adobeizzath:ChPd8zXxt2NYyh0l@jewelry.1klxwjt.mongodb.net/jewelleryapp?retryWrites=true&w=majority&appName=jewelry
    JWT_SECRET=0ccc3020b7bcdd15910ec86c591bbded6f27b4d7b0759e942b8f020d0ab8f7952e04234f0d297ec56933d11a5cd9f133361f60b2daf50819334b221a752a620c
    JWT_EXPIRES_IN=90d
    CORS_ORIGIN=http://localhost:5173
    PORT=5000
    NODE_ENV=development
    # Any additional environment variables
    ```

4. **Database Setup:**
    
    - **MongoDB:**  
      Ensure MongoDB is installed and running. Update the `MONGO_URI` accordingly in your `.env.development` file.

5. **Run the Server:**

    You can start the server using:
    
    ```bash
    nodemon app.js
    ```
    
### Client Setup

1. **Navigate to the client folder:**

    ```bash
    cd jewellery-app/client
    ```

2. **Install client dependencies:**

    ```bash
    npm install
    ```

3. **Configure Client Settings (if needed):**

    If your client needs to connect to a specific server URL or API endpoint, update the configuration files (e.g., `.env`) to point to your running server with VITE_API_URL=http://localhost:5000/api/v1.

4. **Run the Client:**

    Start the React development server:

    ```bash
    npm start
    ```

    By default, the client should be accessible at `http://localhost:5173`.

## Environment Variables

Both server and client may require environment variables. Ensure you provide correct values for:

- **Server:** `.env.development` file in the server folder (as shown above).
- **Client:** If required, create a `.env` file in the client folder. For example:

    ```env
    VITE_API_URL=http://localhost:5000/api/v1
    ```

## Running the Application

Once both the server and client are set up:

1. **Start the Server:**  
   In one terminal session:
   
   ```bash
   cd jewellery-app/server
   nodemon app.js