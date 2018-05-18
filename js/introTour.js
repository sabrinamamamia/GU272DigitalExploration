var enjoyhint_instance;
function getCookie(name) { //get cookie with name
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
            end = dc.length;
        }
    }
    // because unescape has been deprecated, replaced with decodeURI
    //return unescape(dc.substring(begin + prefix.length, end));
    return decodeURI(dc.substring(begin + prefix.length, end));
}
$("#finishNextButton").mousedown(function() { //end tour
    d3.select("#end-modal-screen").classed("hidden-modal", true);
    d3.select("#full-screen-modal").classed("hidden-modal", true);
    enjoyhint_instance = null;
});

if (!getCookie("pathways_first_login")) { //f the user has never logged in before start the tour
    enjoyhint_instance = new EnjoyHint({
        onEnd: function() { //when the tour ends pull up a closing modal
            enjoyhint_instance = null;
            d3.select("#end-modal-screen").classed("hidden-modal", false);
            d3.select("#full-screen-modal").classed("hidden-modal", false);
        },
        onSkip: function () { //skipping should end the tour
            enjoyhint_instance = null;
        }
    });
    d3.select("#welcome-modal-screen").classed("hidden-modal", false); //open the starting modals
    d3.select("#full-screen-modal").classed("hidden-modal", false);
}
$("#welcomeNextButton").mousedown(function() { //When someone moves past first screen of tour
    document.cookie="pathways_first_login=false"; //mark cookie so won't pull up tour again in future

    d3.select("#welcome-modal-screen").classed("hidden-modal", true); //hide moals
    d3.select("#full-screen-modal").classed("hidden-modal", true);

    d3.select("#right-container").classed("stage-open", false);
    var enjoyhint_script_steps = [ //start tour with tour array
        {
            selector:"#svgTop",
            event_type: "custom",
            description:'<div style="width: 30VW; text-align: left">This is the main visual window which can depict two different types of graphs. ' +
            'The current graph, called the Roots Wheel, depicts where the Jesuits sold individual members of the GU272. You can hover over the names to see who the Jesuits sold where, ' +
            'but for now, select an enslaved person by clicking on the person\'s name to continue.</div>',
            sideStatement: ['top', 'right', 'top']
        },
        {
            selector:"#magnifyNamesCheckBoxContainer",
            event_type: "next",
            description:'<div style="width: 30VW; text-align: left">Did you experience any lag when hovering over names on the Roots Wheel? Unfortunately, if your browser ' +
            'is out of date, or if your computer is slow, you may run into some performance issues when magnifying names as you interact with the visualization. ' +
            'If needed, turn this feature off to improve performance. Click next to continue.</div>',
            sideStatement: ['bottom', 'left', 'left']
        },
        {
            selector:"#person-selection-container",
            event_type: "next",
            description:'<div style="width: 30VW; text-align: left">Now, notice that when you selected a person in the Root Wheel, the person was also selected here. ' +
            'You can try searching for a different person in this autocomplete field if you would like, but that is not necessary. Just click next when you are ready to continue.</div>'
        },
        {
            selector:"#mapSelectorButton",
            event_type: "custom",
            description: '<div style="width: 30VW; text-align: left">Next, click on the map button to see the path in which the person you selected traveled after the Jesuits sold ' +
            'the person to either Jesse Batey or Henry Johnson</div>',
            sideStatement: ['right', 'bottom', 'bottom']
        },
        {
            selector:"#mapBox",
            event_type: "next",
            description: '<div style="width: 30VW; text-align: left">As you can see, the map shows the path in which the Jesuits sent the person you selected after they sold him ' +
            'or her.</div>',
            sideStatement: ['bottom', 'right', 'bottom']
        }
    ];
    enjoyhint_instance.set(enjoyhint_script_steps); //set the tour data and run it
    enjoyhint_instance.run();
});
