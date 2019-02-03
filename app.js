#!/usr/bin/env node
const meow = require('meow');
const cli = meow(`
    Usage
      $ lgtv <input>
 
    Options
      --help       Display help message
      --setvolume  Set your TV volume
      --turnoff    Turn off your TV
      --message    Display a toast message on your TV
 
    Examples
      $ lgtv --setvolume 35
      $ lgtv --turnoff 
      $ lgtv --message "Hello World!"
`, {
    flags: {
        setvolume: {
            type: 'int',
            alias: 'sv'
        },
        turnoff: {
          alias: 'to'
        },
        message: {
          alias: 'm'
        }
    }
});

const action = Object.keys(cli.flags)[0];
console.log(action);
var lgtv = require('lgtv2')({
  url: 'ws://lgwebostv:3000'
});

lgtv.on('error', function(err) {
  console.log(err);
  lgtv.disconnect();
});

lgtv.on('connect', function() {
  console.log('connected to tv.');

  switch (action) {
    case 'sv':
    case 'setvolume':
      lgtv.request('ssap://audio/setVolume', { volume: parseInt(cli.flags.setvolume) });
      console.log("Volume changed to " + cli.flags.setvolume);
      lgtv.disconnect();
      break;
    case 'to':
    case 'turnoff':
      lgtv.request('ssap://system/turnOff', function(err, res) {
        lgtv.disconnect();
      });
      break;
    case 'm':
    case 'message':
      lgtv.request('ssap://system.notifications/createToast', {
        message: cli.flags.message
      });
      break;
    default:
      console.log('No matching params provided');
      lgtv.disconnect();
  }
});
