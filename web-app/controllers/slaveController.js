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
    res.render('slave_form', {title: 'Create record'});
};

// Handle Slave create on POST
exports.slave_create_post = function(req, res, next) {
	//TODO: Add data validation and sanitization methods here 
	req.checkBody('first_name', 'Slave name required').notEmpty();
	// req.checkBody('birthdate', 'Birthdate must be date in the form XXXX').isInt();
	// req.checkBody('age', 'Age must be date in the form XXXX').isInt();
	
	req.sanitize('first_name').escape();
	req.sanitize('first_name').trim();

	var errors = req.validationErrors();

	//Create slave object
	//TODO: Add back attrs like plantation_loc, id, fam key
	var slave = new Slave({
		full_name: req.body.full_name,
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		birthdate: req.body.birthdate,
		age: req.body.age,
		age_approx: req.body.age_approx,
		plantation_name: req.body.plantation_name,
		reference_url: req.body.reference_url,
		buyer_name: req.body.buyer_name,
		extra_info: req.body.extra_info,
		gender: req.body.gender,
		ship: req.body.ship
	});

	if (errors) {
		//Render form using error information
		res.render('slave_form', {title: 'Create record', slave: slave, errors: errors});
		return;
	}
	else {
		// Data from form is valid.
        //Check if Slave with same name already exists
        Slave.findOne({ 'first_name': req.body.first_name, 'last_name': req.body.last_name})
            .exec( function(err, found_slave) {
                 console.log('found_slave: ' + found_slave);
                 if (err) { return next(err); }
                 
                 if (found_slave) { 
                     //Slave exists, redirect to its detail page
                     //res.redirect(found_slave.url);
                     res.redirect('/slaves');
                 }
                 else {
                     slave.save(function (err) {
                       if (err) { return next(err); }
                       //Slave saved. Redirect to genre detail page
                       //res.redirect(genre.url);
                       res.redirect('/slaves');
                     });
                     
                 }
                 
             });
    }	
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