const fs = require('mz/fs');
const glob = require('glob-promise');

const random = below => Math.floor(Math.random() * below);

async function chooseSong() {
  // Pick a random song.
  const songs = await glob('ajjthelyrics/*/*.md');
  const song = songs[random(songs.length)];
  console.log(song);
  return await fs.readFile(song, 'utf8');
}

function trimToLength(lyrics, maxLength) {
  let lines = lyrics.split('\n');

  // Trim lines to size by removing lines (with a 3/4 chance of removing last line)
  while(lines.join('\n').length  > maxLength) {
    lines = Math.random >= 0.75 ?  lines.slice(0, -1) : lines.slice(1);
  }

  return lines.join('\n').trim();
}

async function pick(customLength) {
  const lengths = [60, 80, 120, 140];
  const lyrics = await chooseSong();

  let length = customLength || lengths[random(lengths.length)];

  let tweet = '';

  while(tweet === '') {
    tweet = trimToLength(lyrics, length);

    // If we loop around, we'll have a bigger tweet to choose.
    // If we chose a custom length, we'll just get the biggest length;
    length = lengths[lengths.indexOf(length) + 1] || lengths[lengths.length];
  }

  return tweet;
}

module.exports = { pick };
