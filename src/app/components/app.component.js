//AppComponent

const template = `
<div class="app-component pt+++ pb+++">
	<div flex-container="row" flex-align="center">
		<div class="pb+">
			<lx-text-field lx-theme="dark" lx-fixed-label="true" lx-icon="coin" lx-label="Enter amount here...">
		        <input 
				type="number" 
				step="0.01"
				ng-pattern="/^[0-9]+(\.[0-9]{1,2})?$/"
				ng-model="$ctrl.valueFrom" 
				ng-change="$ctrl.calculate()">
		    </lx-text-field>
		</div>
	</div>
	<div flex-container="row" flex-column="12" flex-gutter="24">
		<div flex-item="5">
			<lx-select lx-theme="dark"
				ng-model="$ctrl.currencyFrom"
				ng-change="$ctrl.calculate()"
				lx-choices="$ctrl.currencies"
				lx-allow-clear="true"
				lx-display-filter="true"
				lx-fixed-label="true"
				lx-label="From currency...">
		        	<lx-select-selected>{{ $selected.name }}</lx-select-selected>
		        	<lx-select-choices>{{ $choice.name }}</lx-select-choices>
		    </lx-select>
		</div>
		<div flex-item="2">
			<div class="text-center pt+++">
				<lx-button ng-click="$ctrl.swap()" lx-type="icon" lx-size="l" lx-color="white"><i class="mdi mdi-swap-horizontal"></i></lx-button>
			</div>
		</div>
		<div flex-item="5">
			<lx-select lx-theme="dark"
				ng-model="$ctrl.currencyTo"
				ng-change="$ctrl.calculate()"
				lx-choices="$ctrl.currencies"
				lx-allow-clear="true"
				lx-display-filter="true"
				lx-fixed-label="true"
				lx-label="To currency...">
		        	<lx-select-selected>{{ $selected.name }}</lx-select-selected>
		        	<lx-select-choices>{{ $choice.name }}</lx-select-choices>
		    </lx-select>
		</div>
	</div>
	<div class="result text-center p+++ fs-display-4 tc-white-1">
		{{$ctrl.valueTo}}
	</div>
</div>
`;

class Controller {

	constructor(Socket, Currencies) {
		this.Socket = Socket;

		this.valueFrom = '';
		this.valueTo = 0;
		this.currencies = [];

		Socket.on('init', (data) => {
			this.data = data;
		});

		Socket.on('result', (data) => {
			this.valueTo = data;
		});

		Currencies.query({}, (data) => {
			this.currencies = data;
			console.log(data);
		});
	}

	calculate() {
		if(this.currencyFrom && this.currencyTo && !isNaN(parseFloat(this.valueFrom))){
			this.Socket.emit('calculate', {
				value: this.valueFrom,
				from: this.currencyFrom.id,
				to: this.currencyTo.id
			});
		}else{
			this.valueTo = 0;
		}
	}

	swap() {
		[this.currencyFrom, this.currencyTo] = [this.currencyTo, this.currencyFrom]
	}

}

export default {
	transclude: true,
	template: template,
	controller: Controller
}