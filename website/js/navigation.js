function toggleSelect(id, action) {
	if (action == "click") {
		$('html, body').animate({
	    scrollTop: $("#blank-" + id).offset().top
		}, 1000);
	}
	$("#date-" + id).addClass("selected")
}

//Made standalone function because .addClass() not working
function toggleLabelAndFill(g, path, mode) {
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

function updateMap(id, mode) {
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

	// if (id == 0) {
	// 	$("path").css("fill", "lightgrey")
	// 	$("text.location").css("display", "none")
	// 	$("image.location").css("display", "none")
	// }	
	// if (id == 1) {
	// 	// $("path#districtofcolumbia").attr({"class": "state-selected"}, {"fill": "darkolivegreen"})
	// 	// $("path#districtofcolumbia").removeAttr("fill")
	// 	$("path#districtofcolumbia")
	// 		.removeAttr("style")
	// 		.attr({"fill": "darkslateblue"}, {"transition": "fill .4s ease"});
	// 		// $("text.location").first().addClass("selected-location")
	// 		// $("image.location").first().addClass("selected-location")
	// 		$("text.location").first().css("display", "block")
	// 		$("image.location").first().css("display", "block")
	// }

	// else if (id == 2) {
	// 	$("path#maryland")
	// 		.removeAttr("style")
	// 		.attr({"fill": "darkslateblue"}, {"transition": "opacity 1s"});
	// 		$("image.location").css("display", "block")
	// }
}

// Timeline date effect
$(window).scroll(function() {
	height = $(".page").height()
	if ($(this).scrollTop() > height  &&
	$(this).scrollTop() < $('#blank-2').position().top * 1.8) {
		toggleSelect(1, null);
		updateMap(1, "on");
	} else {
		$("#date-1").removeClass("selected")
		updateMap(1, "off")
	}
	if ($(this).scrollTop()> $('#blank-2').position().top * 2.2 &&
	$(this).scrollTop() < $('#blank-3').position().top * 1.4 ) {
		toggleSelect(2, null);
		updateMap(2, "on");
	} else {
		$("#date-2").removeClass("selected")
		updateMap(2, "off");
	}
	if ($(this).scrollTop()> $('#blank-3').position().top * 1.5) {
		toggleSelect(3, null);
	} else {
		$("#date-3").removeClass("selected")
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

