#!/bin/bash

# Replace with your domain and email
domain="*.yourdomain.com"
email="your-email@example.com"

# Run Certbot in manual mode with DNS-01 challenge
certbot_command="sudo certbot certonly --manual --preferred-challenges=dns -d $domain --register-unsafely-without-email --agree-tos"

# Execute Certbot command and wait for user to create DNS TXT record
echo "Please create the required DNS TXT record as instructed by Certbot, then press Enter to continue..."
read -p ""

# Execute Certbot command
$certbot_command
