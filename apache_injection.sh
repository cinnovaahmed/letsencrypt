#!/bin/bash

# Get the hostname
hostname=$(hostname)

# Make CURL request to middleware
make_curl_request() {
    local url="$1"
    local hostname="$2"
    local request_type="$3"

    # Make the cURL request
    curl -s -X POST \
        -H "Content-Type: application/json" \
        -H "x-functions-key: TG0eZ4ZnALBvcff1ySfTFZPGp0IQG05umlC51quuETEGAzFuWa5PlA==" \
        -H "Authorization: Basic YXBpX3VlLWxhYjpQZWNnb2otanlzcmU5LWR5anF5bQ==" \
        -d '{
                "portalRootSubstring": "'"$hostname"'",
                "reqType": "'"$request_type"'"
        }' \
        "$url"
}

# URL
url="https://middlewarenode01z-az-usc01-01.azurewebsites.net/api/create-certs"

# Check hostname staus
hostname_status=$(make_curl_request "$url" "$hostname" "pendingCerts")

# Terminate script if no json is found
if [[ -z $hostname_status || $hostname_status == "null" ]]; then
    echo "No JSON data found or JSON data is null. Exiting."
    exit 1
fi

# Define paths
cert_file="$HOME/fuseDir/live/$hostname/fullchain.pem"
cert_privkey="$HOME/fuseDir/live/$hostname/privkey.pem"
custom_conf="/etc/apache2/conf.d/custom.conf"
unique_path="/etc/apache2/sites-enabled/conf.d/${hostname}.conf"

# Define configuration content
config_content="
<VirtualHost *:443>
    SSLEngine on
    ServerName ${hostname}:443
    ServerAlias *.${hostname}
    DocumentRoot /var/www/html/
    SSLCertificateFile ${cert_file}
    SSLCertificateKeyFile ${cert_privkey}
</VirtualHost>"


# Step 1: Check if custom.conf exists, if not, create it
if [ ! -f "$custom_conf" ]; then
   echo "IncludeOptional sites-enabled/conf.d/*.conf" >> /etc/apache2/conf.d/custom.conf
   mkdir -p /etc/apache2/sites-enabled/conf.d > /dev/null 2>&1
   echo "Step 1 completed"
else
   echo "custom.conf exists. Moving to step 2"
fi


# Step 2: Create or update unique configuration file
if [ -f "$unique_path" ]; then
   echo "File exists, updating the structure"
   # Remove file
   rm -f $unique_path
fi

echo "$config_content" | sudo tee "$unique_path" > /dev/null

if [ $? -eq 0 ]; then
   echo "Configuration file created successfully: $unique_path"
   apache_config_curl=$(make_curl_request "$url" "$hostname" "apacheConfig")

   if service apache2 reload; then
        apaache_reload_curl=$(make_curl_request "$url" "$hostname" "apacheReload")
        echo "Apache service reloaded successfully"
   else
        echo "Failed to reload Apache service."
   fi
else
   echo "Failed to create configuration file: $unique_path"
fi