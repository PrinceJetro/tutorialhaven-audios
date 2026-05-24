const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegPath);

const inputFile = process.argv[2];

if (!inputFile) {
  console.log('Usage: node compress.js <path-to-audio.mp3>');
  process.exit(1);
}

if (!fs.existsSync(inputFile)) {
  console.log(`❌ File not found: ${inputFile}`);
  process.exit(1);
}

const ext = path.extname(inputFile);
const base = path.basename(inputFile, ext);
const dir = path.dirname(inputFile);
const outputFile = path.join(dir, `${base}_compressed${ext}`);

const originalSize = (fs.statSync(inputFile).size / 1024 / 1024).toFixed(2);
console.log(`\n🎵 Input:  ${inputFile} (${originalSize} MB)`);
console.log(`⚙️  Compressing...`);

ffmpeg(inputFile)
  .setFfmpegPath(ffmpegPath)
  .audioBitrate('48k')
  .audioFrequency(22050)
  .audioChannels(1)
  .on('end', () => {
    const newSize = (fs.statSync(outputFile).size / 1024 / 1024).toFixed(2);
    console.log(`✅ Done!   ${outputFile} (${newSize} MB)`);
    console.log(`📉 Reduced from ${originalSize} MB → ${newSize} MB\n`);
  })
  .on('error', (err) => {
    console.log(`❌ Error: ${err.message}`);
  })
  .save(outputFile);
