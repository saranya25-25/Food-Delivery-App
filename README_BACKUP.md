# Food Delivery Application
A full-stack food delivery application built using React, Spring Boot, MongoDB, AWS S3, JWT authentication, Razorpay payments, and an AI-powered food assistant.
<img width="1864" height="843" alt="Screenshot 2026-09-01 202519" src="https://github.com/user-attachments/assets/43eaebed-1dd5-4052-beb8-78182639a299" />

## Overview
This application provides a complete food ordering workflow for customers and an administration panel for managing food items and customer orders.
The system includes secure authentication, food browsing, cart management, online payments, order tracking, customer feedback, an AI food assistant, and real-time order monitoring in the admin panel.

## Tech Stack
### Frontend
* React
* Vite
* JavaScript
* Bootstrap
* CSS
* Axios
* React Router
### Backend
* Java
* Spring Boot
* Spring MVC
* Spring Data MongoDB
* Spring Security
* JWT
* REST APIs
* Maven
### Database and Storage
* MongoDB Atlas
* AWS S3
### Payment
* Razorpay
### AI
* AI-powered ChefBot using an external AI API
* Food ordering assistance
* Item preparation assistance
### Deployment
* Docker
* Render
* Netlify
* GitHub
  
## Customer Features

### Authentication
* User registration
* User login
* JWT-based authentication
* Secure API access
### Food Browsing
* Browse available food items
* Explore food categories
* View food details
* Search and discover food items
* Food images stored using AWS S3
### Cart
<img width="1889" height="898" alt="Screenshot 2026-09-01 203616" src="https://github.com/user-attachments/assets/71e49858-abdd-48ac-883a-4ace1d5d83c4" />

* Add food items to cart
* Update quantities
* Remove items
* View cart total
* Continue to checkout
### Online Payment
<img width="1354" height="788" alt="Screenshot 2026-09-01 203718" src="https://github.com/user-attachments/assets/81c2e82b-cc6e-446c-b60f-e6134c5288df" />

* Razorpay integration
* Secure payment workflow
* Payment verification through backend APIs
* Order payment status tracking
### Orders
<img width="1880" height="870" alt="Screenshot 2026-09-01 203940" src="https://github.com/user-attachments/assets/6e708691-fdf6-4047-9d32-e25fc18886eb" />

* Place food orders
* Store customer address and phone number
* View order details
* Track order status
* Payment status tracking
### Feedback
<img width="1904" height="901" alt="Screenshot 2026-09-01 202635" src="https://github.com/user-attachments/assets/b71c407a-0903-41ae-9b6e-0e6205bf0cfe" />

* Submit food feedback
* Update feedback
* View feedback
* Delete feedback
## AI ChefBot
The application includes an AI-powered ChefBot integrated through an AI API.
<img width="572" height="814" alt="Screenshot 2026-09-01 202611" src="https://github.com/user-attachments/assets/68f13109-e86d-4ab2-920b-e01dd07fc79a" />

ChefBot provides two main functions:
### Order Food
<img width="1861" height="895" alt="Screenshot 2026-09-01 202749" src="https://github.com/user-attachments/assets/45ec5e41-693c-4af7-bb63-6d2c0169ea6b" />
Users can interact with ChefBot to select food based on available categories and items.
The ordering flow is:
User opens ChefBot → Selects Order Food → Selects category → Selects food item → Item is added to cart → User continues to checkout.
When a food item is selected through the assistant, the application can directly continue the ordering workflow toward checkout
### Item Preparation
Users can select Item Preparation to receive preparation-related information and guidance for the selected food item.
The AI assistant communicates with the backend, processes the user's request, and provides the appropriate response.

## Admin Panel
  <img width="1889" height="899" alt="Screenshot 2026-09-01 202417" src="https://github.com/user-attachments/assets/f8384c7a-1d18-499d-827d-c4e1abe220f5" />
  <img width="1915" height="897" alt="Screenshot 2026-09-01 202427" src="https://github.com/user-attachments/assets/59594233-5e5f-43d8-8857-fd9855760802" />
<img width="1903" height="798" alt="Screenshot 2026-09-01 202503" src="https://github.com/user-attachments/assets/1c1e75a5-82f6-46fe-a4c1-d43c77aaa1d1" />
The application includes a dedicated React-based administration panel.
### Food Management
* Add new food items
* Upload food images
* View food list
* Manage available food items
### Order Management
* View all customer orders
* View ordered food items
* View customer address and phone number
* View order amount
* View payment status
* Update order status
Order statuses include:
* Confirmed
* Preparing
* Out for Delivery
* Delivered
### Live Order Monitoring
The admin panel periodically checks for newly paid orders.
When a new paid order is detected:
* Admin receives a visual notification
* Notification sound is played
* Browser notification can be displayed
* Order list is updated
Pending Razorpay orders do not trigger the new-order notification. The notification is triggered after successful payment verification.

## Backend Architecture
The Spring Boot backend exposes REST APIs for:
* Authentication
* Food management
* Cart management
* Order management
* Payment processing
* Payment verification
* Feedback
* AI ChefBot integration
The backend handles authentication, business logic, database operations, payment verification, and communication between the frontend and external services.

## Security
* JWT-based authentication
* Spring Security
* Password encryption
* Protected APIs
* Environment variables for sensitive configuration
* API keys and database credentials excluded from source control

## Data Flow
Customer → React Frontend → Spring Boot REST API → Spring Services → MongoDB
For food images:
React Frontend → Spring Boot → AWS S3
For payments:
React Frontend → Razorpay → Spring Boot Payment Verification → MongoDB
For AI:
React Frontend → Spring Boot AI Endpoint → AI API → Response → React Frontend
For administration:
Admin Panel → Spring Boot Order APIs → MongoDB → Order Management

## Deployment
The application is structured for deployment using:
* Netlify for the frontend
* Render for the Spring Boot backend
* Docker for backend containerization
* MongoDB Atlas for database hosting
* AWS S3 for food image storage

## Project Structure

```
Food-Delivery-App/
├── admin-panel/
├── foodies/
├── src/
├── postman/
├── food images/
├── Dockerfile
├── pom.xml
├── package.json
├── package-lock.json
├── mvnw
├── mvnw.cmd
└── .gitignore
```

## Key Highlights
* Full-stack food delivery platform
* React customer application
* Dedicated React admin panel
* Spring Boot REST backend
* MongoDB Atlas database
* AWS S3 image storage
* JWT authentication
* Razorpay online payments
* AI-powered ChefBot
* Food ordering through AI assistant
* Item preparation assistance
* Order tracking and status management
* Live paid-order monitoring
* Dockerized backend
* Cloud deployment using Render and Netlify
  
## Live Demo
Frontend: https://darling-hummingbird-2ed960.netlify.app/

Backend: https://food-delivery-project-2y1g.onrender.com

Admin Panel: Available through the deployed project administration interface.

## Author
Nekkanti Saranya,
B.Tech Computer Science and Engineering,
Sir C R Reddy College of Engineering.
