var Slave = require('../models/slave.js');
var async = require('async');

//Display count of Slaves
exports.index = function(req, res, next) {
	res.render('index');
};

// Display count of all records and list all records 
exports.slave_list = function(req, res, next) {
	async.parallel({
		slave_count: function(callback) {
			Slave.count(callback);
		},
		slave_list: function(callback) {
			Slave.find()
			.exec(callback);
		},
	}, function (err, results) {
		if (err) {return next(err);}
		res.render('slave_list', {title: 'GU272 Database', error: err, count: results.slave_count, slave_list: results.slave_list});
	});
};

// Display detail page for a specific Slave
exports.slave_detail = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Slave detail: ' + req.params.id);
};

// Display Slave create form on GET
exports.slave_create_get = function(req, res, next) {
    //res.render({'slave_form', {title: 'Create record'});
};

// Handle Slave create on POST
exports.slave_create_post = function(req, res, next) {
	req.checkBody('full_name', 'Full name must be alpha')

    res.send('NOT IMPLEMENTED: Slave create POST');
};

// Display Slave delete form on GET
exports.slave_delete_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Slave delete GET');
};

// Handle Slave delete on POST
exports.slave_delete_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Slave delete POST');
};

// Display Slave update form on GET
exports.slave_update_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Slave update GET');
};

// Handle Slave update on POST
exports.slave_update_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Slave update POST');
};