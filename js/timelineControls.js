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
	scrollToSection("timeline", 1, "click");
});
$("#date-2").click(function() {
	scrollToSection("timeline", 2, "click");
});
$("#date-3").click(function() {
	scrollToSection("timeline", 3, "click");
});
$("#date-4").click(function() {
	scrollToSection("timeline", 4, "click");
});