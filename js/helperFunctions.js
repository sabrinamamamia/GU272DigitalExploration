//Helper functions
String.prototype.replaceAll = function(search, replacement) { //replace all of one character with another in a string
    var target = this;
    return target.split(search).join(replacement);
};
function cleanName(name) { //Clean name for data visualization so that it makes for a good id
    return name.replaceAll(".", "").replaceAll(" ", "").replaceAll("\'", "").replaceAll("?", "").replaceAll("[", "").replaceAll("]", "");
}
function cleanDataLine(obj) { //sets origin and destination with cleaned data
    obj.origin = cleanName(obj.farm_name);
    obj.destination = cleanName(obj.buyer_name);
    return obj;
}
function csvJSON(csv){ //Convert CSV to JSON
    var lines = csv.split("\n");
    var result = [];
    var headers = lines[0].split(",");

    lines.map(function(line, indexLine){
        if (indexLine < 1) return // Jump header line

        var obj = {};
        var currentline = line.split(",");

        headers.map(function(header, indexHeader){
            obj[header] = currentline[indexHeader]
        });

        result.push(obj)
    });

    result.pop(); // remove the last item because undefined values

    return result // JavaScript object
}
function containsObject(obj, list) { //Check if an array contains an object
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }

    return false;
}