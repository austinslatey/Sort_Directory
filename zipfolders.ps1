# Zip each folder in the current directory into its own .zip file

# Change this path to where your folders are
cd "C:\path\to\your\folders"

# Loop through each directory and zip it individually
Get-ChildItem -Directory | ForEach-Object {
    $zipName = "$($_.Name).zip"
    if (Test-Path $zipName) {
        Remove-Item $zipName -Force  # optional: overwrite existing zips
    }
    # Use * to zip the folder contents (avoids nested folder issue in NetSuite)
    Compress-Archive -Path "$($_.FullName)\*" -DestinationPath $zipName -Force
}

Write-Host "All folders zipped successfully."