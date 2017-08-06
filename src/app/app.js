//import angular from 'angular';

import Services from './services';
import AppComponent from './components/app.component';


const app = angular.module('app', ['Services','lumx']);

app.component('appComponent', AppComponent);
