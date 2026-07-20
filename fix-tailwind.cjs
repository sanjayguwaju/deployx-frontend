const fs = require('fs');
const path = require('path');

const replacements = [
  { search: /flex-grow/g, replace: 'grow' },
  { search: /flex-shrink-0/g, replace: 'shrink-0' },
  { search: /z-\[10050\]/g, replace: 'z-10050' },
  { search: /w-\[var\(--radix-popover-trigger-width\)]/g, replace: 'w-(--radix-popover-trigger-width)' },
  { search: /min-w-\[8rem\]/g, replace: 'min-w-32' },
  { search: /min-w-\[var\(--radix-select-trigger-width\)]/g, replace: 'min-w-(--radix-select-trigger-width)' },
  { search: /data-\[disabled\]:pointer-events-none/g, replace: 'data-disabled:pointer-events-none' },
  { search: /data-\[disabled\]:opacity-50/g, replace: 'data-disabled:opacity-50' },
  { search: /dark:bg-white\/\[0\.03\]/g, replace: 'dark:bg-white/3' },
  { search: /-tracking-\[0\.2px\]/g, replace: 'tracking-[-0.2px]' },
  { search: /dark:border-white\/\[0\.05\]/g, replace: 'dark:border-white/5' },
  { search: /z-\[60\]/g, replace: 'z-60' },
  { search: /z-\[70\]/g, replace: 'z-70' }
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let newContent = content;
      for (const rule of replacements) {
        newContent = newContent.replace(rule.search, rule.replace);
      }
      if (newContent !== content) {
        fs.writeFileSync(fullPath, newContent);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDir('/Users/sanjayguwaju/Documents/tecobit-projects/palata-mms-frontend/src');
