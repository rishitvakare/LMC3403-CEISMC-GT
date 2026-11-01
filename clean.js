const fs = require('fs');

console.log('Reading your original index.html...');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Find and extract the massive coordinate variable (e.g., const land = { ... })
const landRegex = /(?:const|let|var)\s+land\s*=\s*([\s\S]*?);\s*(?:<\/script>|\n\s*(?:const|let|var|function|\/\/))/i;
const landMatch = html.match(landRegex);

if (landMatch) {
    const landJsonContent = landMatch[1].trim();
    // Save the 1.19MB data to a separate file so it's out of your hair
    fs.writeFileSync('land.json', landJsonContent);
    console.log('Successfully offloaded 1.19MB of coordinates to land.json!');

    // 2. Replace the giant inline variable in the HTML with an async fetch loader
    const asyncLoaderTag = `<script>
    let land;
    d3.json('land.json').then(data => {
        land = data;
        if (typeof init === 'function') init();
    });
    </script>`;

    html = html.replace(landMatch[0], asyncLoaderTag);
} else {
    console.warn('Warning: Could not automatically match the "land" variable. Check your variable name.');
}

// 3. Replace any inline D3 source code blocks with a lightweight CDN link
html = html.replace(/<script[^>]*>[\s\S]*?d3\.v[4567](\.min)?\.js[\s\S]*?<\/script>/gi, 
    '<script src="https://d3js.org/d3.v7.min.js"></script>');

// Save the modified, readable HTML file
fs.writeFileSync('index.html', html);
console.log('Done! Your index.html is now clean, readable, and under normal file size.');