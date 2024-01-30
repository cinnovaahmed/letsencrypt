#!/bin/bash

# Check if domain and email are provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <domain> <email>"
    exit 1
fi

# Assign command-line arguments to variables
domain="$1"
email="$2"

# Run Certbot in manual mode with DNS-01 challenge
certbot_command="sudo certbot certonly --manual --preferred-challenges=dns -d $domain -m $email --agree-tos --test-cert"

# Execute Certbot command in the background
$certbot_command &
pid=$!

# Sleep for 2 seconds
sleep 2

# Press Ctrl+C to simulate user interruption
kill -INT "$pid"
