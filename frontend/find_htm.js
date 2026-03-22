const fs = require('fs');
const path = require('path');

function findHtm(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
        if (f.endsWith('.htm')) return path.join(dir, f);
        if (fs.statSync(path.join(dir, f)).isDirectory() && !f.startsWith('.')) {
            const found = findHtm(path.join(dir, f));
            if (found) return found;
        }
    }
    return null;
}

try {
    const htmPath = findHtm(path.dirname(__dirname));
    console.log("Found at:", htmPath);
    if (htmPath) {
        let content = fs.readFileSync(htmPath, 'utf8');
        let clean = content.replace(/<style[^>]*>[\s\S]*?<\/style>/ig, '');
        clean = clean.replace(/<[^>]+>/g, '\n');
        const lines = clean.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        fs.writeFileSync(path.join(__dirname, 'client_instructions.txt'), lines.join('\n'));
        console.log("Written output to client_instructions.txt");
    }
} catch (e) {
    console.log("Error:", e);
}
