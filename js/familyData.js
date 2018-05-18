var family = {familyData: null};

function familyMain() {
    //process family data
    family.processFamilyData = function() {
        $.getJSON("./data/familyData.json", function (allPeopleJSON) {
            var parents = allPeopleJSON.filter(function (p) { return p.parent === null }); //Get all parents (people without parents)
            parents = parents.map(function (p) { return Number(p.id) }); //Get an array of their id's
            parents = parents.map(function (p) { return constructJSONForID(p, allPeopleJSON) }); //construct a tree of enslaved persons based on parents
            parents = parents.map(function (p) { return flattenJSON(p) }); //flatten into an array of sets of ids
            family.familyData = parents;
        });
    };
    family.findFamilySetForId = function(id) {  //find family with person of id
        for (var i = 0 in family.familyData) { //loop through every family set in the array of familyData
            var fam = family.familyData[i];
            for (var j = 0 in fam) {
                var num = fam[j];
                if (num === id) {
                    return fam; //return the set
                }
            }
        }
    };
    function flattenJSON(json) { //flatten into an array of sets of ids
        if (json.children.length > 0) {
            var array = [json.id];
            for (var child in json.children) { //get id's of children to add to set - recursively flatten the tree
                child = json.children[child];
                array = array.concat(flattenJSON(child));
            }
            return array;
        }
        else {
            return [json.id]; //just one id
        }
    }
    function constructJSONForID(id, allPeopleJSON) {
        var obj = allPeopleJSON.filter(function(line) { return Number(line.id) === id }); //find the parent

        if (obj.length > 0) {
            obj = obj[0];
            var children = obj.children;
            // console.log(children);
            var newChildren = [];
            for (var child in children) { //loop through every child
                child = children[child];
                // console.log(child);
                newChildren.push(constructJSONForID(child, allPeopleJSON)); //add child to parent and get children of child
            }
            return {"id": id, "children": newChildren};
        }
        else if (obj.length > 1) {
            alert("problem");
        }
        else {
            return {"id": id, "children": []};
        }

    }
}
familyMain();