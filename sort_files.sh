#!/bin/bash

# Base folder
BASE_DIR="~/your/own/directory/path"

cd "$BASE_DIR" || exit

# Loop through all numbered folders (skip anything with -PDF or -PDFs)
for dir in [0-9][0-9]*/; do
  [[ "$dir" == *-PDF* ]] && continue

  echo "Processing $dir ..."

  cd "$dir" || continue

  # Loop over all jpg files in this folder
  for file in *.jpg; do
    [[ ! -f "$file" ]] && continue

    # Extract product number (e.g. 50-2000_* → 2000)
    product_num=$(echo "$file" | sed -E 's/^[0-9]+-([0-9]+).*/\1/')

    # Make subdirectory for product number
    mkdir -p "$product_num"

    # Move file into subdirectory
    mv "$file" "$product_num/"
  done

  cd ..
done
