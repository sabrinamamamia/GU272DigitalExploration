//Set up mongoose connection
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var SlaveSchema = new Schema({
		id: {type: Number},
		family_key: {type: String},
		full_name: {type: String},
		first_name: {type: String},
		last_name: {type: String},
		birthdate: {type: Number},
		age: {type: Number},
		age_approx: {type: Boolean},
		plantation_name: {type: String},
		plantation_loc: {type: [Number], index: '2d'},
		reference_url: {type: String},
		buyer_name: {type: String},
		extra_info: {type: String},
		gender: {type: String, enum:['male', 'female']},
		ship: {type: Number}
});

// Virtual for slaves's URL
SlaveSchema
.virtual('url')
.get(function () {
  return '/slave/' + this._id;
});

module.exports = mongoose.model('Slave', SlaveSchema);

//module.exports.findOne({ full_name:'Sabrina Ma' }).remove().exec();
