#!/bin/bash

# Directories specification
source_directory="/etc/letsencrypt/live"
temp_directory="/tempCertLocation"
destination_directory="$HOME/fuseDir/core/live"
destination_archive="$HOME/fuseDir/core/archive"

# Check for the domain argument
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <domain>"
    exit 1
fi

domain="$1"

# Cleanup function to maintain only the last 3 versions in the archive
cleanup_directory() {
    local target_directory="$1"
    # List directories, sort by name (assuming timestamp naming), keep last 3
    local directories=( $(ls -1 "$target_directory" | sort -r) )
    local count=${#directories[@]}

    # Delete all but the newest 3 directories
    if [ "$count" -gt 3 ]; then
        for (( i=3; i<$count; i++ )); do
            echo "Deleting older directory: ${directories[$i]}"
            rm -rf "$target_directory/${directories[$i]}"
        done
    fi
}

# Prepare the temp directory by ensuring it's clean
rm -rf $temp_directory/$domain

# Continue if the source directory exists
if [ -d "$source_directory/$domain" ]; then
    # First, copy the certificates to a temporary location
    cp -L -r "$source_directory/$domain" "$temp_directory"

    # Ensure the archive directory for the domain exists
    mkdir -p "$destination_archive/$domain"
    
    # Generate a unique timestamp for the current version
    current_timestamp=$(date +%Y%m%d%H%M%S)

    # Move the certificates from the temp location to the archive with a timestamp
    cp -r "$temp_directory/$domain" "$destination_archive/$domain/$current_timestamp"
    echo "Certificates copied to archive with timestamp $current_timestamp"

    # Clean up the archive to keep only the last 3 versions
    cleanup_directory "$destination_archive/$domain"
    
    # Finally, move the certificates from the temp location to the live directory
    cp -r "$temp_directory/$domain" "$destination_directory"
    echo "Certificates copied to live directory!"

    # Optionally, clean up the temp directory after operations
    rm -rf $temp_directory/$domain
else
    echo "Source directory does not exist."
    exit 1
fi
