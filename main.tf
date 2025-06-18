terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }
}


resource "random_password" "db_password" {
  length  = 16
  special = true
}

# network for app communication
resource "docker_network" "app_network" {
  name = "app-network"
}

# build docker image for backend
resource "docker_image" "backend_image" {
  name = "demo-backend-api:latest"
  build {
    context = "./backend" # path dockerfile
  }
}

# db container --------------------------------------------------
resource "docker_container" "database" {
  name  = "app-database"
  image = "postgres:13"
  networks_advanced {
    name = docker_network.app_network.name 
  }
  env = [
    "POSTGRES_PASSWORD=${random_password.db_password.result}" # env-variables
  ]
}

# backend container ----------------------------------------------
resource "docker_container" "backend" {
  name  = "backend-api" # hostname network 
  image = docker_image.backend_image.name
  networks_advanced {
    name = docker_network.app_network.name
  }
  env = [
    "DB_HOST=${docker_container.database.name}",  # env-variables
    "DB_PASSWORD=${random_password.db_password.result}" # env-variables
  ]
  depends_on = [docker_container.database]
}

# frontend container ---------------------------------------------
resource "docker_container" "frontend" {
  name  = "app-frontend"
  image = "nginx:latest"
  ports {
    internal = 80
    external = var.external_frontend_port
  }
  networks_advanced {
    name = docker_network.app_network.name
  }

  # mount nginx-config & html in container
  volumes {
    host_path      = abspath("./nginx-config/default.conf")
    container_path = "/etc/nginx/conf.d/default.conf"
    read_only      = true
  }
  volumes {
    host_path      = abspath("./nginx-config/index.html")
    container_path = "/usr/share/nginx/html/index.html"
    read_only      = true
  }
  depends_on = [docker_container.backend]
}