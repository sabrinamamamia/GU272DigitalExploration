var $logo = $('#one');
$(document).scroll(function() {
    $logo.css({display: $(this).scrollTop()>100 ? "color":"yellow"});
});