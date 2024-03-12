#!/bin/bash

# Check if domain and email are provided
if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <domain> <email>"
    exit 1
fi

# Assign command-line arguments to variables
domain="$1"
email="$2"
times="$3"

# Run Certbot in manual mode with DNS-01 challenge
certbot_command="sudo certbot certonly --manual --preferred-challenges=dns -d $domain -m $email --agree-tos --test-cert"

# Prepare to echo a newline the number of times minus one (as the last action is to kill the process)
{
    for ((i=1; i<$times; i++)); do
        echo
        sleep 1 # Adjust sleep as necessary for your command to process each input
    done
    # After the loop, you might want to add a delay before killing the process to ensure all inputs are processed
    sleep 2
} | $certbot_command &

pid=$!

# Sleep for a bit to ensure all inputs are processed (adjust the sleep time as needed)
sleep 10

# Press Ctrl+C to simulate user interruption
kill -INT "$pid"
