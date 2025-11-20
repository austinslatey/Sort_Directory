#!/bin/bash

CSV_FILE="your_csv.csv"
ROOT="./your_folder"

echo "Deleting 0-byte images listed in $CSV_FILE..."
echo

# Skip header and process each line
tail -n +2 "$CSV_FILE" | while IFS=',' read -r part image size; do
    # Remove surrounding quotes if present
    part=${part//\"/}
    image=${image//\"/}
    
    file_path="$ROOT/$part/$image"
    
    if [[ -f "$file_path" ]]; then
        rm -v "$file_path"
    else
        echo "Not found (already gone?): $file_path"
    fi
done

echo
echo "All done!"