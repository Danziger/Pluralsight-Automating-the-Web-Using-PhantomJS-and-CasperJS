const require = patchRequire(require);
const casper = require('casper').create();

casper.on('remote.message', function(message) {
	console.log(message);
});

module.exports = casper;