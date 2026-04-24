# Microservices Todo App

This is a simple microservices project with a React frontend and two Java Spring Boot backend services for managing users and todos.

## Architecture

- **Frontend**: React app running on port 3000
- **User Service**: Java Spring Boot service on port 8081
- **Todo Service**: Java Spring Boot service on port 8082
- **Database**: PostgreSQL database

## Local Development with Docker Compose

1. Ensure Docker and Docker Compose are installed.

2. Build and run the services:
   ```
   docker-compose up --build
   ```

3. Access the app at http://localhost:3000

## Building Docker Images

From the root directory:

```
docker build -t frontend ./frontend
docker build -t user-service ./backend/user-service
docker build -t todo-service ./backend/todo-service
```

## Deploying to Kubernetes (EKS)

1. Ensure you have a Kubernetes cluster (EKS) set up.

2. Apply the manifests:
   ```
   kubectl apply -f k8s/
   ```

3. Get the frontend service URL:
   ```
   kubectl get svc frontend
   ```

## Database Requirements

- **Database**: PostgreSQL 15
- **Database Name**: appdb
- **Username**: user
- **Password**: password
- **Tables**: 
  - users (id, username, email)
  - todos (id, title, completed)

The services use JPA with Hibernate for ORM, and DDL auto-update is enabled for development.

## API Endpoints

### User Service (8081)
- GET /users - Get all users
- POST /users - Create a user

### Todo Service (8082)
- GET /todos - Get all todos
- POST /todos - Create a todo
- PUT /todos/{id} - Update a todo

## Additional Requirements

- **Java**: JDK 17
- **Node.js**: 18+ for frontend
- **Maven**: For building Java services
- **Docker**: For containerization
- **Kubernetes**: For orchestration on EKS

For production, consider:
- Using a managed PostgreSQL service (RDS on AWS)
- Implementing authentication/authorization
- Adding API gateway (e.g., Kong, Istio)
- Setting up monitoring and logging
- Configuring CI/CD pipelines