const fs = require('fs');
const casper = require('casper').create({
	pageSettings: {
		userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
	},
});


// GOOGLE CRAWLER:

var data = [];


// See console.logs from the page context:

casper.on('remote.message', function(msg) {
	console.log(msg);
});


// Interact with the page once loaded:

function onGoogleLoaded() {
	this.fill('form', { q: 'Hello World' }, true);
}

casper.start('http://www.google.com/', onGoogleLoaded);

// casper.then(callback) may not work in slow connection, so we could use caspter.wait(time, callback) instead or also
// waitForXXX, such as waitForSelector(selector, callback)

casper.wait(1000, function() {
	this.capture('./output/search.png');

	data = this.evaluate(function() {
		const elements = document.querySelectorAll('.g > .rc > h3 a');
		const elementsCount = elements.length;
		const data = [];

		for (var i = 0; i < elementsCount; ++i) {
			const element = elements[i];
			
			data.push({
				title: element.text,
				url: element.getAttribute('href')
			});
		}
		
		return data;
	});
});

casper.run(function() {
	fs.write('./output/search-result.json', JSON.stringify(data, null, '\t'));
	
	this.exit(); // This will NOT be called automatically when providing a callback to casper.run()
});
