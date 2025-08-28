#!/bin/bash

# Base folder
BASE_DIR="/your/own/directory/path"

cd "$BASE_DIR" || exit

# Loop through all numbered folders (skip anything with -PDF or -PDFs)
for dir in [0-9][0-9]*/; do
    [[ "$dir" == *-PDF* ]] && continue

    echo "Processing $dir ..."

    # Check if this folder has any .jpg files directly inside it
    shopt -s nullglob
    jpgs=("$dir"*.jpg)
    shopt -u nullglob

    if [[ ${#jpgs[@]} -eq 0 ]]; then
        echo "Only folders, skipping"
        continue
    fi

    cd "$dir" || continue

    # Loop over all jpg files in this folder
    for file in *.jpg; do
        [[ ! -f "$file" ]] && continue

        # Remove extension
        name="${file%.jpg}"

        # Take everything before first underscore
        product_num="${name%%_*}"

        # Make subdirectory for product number
        mkdir -p "$product_num"

        # Move file into subdirectory
        mv "$file" "$product_num/"
    done    

    cd ..
done
