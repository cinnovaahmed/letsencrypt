#!/bin/bash

# Specify the directory for Lets Encrypt
live_letsencrypt="/etc/letsencrypt/live"
archive_letsencrypt="/etc/letsencrypt/archive"
renewal_letsencrypt="/etc/letsencrypt/renewal"

# Specify the destination for FUSE 
live_fuse_directory="$HOME/fuseDir/live/core"
archive_fuse_directory="$HOME/fuseDir/archive/core"

# Check if domain is provided as a command-line argument
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <domain>"
    exit 1
fi

# Assign command-line arguments to variables
domain="$1"

# Function to check and remove directory or file if it exists
remove_path() {
    local path="$1"
    if [ -e "$path" ]; then
        rm -r "$path"
        echo "Path $path removed successfully."
    else
        echo "Path $path does not exist."
    fi
}

# Remove domain directory or file from specified paths
remove_path "$live_letsencrypt/$domain"
remove_path "$archive_letsencrypt/$domain"
remove_path "$renewal_letsencrypt/$domain.conf"
remove_path "$live_fuse_directory/$domain"
remove_path "$archive_fuse_directory/$domain"