angular.module('travellite', ['ngRoute'])
	.config(davetunRouter);

function davetunRouter($routeProvider){
	$routeProvider
		.when('/', {templateUrl: 'partials/homepage.html'})
		.when('/login', {templateUrl: 'partials/login.html'})
		.when('/register', {templateUrl: 'partials/register.html', controller : 'registerCtrl'})
		.when('/forgotpassword', {templateUrl: 'partials/forgotpassword.html'})
		.when('/schedule', {templateUrl: 'partials/schedule.html', controller: 'scheduleCtrl'})
		.when('/settings', {templateUrl: 'partials/settings.html'})
		.when('/newuser', {templateUrl: 'partials/newuser.html'})
		.when('/rights', {templateUrl: 'partials/rights.html'})
		.when('/dashboard', {templateUrl: 'partials/dashboard.html'})
		.when('/statement', {templateUrl: 'partials/statement.html'})
		.when('/rptcollections', {templateUrl: 'partials/rptcollections.html'})
		.when('/smsbalance', {templateUrl: 'partials/smsbalance.html'})
		.when('/changepassword', {templateUrl: 'partials/changepassword.html'})
		.when('/clientinfo', {templateUrl: 'partials/clientinfo.html'})
		.when('/searchlist', {templateUrl: 'partials/searchlist.html'});				
		//rptcollections
}