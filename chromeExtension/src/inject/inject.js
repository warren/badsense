var results;
var links;

function clickRequest(link) {
	if (link) {
		$.post(link.ping, "PING", function(d, s, x){console.log("Sent ping. Status: " + s);});
	}
}

function highlight(link) {
	if (link) {
		link.style["color"] = "red";
		link.style["background"] = "red";
	}
}

function clear(link) {
	if (link) {
		link.style["color"] = "";
		link.style["background"] = "";
	}
}

function click(links, callback_after_last) {

	var link = links.shift();

	highlight(link);
	clickRequest(link);

	setTimeout(function() {
		clear(link);
		if (links.length == 0) {
			callback_after_last();
		} else {
			click(links, callback_after_last);
		}
	}, 125);
}

function search(term) {
	window.location.href = encodeURI("https://www.google.com/search?q=" + term);
}

function done() {
	console.log("Finished clicking links.");
}

chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		results = $(".r").toArray();
		links = [];

		console.log(results);	

		for (var i = results.length - 1; i >= 0; i--) {
			var anchor = $(results[i]).find("a")[0];
			if (anchor.ping) {
				links.push(anchor);
			}
		}

		console.log(links);

		click(links, done);

		// ----------------------------------------------------------

	}
	}, 10);
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    alert("I'm a content script and I just heard the request: " + request.keyword);
  });