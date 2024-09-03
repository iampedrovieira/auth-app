# Use the official Node.js image as the base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install TypeScript globally
RUN npm install -g typescript

# Install additional tools (optional)
RUN apt-get update && apt-get install -y vim

# Expose the application port (if applicable)
EXPOSE 3000

# Default command to keep the container running
CMD ["bash"]