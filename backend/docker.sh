#!/bin/bash

docker stop dailymart-db || true
docker rm dailymart-db || true

docker volume create postgres_data || true



# create network
docker network create --driver bridge dailymart-net || true

docker run -d --name dailymart-db --restart unless-stopped -e POSTGRES_DB=ecommerce_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD="Postgres@2026" -p 5432:5432 -v postgres_data:/var/lib/postgresql/data --network dailymart-net postgres:16-alpine


