magmoapp.controller('mainController', [
						"$scope"
						, 'apiService'
						, '$rootScope'
						, '$state'
						, '$http'
						, '$location'
						, '$cookies'
						, 'LocalStorageService', function ($scope, apiService, $rootScope, $state, $http, $location, $cookies, LocalStorageService) {
        $scope.HeaderText = "Home";
        $scope.atHomePage = false;
        $scope.UserRole;
        $scope.navPropObj = {
            currentState: undefined
            , previousState: undefined
            , headerObj: {
                '/': ''
                , 'home': "Home"
                , 'threshold': 'Magnet Threshold'
                , 'manageUser': 'User Management'
                , 'monitorMagnet': 'Monitor Magnet'
                , 'assignMagnet': 'Magnet Assignment'
            }
        };
        $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
            $scope.navPropObj.currentState = toState.name;
            $scope.navPropObj.previousState = fromState.name;
            $scope.HeaderText = $scope.navPropObj.headerObj[$scope.navPropObj.currentState];
            if ($scope.navPropObj.currentState === 'home') {
                $scope.atHomePage = true;
            }
            else if ($scope.navPropObj.currentState === 'errorPage') {
                $scope.atErrorPage = true;
            }
            else {
                $scope.atHomePage = false;
                $scope.atErrorPage = false;
            }
            if ($scope.navPropObj.currentState === '/' || $scope.navPropObj.currentState === "errorPage") {
                $scope.hidenavbar = true;
            }
            else {
                $scope.hidenavbar = false;
            }
            console.log(event, toState, toParams, fromState, fromParams);
        });
        $scope.goback = function () {
            $state.go('home');
        };
        $scope.logout = function () {
            console.log('go for logout now..');
            console.log("cookie before ", document.cookie);
            document.cookie.split(";").forEach(function (c) {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
            console.log("cookie after ", document.cookie);
            apiService.logout().then(function (res) {
                console.log("logout res", res);
                $scope.logoutHandler();
            }, function (error) {
                console.log("logout error", error);
                $scope.logoutHandler();
            });
            LocalStorageService.resetLocalStorageData("X-XSRF-TOKEN");
            location.href = "https://ssologin.ssogen2.corporate.ge.com/logoff/logoff.jsp";
        };
        $scope.logoutHandler = function () {
            var cookies = $cookies.getAll();
            console.log(cookies);
            angular.forEach(cookies, function (v, k) {
                console.log(v + "::" + k);
                $cookies.remove(k);
            });
        };
        $scope.goToHomeScreen = function () {
            $state.go('home');
        };
        $scope.getUserRole = function () {
            return $scope.UserRole;
        };
        $scope.setUserRole = function (obj) {
            $scope.UserRole = obj;
        };
        $scope.ImageCollection = (function () {
            var imageArray = [];
            var imagesUrls = ['lessthanNotSelected.png'
										, 'greaterthanSelected.png'
										, 'greaterthanUnselected.png'
										, 'lessthanSelected.png'
										, 'Radio_selected.png'
										, 'Radio_unselected.png'
										, 'iSign.png'];
            var setImage = function (path) {
                var img = new Image();
                img.src = path;
                img.setAttribute("style", "display:none;");
                return img;
            };
            imagesUrls.forEach(function (url) {
                imageArray.push(setImage("../images/" + url));
            });
            return imageArray;
        })();
}]);