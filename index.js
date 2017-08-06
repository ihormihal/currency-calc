const express = require('express'),
	fs = require("fs"),
	http = require('http'),
	path = require('path'),
	socketio = require('socket.io');

//create server and socket
const port = process.env.PORT || 3000;
var app = express();
var server = require('http').Server(app);
var socket = require('socket.io')(server);

//enable statics (js,css ets...)
app.use(express.static(path.join(__dirname, 'public')));

//enable jade
app.set('view engine', 'jade');


//read rates from file
var ratesJson = fs.readFileSync('./data/rates.json');
var rates = JSON.parse(ratesJson).rates;
var currencies = [];
for (name in rates) {
	currencies.push({
		id: name,
		name: name,
		rate: rates[name]
	});
}


//main route
app.get('/', function(req, res) {
	res.render('index', { title: 'Currency Calculator', copyright: 'Ihor Mykhalchenko &copy; 2017' });
});
//route for json
app.get('/currencies', function(req, res) {
	res.send(currencies);
});


//calculation function
function calculate(data, s) {
	let rateFrom = 1;
	let rateTo = 1;
	currencies.forEach((cur) => {
		if (cur.id === data.from) rateFrom = cur.rate;
		if (cur.id === data.to) rateTo = cur.rate;
	});
	let result = Math.floor(parseFloat(data.value) * (rateTo / rateFrom) * 100) / 100;
	if (isNaN(result)) {
		s.emit('result', 'Incorrect value!');
	} else {
		s.emit('result', result);
	}
}

//socket
socket.on('connection', function(s) {
	s.emit('init', 'socket test data');

	s.on('calculate', function(data) {
		calculate(data, s);
	});

	s.on('disconnect', function() {
		console.log('user disconnected');
	});
});

//run server
server.listen(port, function() {
	console.log('listening on *:' + port);
});