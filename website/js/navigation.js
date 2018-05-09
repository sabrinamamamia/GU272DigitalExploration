
function toggleSelect(id, action) {
	if (action == "click") {
		$('html, body').animate({
	    scrollTop: $("#blank-" + id).offset().top
		}, 1000);
	}
	if (id == 1) {
		if ($(".historic-map").hasClass("historic-map-selected")) {
			$(".historic-map").removeClass("historic-map-selected")
		}
		$(".historic-map").addClass("active");
	}
	if (id > 2) {
		$(".historic-map").removeClass("active");
	}
	if (id == 2) {
		$(".historic-map").addClass("historic-map-selected")
	}

	// if (id == 3) {
	// 	$(".timeline-image").addClass("bill-of-sale")
	// }
	// if (id != 3) {
	// 	if ($(".timeline-image").hasClass("bill-of-sale")) {
	// 		$(".timeline-image").removeClass("bill-of-sale")
	// 	}
	// }
	if (id == 3) {
		$(".historic-map").fadeOut()
	}
	if (id == 4) {
		// animateMap()
	}
	$("#date-" + id).addClass("selected")
};

//Made standalone function because .addClass() not working
function toggleLabelAndFill(g, state, mode) {
	if (mode == "on") {
		console.log(g)
		for (var i=0; i < g.length; i++) {
			$("g#" + g[i]).attr("display", "block")
		}
		$("path#" + path).removeAttr("style").css("fill", "darkgrey")
	} else {
		for (var i=0; i < g.length; i++) {
			$("g#" + g[i]).attr("display", "none")
		}
		$("path#" + path).css("fill", "#e1e1e1")
	}
}

function toggleMap(id, mode) {
	locList = ["whitemarsh", "stthomassmanor", "newtown", "stinigoes"]
	if (id == 1 && mode == "on") {
		toggleLabelAndFill(["georgetownuniversity"], "districtofcolumbia", "on")
	}
	else if (id == 1 && mode == "off") {
	 	toggleLabelAndFill(["georgetownuniversity"], "districtofcolumbia", "off")
	}
	if (id == 2 && mode == "on") {
		toggleLabelAndFill(locList, "maryland", "on")
	}
	else if (id == 2 && mode == "off") {
	 	toggleLabelAndFill(locList, "maryland", "off")
	}
	// if (mode == "on") {
	// 	console.log(g)
	// 	for (var i=0; i < g.length; i++) {
	// 		$("g#" + g[i]).attr("display", "block")
	// 	}
	// 	$("path#" + path).removeAttr("style").css("fill", "darkgrey")
	// } else {
	// 	for (var i=0; i < g.length; i++) {
	// 		$("g#" + g[i]).attr("display", "none")
	// 	}
	// 	$("path#" + path).css("fill", "#e1e1e1")
	// }
}

// Timeline date effect
$(window).scroll(function() {
	height = $(".page").height()
	if ($(this).scrollTop() > height  &&
	$(this).scrollTop() < $('#blank-2').position().top * 1.8) {
		toggleSelect(1, null);
	} else {
		$("#date-1").removeClass("selected")
	}
	if ($(this).scrollTop()> $('#blank-2').position().top * 2.2 &&
	$(this).scrollTop() < $('#blank-3').position().top * 1.3 ) {
		toggleSelect(2, null);
		$(".historic-map").fadeIn()
	} else {
		$("#date-2").removeClass("selected")
	}
	if ($(this).scrollTop() > $('#blank-3').position().top * 1.335) {
		$(".historic-map").fadeOut()
	}
	if ($(this).scrollTop() > $('#blank-3').position().top * 1.5 && 
		$(this).scrollTop() < $('#blank-4').position().top * 1.2) {
		toggleSelect(3, null);
	} else {
		$("#date-3").removeClass("selected")
	}
	if ($(this).scrollTop() > $('#blank-4').position().top * 1.3) {
		toggleSelect(4, null);
	} else {
		$("#date-4").removeClass("selected")
	}
});

$(".date").hover(
	function() {	//handlerIn
		$(this).css("opacity", "0.8");
		$(this.firstElementChild).css("display", "block");
	},			
	function() {	//handlerOut
		$(this).css("opacity", "0.5");
		$(this.firstElementChild).css("display", "none");
});

$("#date-1").click(function() {
	toggleSelect(1, "click");
});
$("#date-2").click(function() {
	toggleSelect(2, "click");
});
$("#date-3").click(function() {
	toggleSelect(3, "click");
});
$("#date-4").click(function() {
	toggleSelect(4, "click");
});

