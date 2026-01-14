#!/usr/bin/env sh

# Exit if any step fails
set -e

ASSETS_DIRECTORY=/usr/share/nginx/html # Target directory to start replacement script, should point to built app
TARGET_ENV=VITE_ # Ensure only env with this prefix is replaced

# Check if TARGET_ENV and ASSETS_DIRECTORY is set 
: "${TARGET_ENV:?TARGET_ENV must be set (e.g. TARGET_ENV='VITE_')}"
: "${ASSETS_DIRECTORY:?Must set ASSETS_DIRECTORY to one path}"

# Check if the directory exists
if [ ! -d "$ASSETS_DIRECTORY" ]; then
    echo "Directory '$ASSETS_DIRECTORY' not found, please point to correct directory."
    exit 
fi

# Display the current directory being scanned
echo "Starting replacement script in $ASSETS_DIRECTORY"

# Iterate through each environment variable that starts with TARGET_ENV
env | grep "^${TARGET_ENV}" | while IFS='=' read -r key value; do

    echo "[replacing]--------- ${key} → ${value}"

    # Exec replace procedure
    find "$ASSETS_DIRECTORY" -type f \
        -exec sed -i "s|${key}|${value}|g" {} +
done
