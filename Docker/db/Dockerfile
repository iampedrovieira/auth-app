# Use the official PostgreSQL image as the base image
FROM postgres:latest

# Copy initialization scripts to the Docker entrypoint directory
COPY ./Docker/db/init.sql /docker-entrypoint-initdb.d/