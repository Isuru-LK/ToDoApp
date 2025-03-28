<<<<<<< HEAD
# ToDoApp
=======
# ToDoApp

A simple task management application built with React (frontend), Flask (backend), and PostgreSQL (database), containerized using Docker and Docker Compose. This project demonstrates a full-stack application with unit and integration tests.

## Features
- Add tasks with a title and description.
- View the latest 5 incomplete tasks.
- Mark tasks as completed.
- Inspirational messages rotate every 5 seconds.
- Duplicate task detection with a popup.

## Prerequisites
- [Docker](https://www.docker.com/get-started) (with Docker Compose)
- [Git](https://git-scm.com/downloads)

## How to Build and Run

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ToDoApp
```

### 2. Build the Docker images for all services
```bash
docker-compose build
```

### 3. Run the Application
```bash
docker-compose up
```

- **Frontend:** Access at [http://localhost:3000](http://localhost:3000)
- **Backend API:** Available at [http://localhost:5000/api/tasks](http://localhost:5000/api/tasks)
- Press **Ctrl+C** to stop.

### 4. (Optional) Run Tests
#### Frontend Tests
```bash
docker-compose up --build frontend-test
```
#### Backend Tests
```bash
docker-compose up --build backend-test
```

## Notes
- The database persists data in a Docker volume (`postgres_data`).
- To reset everything:
```bash
docker-compose down -v
```
- Ensure ports **3000** (frontend) and **5000** (backend) are free before running the application.

## Troubleshooting
### Common Issues & Solutions
#### Frontend not loading
```bash
docker logs todoapp-frontend-1
```

#### Backend errors
```bash
docker logs todoapp-backend-1
```

#### Database issues
```bash
docker logs todoapp-db-1
```

###### Built with ❤️ by Isuru Lakshan ######

