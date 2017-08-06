const express = require('express'),
	http = require('http'),
	path = require('path'),
	socketio = require('socket.io');


const port = process.env.PORT || 3000;

var app = express();
var server = require('http').Server(app);
var socket = require('socket.io')(server);


app.use(express.static(path.join(__dirname, 'public')));

//enable jade
app.set('view engine', 'jade');

//main route
app.get('/', function(req, res) {
	res.render('index', { title: 'Currency Calculator', copyright: 'Ihor Mykhalchenko &copy; 2017' });
});

var currencies = [{
		id: 0,
		name: 'UAH',
		rate: 1
	},
	{
		id: 1,
		name: 'USD',
		rate: 25.8858
	},
	{
		id: 2,
		name: 'EUR',
		rate: 30.7005
	},
	{
		id: 3,
		name: 'RUB',
		rate: 0.4261
	}
];

app.get('/currencies', function(req, res) {
	res.send(currencies);
});


function calculate(data) {
	let rateFrom = 1;
	let rateTo = 1;
	currencies.forEach((cur) => {
		if (cur.id === data.from) rateFrom = cur.rate;
		if (cur.id === data.to) rateTo = cur.rate;
	});
	let result = Math.floor(parseFloat(data.value) * (rateFrom / rateTo) * 100) / 100;
	if (isNaN(result)) {
		socket.emit('result', 'Incorrect value!');
	} else {
		socket.emit('result', result);
	}
}

socket.on('connection', function(socket) {
	console.log('a user connected');

	socket.emit('init', 'socket test data');

	socket.on('calculate', function(data) {
		calculate(data);
	});



	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
});


server.listen(port, function() {
	console.log('listening on *:' + port);
});