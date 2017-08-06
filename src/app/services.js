//import angular from 'angular';
import io from 'socket.io-client';
import ngResource from 'angular-resource';

const Services = angular.module('Services', ['ngResource']);


Services.factory('Socket', ($rootScope) => {
	var socket = io.connect();
	return {
		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					//console.log('apply');
					callback.apply(socket, args);
				});
				callback.apply(socket, args);
			});
		},
		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			})
		}
	};
});


// Services.factory('Currencies', Currencies);

// class Currencies {
//     constructor($resource) {
//         this.$resource = $resource;
//     }
// }
Services.factory('Currencies', ($resource) => $resource('currencies'));

export default Services;