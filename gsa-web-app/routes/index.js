var express = require('express');
var router = express.Router();

var slave_controller = require('../controllers/slaveController.js');

/* GET home page. */
router.get('/', slave_controller.index);

/* GET request for list of all Slave items. */
router.get('/slaves', slave_controller.slave_list);

/* GET request for creating a Slave. NOTE This must come before routes that display Slave (uses id) */
router.get('/slave/create', slave_controller.slave_create_get);

/* POST request for creating Slave. */
router.post('/slave/create', slave_controller.slave_create_post);

/* GET request to delete Slave. */
router.get('/slave/:id/delete', slave_controller.slave_delete_get);

// POST request to delete Slave
router.post('/slave/:id/delete', slave_controller.slave_delete_post);

/* GET request to update Slave. */
router.get('/slave/:id/update', slave_controller.slave_update_get);

// POST request to update Slave
router.post('/slave/:id/update', slave_controller.slave_update_post);

/* GET request for one Slave. */
router.get('/slave:id', slave_controller.slave_detail);

module.exports = router;
