var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Plantation = new Schema({
	plantation_name: {type: String}
	loc: {type: [Number], index: '2d'}
});

module.exports = mongoose.model('Plantation', Plantation);