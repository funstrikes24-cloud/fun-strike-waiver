const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { buildContinuousDynamicHtml } = require('./test-natural-flow');

const sampleSig = fs.readFileSync('E:/Aryan/fun-strikes-waiver/printables/sample-sig.txt', 'utf8').trim();

const sampleRiders20 = [
  '1. Aarav Harshvardhansinh Sharma | 1996-04-12 | 30 yrs (adult) | Primary Signer',
  '2. Rohan Aarav Sharma | 2012-08-15 | 14 yrs (minor) | Family / Son',
  '3. Priya Aarav Sharma | 2015-02-20 | 11 yrs (minor) | Family / Daughter',
  '4. Vivek Vikramaditya Chudasama-Rathore | 1991-06-10 | 35 yrs (adult) | Brother / Guest',
  '5. Meenakshi Suryavanshi-Deshmukh | 1994-11-25 | 32 yrs (adult) | Sister-in-law',
  '6. Harshvardhan Jaideepsinh Solanki | 2008-03-14 | 18 yrs (adult) | Cousin',
  '7. Ananya Devendrasingh Jhala | 2014-07-22 | 12 yrs (minor) | Niece',
  '8. Rajveer Mahendrasingh Parmar | 2005-09-09 | 21 yrs (adult) | Friend',
  '9. Kripalsinh Digvijaysinh Jadeja | 2000-12-01 | 26 yrs (adult) | Friend',
  '10. Shivendrasinh Yuvrajsinh Vaghela | 1998-05-18 | 28 yrs (adult) | Friend',
  '11. Bhavik Kiritkumar Bhattacharya | 1995-02-14 | 31 yrs (adult) | Colleague',
  '12. Chirag Hemendrabhai Prajapati | 1993-10-30 | 33 yrs (adult) | Colleague',
  '13. Divyarajsinh Pratapsinh Gohil | 2003-04-19 | 23 yrs (adult) | Friend',
  '14. Eshaani Chandrakant Sengupta | 2013-11-12 | 13 yrs (minor) | Family / Cousin',
  '15. Farhan Mohammadsiddiq Mansuri | 1997-08-05 | 29 yrs (adult) | Friend',
  '16. Gaurav Dharmendrabhai Makwana | 2002-01-20 | 24 yrs (adult) | Friend',
  '17. Hardik Jayeshkumar Brahmbhatt | 1999-06-17 | 27 yrs (adult) | Friend',
  '18. Ishan Dhirendrasingh Shekhawat | 2016-05-08 | 10 yrs (minor) | Family / Guest',
  '19. Jatin Chandrashekhar Upadhyay | 1990-09-23 | 36 yrs (adult) | Relative',
  '20. Karan Balwantsinh Mahida-Chavda | 1994-03-11 | 32 yrs (adult) | Guest'
];

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const tests = [
  { count: 1, type: 'gokart', label: '1 Driver (Solo)' },
  { count: 10, type: 'gokart', label: '10 Drivers (Group)' },
  { count: 20, type: 'gokart', label: '20 Drivers (Max Party)' },
  { count: 1, type: 'trampoline', label: '1 Jumper (Solo)' },
  { count: 10, type: 'trampoline', label: '10 Jumpers (Group)' },
  { count: 20, type: 'trampoline', label: '20 Jumpers (Max Party)' }
];

console.log('--- STARTING VERIFICATION TEST FOR 1, 10, AND 20 NAMES ---');

const results = [];

tests.forEach(t => {
  const isTramp = t.type === 'trampoline';
  const tag = `${t.type}-${t.count}`;
  const record = {
    refCode: `FS-TEST-${t.count}`,
    fullName: 'Aarav Harshvardhansinh Sharma',
    phone: '+91 98765 43210',
    email: 'aarav.sharma@example.com',
    dob: '1996-04-12',
    ageRole: 'Adult (30 yrs)',
    heightInches: 66,
    address: '102, Shivalik Heights, Gauravpath Road, Pal, Surat, Gujarat - 395009',
    branch: isTramp ? 'Gauravpath Road, Pal, Surat' : 'Gauravpath Road, Pal, Surat',
    activity: isTramp ? 'Soft Play & Trampoline Arena' : 'Go-Karting Track (18+)',
    allRiders: sampleRiders20.slice(0, t.count).join('\n'),
    signatureDataUrl: sampleSig,
    timestamp: '16-11-2026 05:15:30 PM'
  };

  const html = buildContinuousDynamicHtml(record);
  const baseName = `verify-${tag}`;
  const htmlFile = `E:/Aryan/fun-strikes-waiver/printables/${baseName}.html`;
  const pdfFile = `E:/Aryan/fun-strikes-waiver/printables/${baseName}.pdf`;
  const pngFile = `E:/Aryan/fun-strikes-waiver/printables/${baseName}-preview.png`;

  fs.writeFileSync(htmlFile, html, 'utf8');

  const htmlUri = 'file:///' + path.resolve(htmlFile).replace(/\\/g, '/');

  execSync(`"${chromePath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfFile}" "${htmlUri}"`, { stdio: 'ignore' });
  execSync(`"${chromePath}" --headless --disable-gpu --window-size=950,2200 --screenshot="${pngFile}" "${htmlUri}"`, { stdio: 'ignore' });

  const pdfBuf = fs.readFileSync(pdfFile);
  const pages = (pdfBuf.toString('latin1').match(/\/Type\s*\/Page\b/g) || []).length;
  const pdfSizeKb = Math.round(pdfBuf.length / 1024);

  const res = {
    label: t.label,
    activity: isTramp ? 'Trampoline' : 'Go-Karting',
    participants: t.count,
    pdfPages: pages,
    fileSize: `${pdfSizeKb} KB`,
    pdfPath: pdfFile,
    pngPath: pngFile
  };
  results.push(res);
  console.log(`[PASS] ${res.activity} (${res.participants} Names) -> Pages: ${res.pdfPages} | Size: ${res.fileSize}`);
});

console.log('\n--- FINAL TEST RESULTS SUMMARY ---');
console.table(results.map(r => ({
  Activity: r.activity,
  Participants: r.participants,
  'PDF Pages': r.pdfPages,
  'File Size': r.fileSize
})));
