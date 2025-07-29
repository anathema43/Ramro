// Download Project Script
// Run this in your browser's developer console to download all files

const files = [
  // Root files
  { path: 'package.json', url: '/package.json' },
  { path: 'vite.config.js', url: '/vite.config.js' },
  { path: 'tailwind.config.js', url: '/tailwind.config.js' },
  { path: 'postcss.config.cjs', url: '/postcss.config.cjs' },
  { path: 'eslint.config.js', url: '/eslint.config.js' },
  { path: 'cypress.config.js', url: '/cypress.config.js' },
  { path: 'index.html', url: '/index.html' },
  { path: 'README.md', url: '/README.md' },
  { path: 'firebase.json', url: '/firebase.json' },
  { path: 'firestore.rules', url: '/firestore.rules' },
  { path: 'firestore.indexes.json', url: '/firestore.indexes.json' },
  { path: 'storage.rules', url: '/storage.rules' },
  { path: '.env.example', url: '/.env.example' },
  
  // Source files
  { path: 'src/main.jsx', url: '/src/main.jsx' },
  { path: 'src/App.jsx', url: '/src/App.jsx' },
  { path: 'src/index.css', url: '/src/index.css' },
  
  // Add all other files here...
];

async function downloadFile(file) {
  try {
    const response = await fetch(file.url);
    const content = await response.text();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.path.replace('/', '_');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(`Failed to download ${file.path}:`, error);
  }
}

// Download all files
files.forEach((file, index) => {
  setTimeout(() => downloadFile(file), index * 100);
});