# Chat Interface with Database 

## Table of Contents
1. [Introduction](#introduction)
2. [Project Overview](#project-overview)
3. [Technologies Used](#technologies-used)
4. [System Architecture](#system-architecture)
5. [Features](#features)
6. [Installation](#installation)
7. [Usage](#usage)
8. [Endpoints](#endpoints)
9. [Model Training with Gemini-pro](#model-training-with-gemini-pro)
10. [Performance Evaluation](#performance-evaluation)
11. [Future Enhancements](#future-enhancements)

---

## Introduction
Welcome to the "Chat with Vidf" project.

## Project Overview
The aim of this project is to develop a chat application where users can:
- Authenticate using Auth0.
- Chat with a bot to interact with databases.
- Manage their user profiles.
- Connect to either MySQL or MongoDB databases.
- Execute queries and get responses.
- Train a custom machine learning model using Gemini-pro based on user-selected tables.

## Technologies Used
- **Frontend**: React, Material-UI, React Router, React Context
- **Backend**: Flask, REST APIs
- **Authentication**: Auth0
- **Database**:  MongoDB
- **Machine Learning**: Gemini-1.5-flash

## System Architecture
The system architecture comprises:
- **Frontend**: Built using React and Material-UI.
- **Backend**: A Flask server for handling API requests and responses.
- **Databases**: MongoDB for storing the chats and the character information.
- **Authentication**: Managed by Auth0.
- **Machine Learning**: Gemini-1.5-flash for training models and generating responses.

## Features
- **Landing Page**: Displays a welcoming message and an option to sign in.
- **Authentication**: Uses Auth0 for user login.
- **Chat Interface**: Allows users to chat and interact with the application.
- **User Profile Management**: Users can view and edit their profile information.
- **Model Training**: Trains a custom machine learning model using Gemini-1.5-flash.

## Installation
1. **Clone the repository:**
    ```sh
    git clone https://github.com/hetchaudhari123/chat-with-vidf-full-stack.git
    ```


2. **Install dependencies:**
    ```sh
    # For the frontend
    cd client
    npm install

    # For the backend
    cd ../server
    pip install -r requirements.txt
    ```

3. **Set up environment variables:**
    - Create a `.env` file in the `backend` directory and add your environment variables for Auth0, database connections, etc.

4. **Run the application:**
    ```sh
    # Start the frontend
    cd client
    npm run dev

    # Start the backend
    cd ../server
    python app.py
    ```

## Usage
1. **Landing Page**: Navigate to the landing page and click on "Sign In".
2. **Authentication**: Log in using Auth0.
3. **Chat Interface**: Interact with the chat interface to send queries.
4. **Profile Management**: Click on the profile button to view and edit profile information.
5. **Pdf/Video Add**: Add Pdf/Video.
6. **Query Execution**: Execute queries and receive responses.
7. **Model Training**: Train the machine learning model with Gemini-pro.

## Endpoints

