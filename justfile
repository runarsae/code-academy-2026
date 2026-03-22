# Idempotweet development commands
# Usage: just <command>
# Install just: brew install just (macOS) / https://just.systems
# Kom i gang: just setup && just install && just dev

set dotenv-load

app_dir := "1-DevOps/idempotweet"
compose := env("COMPOSE", "docker compose")
db_url := env("DATABASE_URL", "postgresql://codeacademy:codeacademy@localhost:5432/codeacademy")

# List available commands
default:
    @just --list

# Set up project: create .env, configure GitHub repo, install dependencies
setup:
    #!/usr/bin/env bash
    set -euo pipefail
    if [ ! -f .env ]; then
        cp .env.example .env
        echo "Opprettet .env fra .env.example"
    else
        echo ".env finnes allerede."
    fi
    # Spør om GitHub-repo hvis det ikke er satt
    current=$(grep '^GITHUB_REPOSITORY=' .env | cut -d= -f2)
    if [ -z "$current" ]; then
        read -rp "Hva er ditt GitHub-repo? (f.eks. mittbrukernavn/CodeAcademy2026): " repo
        sed -i'' -e "s|^GITHUB_REPOSITORY=.*|GITHUB_REPOSITORY=$repo|" .env
        echo "GITHUB_REPOSITORY satt til $repo"
    fi
    just install

# Switch to podman
use-podman:
    @sed -i'' -e 's|^COMPOSE=.*|COMPOSE="podman compose"|' .env
    @echo "Byttet til podman. Alle kommandoer bruker nå 'podman compose'."

# Switch to docker
use-docker:
    @sed -i'' -e 's|^COMPOSE=.*|COMPOSE="docker compose"|' .env
    @echo "Byttet til docker. Alle kommandoer bruker nå 'docker compose'."

# Start postgres and the dev server
dev: postgres
    cd {{app_dir}} && DATABASE_URL={{db_url}} NEXT_PUBLIC_ENABLE_IDEM_FORM={{env("NEXT_PUBLIC_ENABLE_IDEM_FORM", "true")}} yarn dev

# Start only postgres in the background
postgres:
    {{compose}} -f docker-compose.dev.yml up -d --wait postgres

# Install dependencies
install:
    cd {{app_dir}} && corepack enable && yarn install

# Run tests
test:
    cd {{app_dir}} && yarn test

# Run tests in watch mode
test-watch:
    cd {{app_dir}} && yarn test:watch

# Build the application
build:
    cd {{app_dir}} && yarn build

# Seed the database with demo data
seed: postgres
    cd {{app_dir}} && DATABASE_URL={{db_url}} yarn seed

# Truncate all data in the database
truncate: postgres
    {{compose}} -f docker-compose.dev.yml exec -T postgres psql -U codeacademy -c "TRUNCATE TABLE idems;"
    @echo "Databasen er tømt."

# Stop all running services
stop:
    {{compose}} -f docker-compose.dev.yml down

# Stop and remove all data
clean:
    {{compose}} -f docker-compose.dev.yml down -v
