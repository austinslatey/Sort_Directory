#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// ================= CONFIGURATION =================
const DRY_RUN = false;           // Set to true first to preview
const TARGET_DIR = './SuperSprings_main';          // Current folder
// ================================================

function getFolderName(filename) {
    const name = path.basename(filename, path.extname(filename));
    const firstHyphenIndex = name.indexOf('-');

    if (firstHyphenIndex <= 0) return null; // no hyphen or starts with it

    // Return EXACTLY the part before the first hyphen
    return name.substring(0, firstHyphenIndex);
}

function main() {
    console.log('SuperSprings Organizer — Group by Text Before First Hyphen (Exact Match)\n');
    if (DRY_RUN) console.log('DRY RUN MODE — No files will be moved\n');

    const items = fs.readdirSync(TARGET_DIR);
    const rootFiles = [];

    // Collect only files from root
    for (const item of items) {
        const fullPath = path.join(TARGET_DIR, item);
        if (fs.statSync(fullPath).isFile()) {
            rootFiles.push(item);
        }
    }

    const groups = {};

    // First pass: determine folder name from each file
    for (const file of rootFiles) {
        const folderName = getFolderName(file);
        if (!folderName) {
            console.log(`[SKIP] No hyphen found: ${file}`);
            continue;
        }

        if (!groups[folderName]) groups[folderName] = [];
        groups[folderName].push(file);
    }

    let totalMoved = 0;

    // Second pass: create folders and move files
    for (const [folderName, files] of Object.entries(groups).sort()) {
        const folderPath = path.join(TARGET_DIR, folderName);

        console.log(`${folderName}/  (${files.length} files)`);

        if (!DRY_RUN) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        for (const file of files) {
            const oldPath = path.join(TARGET_DIR, file);
            const newPath = path.join(folderPath, file);

            if (DRY_RUN) {
                console.log(`   → ${file}`);
            } else {
                fs.renameSync(oldPath, newPath);
            }
            totalMoved++;
        }
        console.log('');
    }

    console.log('='.repeat(70));
    if (DRY_RUN) {
        console.log(`DRY RUN: Would create ${Object.keys(groups).length} folders and move ${totalMoved} files`);
        console.log(`Now set DRY_RUN = false and run again!`);
    } else {
        console.log(`SUCCESS! Created ${Object.keys(groups).length} folders`);
        console.log(`${totalMoved} files moved from root → perfect organization`);
    }
}

main();