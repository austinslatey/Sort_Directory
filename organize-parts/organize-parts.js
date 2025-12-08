#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// ================= CONFIGURATION =================
const DRY_RUN = false;           // Set to true first to preview!
const TARGET_DIR = './Truxedo';         // Current folder (where the script is run)
// ================================================

function classifyFile(filename) {
    const name = filename.toLowerCase();

    // PDFs → always go to Manuals
    if (name.endsWith('.pdf')) {
        return 'PDFs & Manuals';
    }

    // Legacy numbered images (e.g. 215001_v1_20101103.jpg)
    if (/^\d{6}_v1_/.test(name)) {
        return 'Legacy Numbered Images';
    }

    // Elevate Rack
    if (name.includes('elevate') || name.includes('hro_elevate')) {
        return 'Elevate Rack';
    }

    // Deuce
    if (name.includes('deuce')) {
        return 'Deuce';
    }

    // Pro X15 TS — HIGHEST PRIORITY (these files contain "pro-x15-ts")
    if (name.includes('pro-x15-ts')) {
        return 'Pro X15 TS';
    }

    // Pro X15 (regular)
    if (name.includes('prox15') || name.includes('pro-x15') || name.includes('pro x15')) {
        return 'Pro X15';
    }

    // Lo Pro
    if (name.includes('lopro') || name.includes('lo_pro') || name.includes('lo pro')) {
        return 'Lo Pro';
    }

    // Sentry CT
    if (name.includes('sentryct') || name.includes('sentry_ct') || name.includes('sentry ct')) {
        return 'Sentry CT';
    }

    // Sentry (regular)
    if (name.includes('sentry')) {
        return 'Sentry';
    }

    // Truxport
    if (name.includes('truxport') || name.includes('tx_truxport')) {
        return 'Truxport';
    }

    // Fallback
    return 'Uncategorized';
}

function main() {
    console.log('Truxedo Auto Organizer — Smart Product Sorting (with Pro X15 TS)\n');
    if (DRY_RUN) console.log('DRY RUN MODE — No files will be moved\n');

    const fullTarget = path.resolve(TARGET_DIR);
    const items = fs.readdirSync(fullTarget);
    const rootFiles = [];

    // Collect only files from root
    for (const item of items) {
        const fullPath = path.join(fullTarget, item);
        if (fs.lstatSync(fullPath).isFile()) {
            rootFiles.push(item);
        }
    }

    const groups = {};

    // Classify each file
    for (const file of rootFiles) {
        const folderName = classifyFile(file);
        if (!groups[folderName]) groups[folderName] = [];
        groups[folderName].push(file);
    }

    let totalMoved = 0;

    // Create folders and move files
    for (const [folderName, files] of Object.entries(groups).sort()) {
        const folderPath = path.join(fullTarget, folderName);

        console.log(`${folderName}/`.cyan + `  (${files.length} files)`);

        if (!DRY_RUN) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        for (const file of files) {
            const oldPath = path.join(fullTarget, file);
            let newPath = path.join(folderPath, file);

            // Prevent overwriting (add _1, _2 if needed)
            let counter = 1;
            while (!DRY_RUN && fs.existsSync(newPath)) {
                const ext = path.extname(file);
                const base = path.basename(file, ext);
                newPath = path.join(folderPath, `${base}_${counter}${ext}`);
                counter++;
            }

            if (DRY_RUN) {
                console.log(`   → ${file}`);
            } else {
                fs.renameSync(oldPath, newPath);
                console.log(`   Moved: ${file}`);
            }
            totalMoved++;
        }
        console.log('');
    }

    console.log('='.repeat(70));
    if (DRY_RUN) {
        console.log(`DRY RUN COMPLETE: Would create ${Object.keys(groups).length} folders and move ${totalMoved} files`);
        console.log(`Now set DRY_RUN = false and run again to sort!`);
    } else {
        console.log(`SUCCESS! Created ${Object.keys(groups).length} folders`);
        console.log(`${totalMoved} files moved into proper product folders`);
    }
}

// Simple color support (works in most terminals)
String.prototype.cyan = function () { return `\x1b[36m${this}\x1b[0m`; };
String.prototype.yellow = function () { return `\x1b[33m${this}\x1b[0m`; };

main();