const casper = require('./casperBase');
const utils = require('utils');

const urlState = {};

var brokenResourceFound = false;

const URLS = [
	'https://web-beta.archive.org/web/20060209124246/http://www.bbc.co.uk:80/?ok',
	'http://www.google.com',
];

casper.on('resource.received', function(resource) {
	if (resource.stage === 'end' && resource.status > 400) {
		utils.dump(resource.url);
		
		brokenResourceFound = true;
	}
});

casper.start();

casper.each(URLS, function(self, url, index) {
	self.thenOpen(url, function() {
		urlState[url] = brokenResourceFound;
	});
	
	self.then(function() {
		brokenResourceFound = false;
	});
});

casper.run(function() {
	utils.dump(urlState);
	
	this.exit();
});

// casper.exit();