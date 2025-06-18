output "frontend_url" {
  description = "URL to access the web frontend."
  value       = "http://localhost:${var.external_frontend_port}"
}

output "generated_db_password" {
  description = "Randomly generated password for database."
  value       = random_password.db_password.result
  sensitive   = true # password hidden
}