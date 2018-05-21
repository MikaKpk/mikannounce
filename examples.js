const client = require('discord-rich-presence')('180984871685062656');
 
client.updatePresence({
  state: 'slithering',
  details: '🐍',
  startTimestamp: Date.now(),
  endTimestamp: Date.now() + 1337,
  largeImageKey: 'snek_large',
  smallImageKey: 'snek_small',
  /*partySize: 2,
  partyMax: 3,*/
  instance: true,
});

////PLAY JS

var play = require('play').Play();

  // play with a callback
  play.sound('./wavs/sfx/intro.wav', function(){

    // these are all "fire and forget", no callback
    play.sound('./wavs/sfx/alarm.wav');
    play.sound('./wavs/sfx/crinkle.wav');
    play.sound('./wavs/sfx/flush.wav');
    play.sound('./wavs/sfx/ding.wav');
    
  });

  //If you want to know when the player has defintely started playing
  play.on('play', function (valid) {
    console.log('I just started playing!');
  });
  play.sound('./wavs/sfx/ding.wav');

  //If you want to know if this can't play for some reason
  play.on('error', function () {
    console.log('I can't play!');
  });

////KEYPRESS

var keypress = require('keypress');
 
// make `process.stdin` begin emitting "keypress" events 
keypress(process.stdin);
 
// listen for the "keypress" event 
process.stdin.on('keypress', function (ch, key) {
  console.log('got "keypress"', key);
  if (key && key.ctrl && key.name == 'c') {
    process.stdin.pause();
  }
});
 
process.stdin.setRawMode(true);
process.stdin.resume();
