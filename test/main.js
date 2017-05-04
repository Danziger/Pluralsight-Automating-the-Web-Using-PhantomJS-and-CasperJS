const url = 'https://duckduckgo.com/';

casper.test.begin('Testing the page status', function(test) {
	casper.start(url, function() {
		test.assertHttpStatus(200, 'Page is up and running');
	});
	
	casper.then(function() {
		test.assert(casper.getCurrentUrl() === url, 'URL is the one expected');
	});
	
	casper.run(function() {
		test.done();
	})
});

function checkSelectorForAttr(selector, attr) {
	const results = [];
	const elements = document.querySelectorAll(selector);
	
	if (elements.length === 0) {
		return null;
	}
	
	for (var i = 0; i < elements.length; ++i) {
		const current = elements[i];
		const hasAttr = current.hasAttribute(attr);
		
		if (!hasAttr) {
			results.push(current.outerHTML);
		}
	}
	
	return results;
}

casper.options.remoteScripts.push('https://code.jquery.com/jquery-3.2.1.min.js')

casper.test.begin('Testing the accessibility', function(test) {
	casper.start(url, function() {
		this.evaluate(function() {
			$.noConflict();
		});
	});
	
	casper.then(function() {
		test.assertDoesntExist('a input', 'Input element doesn\'t exist inside an anchor element');
	});
	
	casper.then(function() {
		test.assertExists('html[lang]', 'A HTML element with a "lang" attribute exists');
		test.assertTruthy(this.getElementAttribute('html[lang]', 'lang'), 'HTML "lang" attribute has a value');
		
		test.assertExists('head title', 'A title element exists inside the head');
	});
	
	casper.then(function() {
		const imagesWithNoAltAttr = this.evaluate(checkSelectorForAttr, 'img', 'alt');
		
		if (imagesWithNoAltAttr && imagesWithNoAltAttr.length > 0) {
			test.fail('Some images don\'t have an "alt" attribute');
		}
	});
	
	casper.run(function() {
		test.done();
	})
});
