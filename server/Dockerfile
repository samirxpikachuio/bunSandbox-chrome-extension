# Use the official Bun image
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Install any server-side dependencies (if any)
RUN bun install

# Copy the server source code
COPY . .

# Expose the port your server runs on
EXPOSE 3006

# Start the server
CMD ["bun", "run", "server.ts"]
