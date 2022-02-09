var mongoose = require('mongoose');

const connectionString = "mongodb+srv://CharmZhang:Charm1ngCharm@cluster0.wbytm.mongodb.net/ricebook?retryWrites=true&w=majority";

if (process.env.MONGOLAB_URI) {
	connectionString = process.env.MONGOLAB_URI;
}

mongoose.connect(connectionString, { useNewUrlParser: true });

mongoose.connection.on('connected', function() {
	console.log('Mongoose connected to ' + connectionString);
})
mongoose.connection.on('error', function(err) {
	console.error('Mongoose connection error: ' + err);
})
mongoose.connection.on('disconnected', function() {
	console.log('Mongoose disconnected');
})

process.once('SIGUSR2', function() {
	shutdown('nodemon restart', function() {
		process.kill(process.pid, 'SIGUSR2');
	})
})
process.on('SIGINT', function() {
	shutdown('app termination', function() {
		process.exit(0);
	})
})
process.on('SIGTERM', function() {
	shutdown('Heroku app shutdown', function() {
		process.exit(0);
	})
})

function shutdown(msg, callback) {
	mongoose.connection.close(function() {
		console.log('Mongoose disconnected through ' + msg);
		callback();
	})
}