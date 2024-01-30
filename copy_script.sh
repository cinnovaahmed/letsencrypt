#!/bin/bash

# Specify the directory you want to check and move
source_directory="/etc/letsencrypt/live"

# Specify the destination where you want to move the directory
destination_directory="~/fuseDir/live"
destination_archive="~/fuseDir/archive"

# Check if domain is provided as a command-line argument
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <domain>"
    exit 1
fi

# Assign command-line arguments to variables
domain="$1"

# Clean directory
cleanup_directory() {
    local target_directory="$1"

    # Check if the target directory exists
    if [ -d "$target_directory" ]; then
        # Get the number of directories in the target directory
        num_directories=$(find "$target_directory" -maxdepth 1 -type d | wc -l)

        # Check if there are more than 3 directories
        if [ "$num_directories" -gt 3 ]; then
            # Find and delete the oldest directory
            oldest_directory=$(ls -1t "$target_directory" | tail -n 1)
            echo "Deleting the oldest directory: $oldest_directory"
            rm -r "$target_directory/$oldest_directory"
        else
            echo "No action required. There are $num_directories directories."
        fi
    else
        echo "Target directory does not exist."
    fi
}

if [ -d "$source_directory/$domain" ]; then
    # If the source directory exists, copy it to the destination archive
    if [ -d "$destination_archive/$domain" ]; then
        # If the destination archive directory exists, copy the source directory to it
        cp "$source_directory/$domain" "$destination_archive"
        echo "Directory copied successfully!"
    else
        # If the destination archive directory doesn't exist, create it and then copy the source directory
        mkdir -p "$destination_archive/$domain"
        cp "$source_directory/$domain" "$destination_archive"
        echo "Directory copied successfully!"
    fi
    cleanup_directory "$destination_archive/$domain"
else
    # If the source directory doesn't exist, display an error message
    echo "Source directory does not exist."
fi

# Copy domain certificates to azure fuseblob storage for it to be shared
cp -r "/etc/letsencrypt/live/$domain" "$destination_directory"
