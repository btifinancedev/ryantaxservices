# Use the official Nginx image
FROM nginx:latest

# Copy all static files into the directory Nginx serves by default
COPY . /usr/share/nginx/html

# Expose port 80 (HTTP)
EXPOSE 80

# Start Nginx when the container boots
CMD ["nginx", "-g", "daemon off;"]
