var controller = {};
//catherine Jackson
function controllerMain() {
    var showChord = true;
    var showMap = false;
    var selectPersonSearchTerm = "";
    var familySearchTerm = "";
    var ageSearchTerm = "";
    var showSidebar = true;
    var ageFilterOption = "greaterThan";
    var plantationFilterOption = "any";
    var buyerFilterOption = "any";
    var genderFilterOption = "any";
    var filterKatharineJackson = false;
    var searchWithinFilterConditions = false;
    //filter control actions
    $(function(){
        $("#selectButton").click(function(result){ //triggered when selecting a person
            var personData = chord.getAllData().filter(function(data) { //find selected person
                if (data.data.full_name.substr(data.data.full_name.indexOf(" ") + 1) === selectPersonSearchTerm)
                    return true;
                return false;
            });
            if (personData && personData.length > 0)
                controller.selectEnslavedPerson(personData[0].data); //select person
            else
                controller.deselectEnslavedPerson(); //if person doesn't exist deselect
        });
        $("#familyButton").click(function(result){ //filter results
            controller.deselectEnslavedPerson(); //deselect first
            var combinedFilter = getCombinedFilter(); //build filter
            chord.refreshVisualization(combinedFilter); //refresh visualization using filter
            updateFilterConditionsForSelect(); //Update filter conditions
        });
        $("#chordSelector").change(function(result){ //if chaning to root wheel display it
            showChord = true;
            showMap = false;
            showHidePanels();
        });
        $("#mapSelector").change(function(result){ //display map
            // if (enjoyhint_instance)
            //     enjoyhint_instance.trigger('next');
            showChord = false;
            showMap = true;
            showHidePanels();
        });
        $("#familySelector").change(function(result){ //show family tree
            showChord = false;
            showMap = false;
            showHidePanels();
        });
        function showHidePanels() { //show panels based on what is selected
            d3v2.select("#bundle").classed("hidden", !showChord);
            d3v2.select("#mapContainer").classed("hidden", !showMap);
            d3v2.select("#mapContainer").classed("opacity0", false);

            d3v2.select("#chordControlsContainer").classed("hidden", !showChord);
        }
        $('#move-button').mousedown(function() { //EIther open or close stage (toggles it)
            showSidebar = !showSidebar;
            d3v2.select("#left-container").classed("stage-shrink", showSidebar);
            d3v2.select("#right-container").classed("stage-open", showSidebar);
            d3v2.select("#right-positioning-container").classed("stage-open", showSidebar);
            d3v2.select("#left-container").classed("stage-grow", !showSidebar);
            d3v2.select("#right-container").classed("stage-close", !showSidebar);
            d3v2.select("#right-positioning-container").classed("stage-close", !showSidebar);

            d3v2.select("#rightButton").classed("open-button", showSidebar);
            d3v2.select("#leftButton").classed("open-button", !showSidebar);
            d3v2.select("#rightButton").classed("close-button", !showSidebar);
            d3v2.select("#leftButton").classed("close-button", showSidebar);
        });
        $('#otherCheckbox').click(function() { //checkbox for showing other data selected
            chord.showOtherData = !chord.showOtherData;
            chord.refreshVisualization(null, true);
        });
        $("#resetButton").click(function () { //set all variables (except multiplier)
            // chord.multiplier = 0.9;
            selectPersonSearchTerm = "";
            familySearchTerm = "";
            ageSearchTerm = "";
            ageFilterOption = "greaterThan";
            plantationFilterOption = "any";
            buyerFilterOption = "any";
            genderFilterOption = "any";
            filterKatharineJackson = false;
            $("#inputAge").val("");
            $("#inputFamily").val("");
            $("#selectPerson").val("");
            $("#dropdownBuyerButton").html("Any");
            $("#dropdownGenderButton").html("Any");
            $("#dropdownMenuButton").html("Greater than");
            $("#dropdownPlantationButton").html("Any");

            controller.deselectEnslavedPerson(); //de-select person and reset data
            var combinedFilter = getCombinedFilter();
            chord.refreshVisualization(combinedFilter);
            updateFilterConditionsForSelect();

        });
        $('#inputAge').keyup(function(){
            ageSearchTerm = $("#inputAge").val(); //get age as typed
        });
        $('#inputAge').change(function() {
            ageSearchTerm = $("#inputAge").val(); //get age as typed
            updateFilterConditionsForSelect();
        });
        $('#inputFamily').keyup(function(){
            familySearchTerm = $("#inputFamily").val(); //get family filter characters as typed
        });
        $('#inputFamily').change(function() {
            familySearchTerm = $("#inputFamily").val(); //get family filter as typed
            updateFilterConditionsForSelect();
        });
        $('#selectPerson').keyup(function(){
            selectPersonSearchTerm = $("#selectPerson").val(); //get name of person to select as typed
        });
        $('#selectPerson').change(function() {
            selectPersonSearchTerm = $("#selectPerson").val(); //get name of person to select as typed
        });
        d3v2.select("input[type=range]").on("change", function() { //change multiplier based on scale
            chord.multiplier = this.value / 100;
            chord.refreshVisualization(null);
        });
        $(".diagram-container-right").css({ //set diagram container right height
            'height': ($(".diagram-container").height() + 'px')
        });
    //    Dropdown Age - set based on selected option
        $('#dropdownOptionEquals').click(function () {
            ageFilterOption = "equals";
            $("#dropdownMenuButton").html("Equals");
            updateFilterConditionsForSelect();
        });
        $('#dropdownOptionGreaterThan').click(function () {
            ageFilterOption = "greaterThan";
            $("#dropdownMenuButton").html("Greater than");
            updateFilterConditionsForSelect();
        });
        $('#dropdownOptionLessThan').click(function () {
            ageFilterOption = "lessThan";
            $("#dropdownMenuButton").html("Less than");
            updateFilterConditionsForSelect();
        });
    //    Dropdown Plantation - set based on selected option
        $('#dropdownOptionAnyPlantation').click(function () {
            plantationFilterOption = "any";
            $("#dropdownPlantationButton").html("Any");
            updateFilterConditionsForSelect();
        });
        $('#dropdownOptionWhiteMarsh').click(function () {
            plantationFilterOption = "White Marsh";
            $("#dropdownPlantationButton").html("White Marsh");
            updateFilterConditionsForSelect();
        });
        $('#dropdownOptionThomasMonor').click(function () {
            plantationFilterOption = "St. Thomas's Manor";
            $("#dropdownPlantationButton").html("St. Thomas's Manor");
            updateFilterConditionsForSelect();
        });
        $('#dropdownOptionSInigoes').click(function () {
            plantationFilterOption = "St. Inigoes";
            $("#dropdownPlantationButton").html("St. Inigoes");
            updateFilterConditionsForSelect();
        });
        $('#dropdownOptionNewtown').click(function () {
            plantationFilterOption = "Newtown";
            $("#dropdownPlantationButton").html("Newtown");
            updateFilterConditionsForSelect();
        });
    //    Dropdown Buyer - set based on selected option
        $('#dropdownOptionAnyBuyer').click(function () {
            buyerFilterOption = "any";
            $("#dropdownBuyerButton").html("Any");
            updateFilterConditionsForSelect();
        });
        $('#dropdownOptionJBatey').click(function () {
            buyerFilterOption = "Jesse Batey";
            $("#dropdownBuyerButton").html("Jesse Batey");
            updateFilterConditionsForSelect();
        });
        $('#dropdownOptionHJohnson').click(function () {
            buyerFilterOption = "Henry Johnson";
            $("#dropdownBuyerButton").html("Henry Johnson");
            updateFilterConditionsForSelect();
        });
        $('#dropdownOptionOtherBuyer').click(function () {
            buyerFilterOption = "";
            $("#dropdownBuyerButton").html("Other");
            updateFilterConditionsForSelect();
        });
    //    Gender - set based on selected option
        $('#dropdownOptionAnyGender').click(function () {
            genderFilterOption = "any";
            $("#dropdownGenderButton").html("Any");
            updateFilterConditionsForSelect();
        });
        $('#dropdownOptionMale').click(function () {
            genderFilterOption = "male";
            $("#dropdownGenderButton").html("Male");
            updateFilterConditionsForSelect();
        });
        $('#dropdownOptionFemale').click(function () {
            genderFilterOption = "female";
            $("#dropdownGenderButton").html("Female");
            updateFilterConditionsForSelect();
        });
    //    Katerine Jackson checkbox - set based on action
        $('#katharineJacksonCheck').click(function() {
            filterKatharineJackson = !filterKatharineJackson;
            updateFilterConditionsForSelect();
        });
        $( "#katharineJacksonCheck" ).prop( "checked", filterKatharineJackson );
    //    Search Filter Conditions - set based on action
        $('#searchWithinFilterConditionsCheck').click(function() {
            searchWithinFilterConditions = !searchWithinFilterConditions;
            updateFilterConditionsForSelect();
        });
        $( "#searchWithinFilterConditionsCheck" ).prop( "checked", searchWithinFilterConditions );

        //Magnify checkbox - set based on action
        chord.magnifyNamesConditionBox = true;
        $('#magnifyNamesConditionBox').click(function() {
            chord.magnifyNamesConditionBox = !chord.magnifyNamesConditionBox;
        });
        $( "#magnifyNamesConditionBox" ).prop( "checked", chord.magnifyNamesConditionBox );
    });
    function getCombinedFilter() { //build filter for data based on options on right side
        var ageFilter = function (p) {
            if (ageSearchTerm === "")
                return true;
            else {
                if (p.age !== "") {
                    if (ageFilterOption === "greaterThan")
                        return Number(p.age) > Number(ageSearchTerm);
                    else if (ageFilterOption === "lessThan")
                        return Number(p.age) < Number(ageSearchTerm);
                    else
                        return Number(p.age) === Number(ageSearchTerm);
                }
                else
                    return false;
            }
        };
        var genderFilter = function (p) {
            if (genderFilterOption === "any")
                return true;
            else {
                return p.gender === genderFilterOption;
            }
        };
        var buyerFilter = function (p) {
            if (buyerFilterOption === "any")
                return true;
            else
                return p.buyer_name === buyerFilterOption;
        };
        var plantationFilter = function (p) {
            if (plantationFilterOption === "any")
                return true;
            else
                return p.farm_name === plantationFilterOption;
        };

        //Family filter
        var familyCSVData = csvJSON(chord.originalData).map(function(p) {p.id = Number(p.id); return p;});
        var familyIds = (familyCSVData.filter(function (p) { return p.last_name === familySearchTerm }))[0];
        var familyArray = (familyIds) ? family.findFamilySetForId(familyIds.id) : [];

        var directFamilyLineFilter = function (p) {
            return (familyArray.length > 0 && familySearchTerm !== "") ? containsObject(p.id, familyArray) : true;
        };

        var combinedFilter = function (p) { //build a filter function that is a combination of all the others above
            return ageFilter(p) && genderFilter(p) && directFamilyLineFilter(p) && buyerFilter(p) && plantationFilter(p);
        };
        return combinedFilter;
    }
    function updateFilterConditionsForSelect() { //on filter conditions update - reset names for autocompletes and reset all input variables to be ""
        csvData = csvJSON(chord.originalData).map(function(p) {p.id = Number(p.id); return p;});

        var combinedFilter = getCombinedFilter();

        if (searchWithinFilterConditions && combinedFilter) {
            csvData.filter(combinedFilter);
            var names = csvData.filter(combinedFilter).map(function(p) {return p.full_name});
            $("#selectPerson").typeahead('destroy').typeahead({ source:names });
        }
        else {
            // csvData = csvJSON(chord.originalData).map(function(p) {p.id = Number(p.id); return p;});
            var names = csvData.map(function(p) {return p.full_name});
            $("#selectPerson").typeahead('destroy').typeahead({ source:names });
        }
    }
    function setFilterControlVariables() { //set intial filter variables
        //typeahead family filter
        csvData = csvJSON(chord.originalData).map(function(p) {p.id = Number(p.id); return p;});
        var names = csvData.map(function(p) {return p.last_name}).reduce(function(p,c,i,a){
                if (p.indexOf(c) == -1) p.push(c);
                else p.push('')
                return p;
            }, []);
        $("#inputFamily").typeahead({ source:names });

        //show otherData checkbox
        $( "#otherCheckbox" ).prop( "checked", chord.showOtherData );
        updateFilterConditionsForSelect();
    }
    controller.onDataLoad = function() { //on data load for first time hide map and get family data
        d3v2.select("#mapContainer").classed("hidden", true);
        d3v2.select("#mapContainer").classed("opacity0", true);
        family.processFamilyData();
        setFilterControlVariables();
    };
    controller.selectEnslavedPerson = function(personData) { //select person
        // if (enjoyhint_instance)
        //     enjoyhint_instance.trigger('next');
        var name = personData.full_name.substr(personData.full_name.indexOf(" ") + 1); //get persons name to set to text of input
        selectPersonSearchTerm = name;
        $("#selectPerson").val(name);
        mapData.mapDestinationPlantation = personData.destination; //get data based on selection
        mapData.mapSourcePlantation = personData.origin;
        mapData.updateMap(); //update map
        chord.selectNodeWithData(personData); //update roots wheel
    };
    controller.deselectEnslavedPerson = function() {
        $("#selectPerson").val(""); //undo all data and update visualizations
        mapData.mapDestinationPlantation = "";
        mapData.mapSourcePlantation = "";
        mapData.updateMap();
        chord.deselectAllNodes();
    };
    controller.didUpdateMultiplier = function () { //on multiplier change change slider value to keep in line with actual multiplier
        $(document).ready(function() {
            document.getElementById("multiplierRange").value = chord.multiplier * 100;
        });
    };
}
controllerMain();