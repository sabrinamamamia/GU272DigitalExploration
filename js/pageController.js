// Scroll to section of timeline or to a page
function scrollToSection(type, id, action) {
    if (type == "timeline") {
        if (action == "click") {
            $('html, body').animate({
            scrollTop: $("#blank-" + id).offset().top
            }, 1000);
            $("#date-" + id).addClass("selected")
        }
        else if (action == "scroll") {
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
            if (id == 3 || id == 4) {
                $(".historic-map").fadeOut()
            }   
            $("#date-" + id).addClass("selected")
        }
    }
};

// Full page scroll 
$(document).ready(function() {
    $('#fullpage').fullpage({
        sectionsColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
        anchors: ['home', 'gu272Timeline', 'pathways', 'gu272Demographics', 'gu272FamilyTrees', 'about'],
        menu: '#menu',
        scrollOverflow: true,
        autoScrolling: false,
    });
});

//Hover event listener
$(".date").hover(
    function() {    //handlerIn
        $(this).css("opacity", "0.8");
        $(this.firstElementChild).css("display", "block");
    },          
    function() {    //handlerOut
        $(this).css("opacity", "0.5");
        $(this.firstElementChild).css("display", "none");
});

//Scroll event listener 
$(document).scroll(function() {
    // Change header subtitle on scroll
    var y = $(this).scrollTop();
    if (y >= $('#titlePage').height()) {
        $('#header').show();

        if (y < $('#titlePage').height() + $('#history').height()) {
            $('#heading-bar-subtitle').html("Timeline");
        }
        else if (y < $('#titlePage').height() + $('#history').height() + $('#pathwaysPage').height()) {
            $('#heading-bar-subtitle').html("Pathways");
        }
        else if (y < $('#titlePage').height() + $('#history').height() + 
            $('#pathwaysPage').height() + $('#demographicsPage').height()) {
            $('#heading-bar-subtitle').html("Demographics");
        }
        else if (y < $('#titlePage').height() + $('#history').height() + 
            $('#pathwaysPage').height() + $('#demographicsPage').height() + 
            $('#familyTreePage').height()) {
            $('#heading-bar-subtitle').html("Family Trees");
        }
        else {
            $('#heading-bar-subtitle').html("About");
        }
    } else {
        $('#header').hide();
    }

    // Change selected timeline date on scoll
    height = $(".page").height()
    if ($(this).scrollTop() > height  &&
    $(this).scrollTop() < $('#blank-2').position().top * 1.8) {
        scrollToSection("timeline", 1, "scroll");
    } else {
        $("#date-1").removeClass("selected")
    }
    if ($(this).scrollTop() > $('#blank-2').position().top * 2.2 &&
    $(this).scrollTop() < $('#blank-3').position().top ) {
        scrollToSection("timeline", 2, "scroll");
        $(".historic-map").fadeIn()
    } else {
        $("#date-2").removeClass("selected")
    }
    if ($(this).scrollTop() > $('#blank-3').position().top * 1.1  && 
        $(this).scrollTop() < $('#blank-4').position().top * 1.2) {
        scrollToSection("timeline", 3, "scroll");
    } else {
        $("#date-3").removeClass("selected")
    }
    if ($(this).scrollTop() > $('#blank-4').position().top * 1.3) {
        scrollToSection("timeline", 4, "scroll");
    } else {
        $("#date-4").removeClass("selected")
    }
});