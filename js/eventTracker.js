function trackEvent(action, category, label) {
	gtag('event', action, {
		'event_category': category, 
		'event_label': label
	});
	console.log("Event tracked")
}

$("#bill-of-sale").click(function() {
  trackEvent('click', 'Learn More', 'Bill of Sale Image');
});

$("#playButton").click(function() {
	animateMap();
	trackEvent('click', 'Engagement', 'Passage Play Button');
})

// ga('send', 'event', [eventCategory], [eventAction], [eventLabel], [eventValue], [fieldsObject]);

// onclick="ga('send', 'event', 'Learn More', 'click', 'Bill of Sale Image');"


// gtag('event', 'click', {
//   'event_category': 'Learn More',
//   'event_label': 'Bill of Sale Image'
// });

// onclick="ga('send', 'event', 'Engagement', 'click', 'Passage Play Button');"
// onclick="ga('send', 'event', 'Engagement', 'click', 'Pathways Filter Button');"
// onclick="ga('send', 'event', 'Engagement', 'click', 'Pathways Select Button');"
// onclick="ga('send', 'event', 'Engagement', 'click', 'Demographic Pie Chart');"
// onclick="ga('send', 'event', 'Engagement', 'click', 'Demographic Bar Chart');"
// onclick="ga('send', 'event', 'Engagement', 'click', 'Demographic Scatter Chart');"
// ga('send', 'event', 'Engagement', 'hover', 'Demographic Pie Chart');
// ga('send', 'event', 'Engagement', 'hover', 'Demographic Bar Chart');
// ga('send', 'event', 'Engagement', 'hover', 'Demographic Scatter Chart');
// ga('send', 'event', 'Engagement', 'click', 'Hawkins Tree');
// ga('send', 'event', 'Engagement', 'hover', 'Hawkins Tree');
// ga('send', 'event', 'Learn More', 'click', 'GU272 Descendants Association Website');
// ga('send', 'event', 'Learn More', 'click', 'GSA Website');
// ga('send', 'event', 'Learn More', 'click', 'Slavery Memory Reconciliation Website');
// ga('send', 'event', 'Learn More', 'click', 'Source Code');
// ga('send', 'event', 'Learn More', 'click', 'Data');
// ga('send', 'event', 'Learn More', 'click', 'Sabrina Github');
// ga('send', 'event', 'Learn More', 'click', 'Sabrina LinkedIn');
// ga('send', 'event', 'Learn More', 'click', 'Jonathan Github');
// ga('send', 'event', 'Learn More', 'click', 'Jonathan LinkedIn');