# Sorting Script

This is a simple shell script to organize files in numbered folders. The script scans a folder, creates subfolders based on a product number extracted from each file name, and moves the files into their corresponding subfolders. Files in folders with certain suffixes (like `-PDF` or `-PDFs`) are ignored.

## Features

- Organizes files into subfolders by product number.
- Ignores folders that match specific patterns (`-PDF` or `-PDFs`).
- Works on `.jpg` files by default.
- Safe to run on a folder with a backup.

## How to Run

1. Open a terminal (Git Bash or similar).
2. Navigate to the folder you want to sort:
   ```bash
   cd /path/to/your/folder
   ```
3. Run the script using its relative path:
`/path/to/sort_files.sh`


## Notes
- Make sure the script is executable:
`chmod +x /path/to/sort_files.sh`

- It's recommended to make a backup of your folder before running the script.