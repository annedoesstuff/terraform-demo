# terraform-demo
A simple project showcasing the power of Infrastructure as Code (IaC) using Terraform to provision, configure and manage a containerized 3-tier application locally with Docker.

## Table of Contents
- [Requirements](#requirements)
- [Installation and Usage](#installation-and-usage)
  - [1. Clone the Repo](#1-clone-the-repo)
  - [2. Initialize Terraform](#2-initialize-terraform)
  - [3. Check Execution Plan (Optional)](#3-check-execution-plan-optional)
  - [4. Apply Infrastructure](#4-apply-infrastructure)
  - [5. Verify Success](#5-verify-success)
  - [6. Clean Up](#6-clean-up)
- [File Structure](#file-structure)
- [Detailed Breakdown](#detailed-breakdown)
- [Author](#author)

## Requirements
- [Terraform](https://developer.hashicorp.com/terraform/downloads)
- [Docker](https://docs.docker.com/get-docker/)
- [Node.js and npm](https://nodejs.org/)

--- 
## Installation and Usage
### 1. Clone the Repo
```bash
git clone <URL-des-Projekts>
cd <projekt-verzeichnis>
```

### 2. initialize Terraform 
This command loads necessary providers (docker and random).
```bash
terraform init
```

### 3. Check execution plan optional
Take a look at what Terraform will do (create/change/delete) before it actually does anything.
```bash
terraform plan
```
You will see that 5 resources are created: the password, the Docker image and the three containers.

### 4. Apply Infrastructure
This command executes the plan. It will build the Docker image and start all containers in the correct order.
```bash
terraform apply
```

### 5. Verify Success
- Browser: Open [http://localhost:8080](https://www.google.com/search?q=http://localhost:8080&authuser=3). The page should load and after a short moment the status should change to `DB Connection: ✅ Connected!`.
- Terminal: Check running containers `docker ps`. You should see the three containers `app-frontend`, `backend-api` and `app-database`.

### 6. Clean Up
This command destroys all resources created by Terraform (containers, network).
```bash
terraform destroy
```
---

## File structure
```
.
├── backend-app/          # Source code & Dockerfile for Node.js API
│   ├── Dockerfile
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
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

## Author
[annedoesstuff](https://github.com/annedoesstuff) 
:)
