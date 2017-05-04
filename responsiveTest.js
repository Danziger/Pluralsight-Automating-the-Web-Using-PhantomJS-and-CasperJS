const require = patchRequire(require);
const casper = require('casper').create({
	pageSettings: {
		userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
	},
});


// CONFIGS:

const URLS = require('./responsiveURLs');
const VIEWPORT_SIZES = (require('./responsiveConfig') || {}).VIEWPORT_SIZES;

if (!URLS || !Array.isArray(URLS) || URLS.length === 0
   || !VIEWPORT_SIZES || !Array.isArray(VIEWPORT_SIZES) || URLS.length === 0) {
	casper.exit();
	
	process.exit();
}


// RESPONSIVE TEST:

console.log('EXECUTING TESTS...');


// Interact with the page once loaded:

casper.start();

var iteration = 0;

casper.repeat(VIEWPORT_SIZES.length, function() {
	const VIEWPORT_SIZE = VIEWPORT_SIZES[iteration++];

	// THIS SHIT IS NOT WORKING!

	casper.viewport(VIEWPORT_SIZE, 1000, function() {
		casper.each(URLS, function(self, item, index) {
			self.thenOpen(item, function() {
				console.log(index + ' | ' + VIEWPORT_SIZE + ' | ' + this.getTitle());

				this.wait(2000, function() {
					this.capture('./output/responsive-screenshots/' + index + '-' + VIEWPORT_SIZE + '.png');
				});
			});
		});
	});
	
	console.log('\n');
});

casper.run();
