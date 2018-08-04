function trackEvent(action, category, label) {
	gtag('event', action, {
		'event_category': category, 
		'event_label': label
	});
}

// History Page 
$("#bill-of-sale").click(function() {
  trackEvent('click', 'Learn More', 'Bill of Sale Image');
});
// Passage Page 
$("#playButton").click(function() {
	animateMap();
	trackEvent('click', 'Engagement', 'Passage Play Button');
});
// Pathways Page 
$("#familyButton").click(function() {
	trackEvent('click', 'Engagement', 'Pathways Filter Button');
});
$("#selectButton").click(function() {
	trackEvent('click', 'Engagement', 'Pathways Select Button');
});
$("#bundle").click(function() {
	trackEvent('click', 'Engagement', 'Roots Wheel');
});
$("#bundle").hover(function() {
	trackEvent('hover', 'Engagement', 'Roots Wheel');
});
// Demographics Page 
$("#pie").click(function() {
	trackEvent('click', 'Engagement', 'Pie Chart');
});
$("#pie").hover(function() {
	trackEvent('hover', 'Engagement', 'Pie Chart');
});
$("#bar").click(function() {
	trackEvent('click', 'Engagement', 'Bar Chart');
});
$("#bar").hover(function() {
	trackEvent('hover', 'Engagement', 'Bar Chart');
});
$("#scatter").click(function() {
	trackEvent('click', 'Engagement', 'Scatter Chart');
});
$("#scatter").hover(function() {
	trackEvent('hover', 'Engagement', 'Scatter Chart');
});
// Tree Page 
$(".treeContainer").click(function() {
	trackEvent('click', 'Engagement', 'Tree');
});
$(".treeContainer").hover(function() {
	trackEvent('hover', 'Engagement', 'Tree');
});
// About Page 
$("#sab-email").click(function() {
	trackEvent('click', 'Learn More', 'Sabrina Email');
});
$("#sab-github").click(function() {
	trackEvent('click', 'Learn More', 'Sabrina Github');
});
$("#sab-linkedin").click(function() {
	trackEvent('click', 'Learn More', 'Sabrina LinkedIn');
});
$("#jon-email").click(function() {
	trackEvent('click', 'Learn More', 'Jonathan Email');
});
$("#jon-").click(function() {
	trackEvent('click', 'Learn More', 'Jonathan Github');
});
$("#descendants-website").click(function() {
	trackEvent('click', 'Learn More', 'GU272 Descendants Association Website');
});
$("#gsa-website").click(function() {
	trackEvent('click', 'Learn More', 'GSA Website');
});
$("#slavery-website").click(function() {
	trackEvent('click', 'Learn More', 'Slavery Memory Reconciliation Website');
});
$("#sourcecode").click(function() {
	trackEvent('click', 'Learn More', 'Source Code');
});
$("#data").click(function() {
	trackEvent('click', 'Learn More', 'Data');
});

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