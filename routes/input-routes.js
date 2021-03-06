'use strict';

var config = rootRequire('libs/config.js');
var inputs = rootRequire('controllers/input-controller');
var drivers = rootRequire('controllers/driver-controller');

module.exports = function(app) {
	app.route('/api/input')
		.get(inputs.status)
        .put(inputs.updateInputs)
        .post(inputs.addNewInput);

	app.route('/api/input/drivers')
		.get(drivers.inputDrivers)
		.post(drivers.saveInputDriver);

	app.route('/api/input/:inputPin').
		put(inputs.updateInput).
		delete(inputs.removeInput);

	// Finish by binding the user middleware
	app.param('inputPin', inputs.getInputById);
};