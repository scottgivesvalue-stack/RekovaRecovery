const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const dir = __dirname;

// Find an installed browser on Windows
const browserPaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  (process.env.LOCALAPPDATA || '') + '\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  (process.env.PROGRAMFILES || '') + '\\Microsoft\\Edge\\Application\\msedge.exe',
];

const executablePath = browserPaths.find(p => fs.existsSync(p));

if (!executablePath) {
  console.error('ERROR: Could not find Chrome or Edge. Please install one and retry.');
  process.exit(1);
}

console.log('Using browser:', executablePath);

async function generatePDF(htmlFile, outputFile, label, viewport = { width: 1100, height: 680 }) {
  console.log(`\nGenerating ${label}...`);

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  await page.setViewport({ ...viewport, deviceScaleFactor: 2 });

  // Load local HTML file
  const fileUrl = 'file:///' + htmlFile.replace(/\\/g, '/').replace(/ /g, '%20');
  await page.goto(fileUrl, { waitUntil: 'networkidle2', timeout: 30000 });

  // Wait for Google Fonts + layout to settle
  await new Promise(r => setTimeout(r, 3000));

  await page.pdf({
    path: outputFile,
    preferCSSPageSize: true,
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });

  await browser.close();
  const sizeMB = (fs.statSync(outputFile).size / 1024 / 1024).toFixed(1);
  console.log(`Done: ${path.basename(outputFile)} (${sizeMB} MB)`);
}

// Letter-size viewport (8.5in x 11in at 96dpi)
const letterViewport = { width: 816, height: 1056 };

(async () => {
  try {
    await generatePDF(
      path.join(dir, 'pitch-retainer.html'),
      path.join(dir, 'Rekova-Retainer-Pitch-Deck.pdf'),
      'Retainer Model Deck'
    );

    await generatePDF(
      path.join(dir, 'pitch-revshare.html'),
      path.join(dir, 'Rekova-RevShare-Pitch-Deck.pdf'),
      'Revenue Share Model Deck'
    );

    await generatePDF(
      path.join(dir, 'staff-sales-guide.html'),
      path.join(dir, 'Rekova-Staff-Sales-Guide.pdf'),
      'Staff Sales & Training Guide',
      letterViewport
    );

    await generatePDF(
      path.join(dir, 'product-usage-guide.html'),
      path.join(dir, 'Rekova-Product-Usage-Guide.pdf'),
      'Product Benefits & Usage Guide',
      letterViewport
    );

    await generatePDF(
      path.join(dir, 'onboarding-guide.html'),
      path.join(dir, 'Rekova-Partner-Onboarding-Guide.pdf'),
      'Partner Onboarding Guide',
      letterViewport
    );

    console.log('\nAll PDFs generated successfully!');
    console.log('Files saved to:', dir);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
