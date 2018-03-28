var $logo = $('#one');
$(document).scroll(function() {
    $logo.css({display: $(this).scrollTop()>100 ? "color":"yellow"});
});

// Timeline date effect
$(window).scroll(function() {
	height = $(".page").height()
	if (($(this).scrollTop()>=$('#date-info-1').position().top + height / 2) &&
	(($(this).scrollTop()<=$('#date-info-1').position().top + height - 25))) {
		$("#date-1").css({"color": "red", });
	} else {
		$("#date-1").css("color", "black");
	}
	if (($(this).scrollTop()>=$('#date-info-2').position().top + height / 2) &&
	(($(this).scrollTop()<=$('#date-info-2').position().top + height - 25))) {
		$("#date-2").css("color", "red");
	} else {
		$("#date-2").css("color", "black");
	}
	if (($(this).scrollTop()>=$('#date-info-3').position().top + height / 3) &&
	(($(this).scrollTop()<=$('#date-info-3').position().top + height - 25))) {
		$("#date-3").css("color", "red");
	} else {
		$("#date-3").css("color", "black");
	}
});