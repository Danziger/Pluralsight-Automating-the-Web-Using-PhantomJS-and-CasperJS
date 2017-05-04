const casper = require('casper').create();


// BASIC EXAMPLE:

console.log('HELLO WORLD\n');

casper.echo('HELLO COLOURS\n', 'WARNING');


// BASIC EXAMPLE:


// See console.logs from the page context:

casper.on('remote.message', function(msg) {
	console.log(msg);
});


// Interact with the page once loaded:

function onGoogleLoaded() {
	this.capture('./output/test.png');
	
	const message = 'PAGE TITLE = ';

	console.log('PAGE URL = ' + this.getCurrentUrl());

	const documentProp = this.evaluate(function(message) {
		const title = document.title;

		console.log(message + title);

		return document.whatever;
	}, message);

	console.log('\nPROPERTY FROM THE PAGE:\n');
	console.log(documentProp);
}

casper.start('http://www.google.com/', onGoogleLoaded);

casper.run();

// casper.exit(); // casper.run() will call .exit() automatically
