var magmoapp = angular.module('magmo', ['ui.router', 'toaster','ngCookies']);
magmoapp.config([
				'$stateProvider'
				, '$urlRouterProvider'
				, function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/login');
        $stateProvider.state('/login', {
            url: '/login'
            , templateUrl: 'view/login.html'
            , controller: "logincntrl"
        }).state('/', {
            url: '/'
            , templateUrl: 'view/login.html'
            , controller: "logincntrl"
        }).state('home', {
            url: '/home'
            , templateUrl: 'view/home.html'
            , controller: "homecntrl"
        }).state('threshold', {
            url: '/threshold/:display_name/:cellId/:color/:magnetserial/:notification'
            , templateUrl: 'view/threshold.html'
            , controller: "thresholdcntrl"
        }).state('manageUser', {
            url: '/manageUser'
            , templateUrl: 'view/manageUser.html'
            , controller: "manageUsercntrl"
        }).state('monitorMagnet', {
            url: '/monitorMagnet/:display_name/:cellId/:color/:magnetserial/:notification'
            , templateUrl: 'view/monitorMagnet.html'
            , controller: "monitorMagnetcntrl"
        }).state('assignMagnet', {
            url: '/assignMagnet/:cellId/:color/:magnetserial/:notification'
            , templateUrl: 'view/assignMagnet.html'
            , controller: "assignMagnetcntrl"
        }).state('errorPage', {
            url: '/errorPage'
            , templateUrl: 'view/errorPage.html'
        });
				}]);