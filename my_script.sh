#!/bin/bash

# Function to extract TXT data from Certbot output
get_txt_data() {
  local certbot_output=$1
  local txt_data=$(echo "$certbot_output" | grep -oP '(?<=value is )[^,]+')
  echo "$txt_data"
}

# Default values
domain="*.example.com"
email="your-email@example.com"

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    -d|--domain)
      domain="$2"
      shift
      shift
      ;;
    -e|--email)
      email="$2"
      shift
      shift
      ;;
    *)
      echo "Unknown argument: $1"
      exit 1
      ;;
  esac
done

# Run Certbot in manual mode with DNS-01 challenge
certbot_output=$(sudo certbot certonly --manual --preferred-challenges=dns -d "$domain" --register-unsafely-without-email --agree-tos 2>&1)

# Extract TXT data
txt_data=$(get_txt_data "$certbot_output")


# Print the TXT data
echo "TXT Data: $txt_data"
