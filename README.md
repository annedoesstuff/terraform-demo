# terraform-demo
A simple project showcasing the power of Infrastructure as Code (IaC) using Terraform to provision, configure and manage a containerized 3-tier application locally with Docker.

---
## Table of Contents
- [Requirements](#requirements)
- [Installation and Usage](#installation-and-usage)
- [Tests](#tests)
- [File Structure](#file-structure)
- [Detailed Breakdown](#detailed-breakdown)
---

## Requirements
- [Terraform](https://developer.hashicorp.com/terraform/downloads)
- [Docker](https://docs.docker.com/get-docker/)
- [Node.js and npm](https://nodejs.org/)


## Installation and Usage
### 1. Clone the Repo
```bash
git clone https://github.com/annedoesstuff/terraform-demo.git
cd terraform-demo
```
### 2. Install backend dependencies (one-time)
```bash
cd backend
npm install
cd ..
```


### 3. Initialize Terraform 
This command loads necessary providers (docker and random):
```bash
terraform init
```

### 4. Check execution plan optional
Take a look at what Terraform will do (create/change/delete) before it actually does anything:
```bash
terraform plan
```
You will see that 5 resources are created: the password, the Docker image and the three containers.

### 5. Apply Infrastructure
This command executes the plan. It will build the Docker image and start all containers in the correct order:
```bash
terraform apply
```

### 6. Verify Success
- Browser: Open [http://localhost:8080](https://www.google.com/search?q=http://localhost:8080&authuser=3). The page should load and the status should change to `DB Connection: ✅ Connected!`
- Terminal: Check running containers `docker ps`. You should see the three containers `app-frontend`, `backend-api` and `app-database`:
  
  ![Screenshot 2025-06-27 213250](https://github.com/user-attachments/assets/dd682d08-0ed0-410f-9e0e-d81f521cc009)


### 6. Clean Up
This command destroys all resources created by Terraform:
```bash
terraform destroy
```

## Tests
The project has Unit-Tests for the backend app. The tests use Jest and Supertest to check API endpoints via mocking.

### 1. Go to backend
    ```bash
    cd backend
    ```
### 2. Execute tests
    ```bash
    npm test
    ```
### 3. Expected output
A successful run shows that API endpoints respond correctly to database connection success and error cases. Output should look like this:

   ![Screenshot 2025-06-27 211029](https://github.com/user-attachments/assets/3e9b9dc4-a98d-41ca-8805-2c0f1930661b)


## File structure
```
.
├── backend-app/          # Source code & Dockerfile for Node.js API
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── app.js
│   ├── app.test.js
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
├── nginx-config/         # Config and HTML for Nginx Frontend
│   ├── default.conf
│   └── index.html
├── main.tf               # main Terraform file, defines all resources
├── variables.tf          # Input variables for Terraform
├── outputs.tf            # Outputs after the `apply`
└── README.md            
```

## Detailed Breakdown
This demo shows the intelligent linking of the components by Terraform:
- **Random password:** random_password provider generates a new password for the DB with every apply.
- **Automatic networking:** Terraform creates an isolated Docker network. Containers can find each other via their names (e.g. backend-api).
- **Dynamic configuration:** Terraform injects the connection data (the host name of DB container and generated password) as environment variables (DB_HOST, DB_PASSWORD) into backend container. Node.js application reads these variables at startup to connect to database.
- **Custom image build:** Terraform automatically builds the Docker image for backend API from the Dockerfile in the backend-app directory.

