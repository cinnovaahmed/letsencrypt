#!/bin/bash

# Replace with your domain and email
domain="*.yourdomain.com"
email="your-email@example.com"

# Run Certbot in manual mode with DNS-01 challenge
certbot_command="sudo certbot certonly --manual --preferred-challenges=dns -d $domain --register-unsafely-without-email --agree-tos"

# Execute Certbot command
$certbot_command &

# Sleep for 2 seconds
sleep 2

# Press Enter
echo -e "\n" | sudo tee -a /dev/tty
