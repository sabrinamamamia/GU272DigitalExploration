var jsonfile = require('jsonfile')
var readfile = 'gu272-data.json'
var writefile = 'filtered-gu272-data.json'

// Recursively replaces child id with objects
function setChildren(json, id) {
	console.log(json[id])
	for (var i in json[id].children) {
		console.log(json[id].children[i])
		// console.log(json[id].children[i] - 1)
		json[id].children[i] = json[json[id].children[i] - 1];
		// json[id].children[i].parent = json[id];
		console.log(json[id].children[i])
		if (json[id].children[i].children) {
			setChildren(json, json[id].children[i].id);
		}
	}
}

filteredJson = []
jsonfile.readFile(readfile, function(err, json) {
  // console.dir(json)
	if (err) return console.error(err);	
	for (var id in json) {
		// if (json[id].children) {
		// 	setChildren(json, id);
		// }
		// console.log(json[id])
		if (json[id].children.length >= 3 && json[id].parent == null) {
			filteredJson.push(json[id]);
		}
	}
	//Swapped 2 elements to make viz trees fit on page
	var temp = filteredJson[1];
	filteredJson[1] = filteredJson[2];
	filteredJson[2] = temp;

	jsonfile.writeFile('filtered-gu272-data.json', filteredJson, function(err) {
		console.log(err);
	});
});



