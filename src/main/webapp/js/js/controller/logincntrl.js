magmoapp.controller("logincntrl", [
		'$scope'
		, 'apiService'
		, '$state'
		, 'toaster'
		, 'LocalStorageService'
		, function ($scope, apiService, $state, toaster, LocalStorageService) {
        if (document.cookie) {
            var cookieArr = document.cookie.split('=');
            var index = cookieArr.indexOf("XSRF-TOKEN");
            if (index > -1) {
                var xsrf = cookieArr[+1];
                LocalStorageService.setLocalStorageData("X-XSRF-TOKEN", xsrf);
                console.log("X-XSRF-TOKEN from cookie", xsrf);
            }
        }
        apiService.authenticateUser().then(function (res) {
            console.log("authenticateCurrentuser", res);
            $scope.authenticateCurrentuser(res);
        }, function (err) {
            console.log(err);
            $scope.goToErrorPage();
        });
        $scope.authenticateCurrentuser = function (res) {
            if (res.actualEntity && typeof res.actualEntity === 'string' && res.actualEntity.indexOf('not authorized') > 0) {
                $scope.goToErrorPage();
            }
            else if (res.actualEntity && res.actualEntity.object && res.actualEntity.object.is_active === true) {
                console.log(res.actualEntity.object);
                var groupName ="";
                if(res.actualEntity.object.group_name){
                	if(res.actualEntity.object.group_name.indexOf("FGA")>-1){
                		groupName = "FGA";
                	}
                	else if(res.actualEntity.object.group_name.indexOf("ETA")>-1){
                		groupName = "ETA";
                	}
                }
                var userRole = {
                    groupId: res.actualEntity.object.group_id
                    , isAdmin: res.actualEntity.object.is_admin
                    ,groupName:groupName
                };
                $scope.setUserRole(userRole);
                var queryParameters = location.href.split('?')[1];
                var firebasetoken, diviceID;
                if (queryParameters) {
                    queryParameters.split('&').forEach(function (params) {
                        var param = params.split('=');
                        if (param[0] === 'firebasetoken') {
                            firebasetoken = param[1];
                        }
                        if (param[0] === 'device_id') {
                            diviceID = param[1].split('#/')[0];
                        }
                    });
                }
                var xsrf = res.actualEntity.csrfToken;
                LocalStorageService.setLocalStorageData("X-XSRF-TOKEN", xsrf);
                console.log("X-XSRF-TOKEN from response", xsrf);
                console.log("firebasetoken", firebasetoken, "diviceID", diviceID);
                if (firebasetoken && diviceID) {
                    var deviceObj = {
                        firebase_token: firebasetoken
                        , registered_device_id: diviceID
                        , sso: res.actualEntity.object.sso
                    };
                    console.log("registerDevice api called");
                    apiService.registerDevice(deviceObj).then(function (res) {
                        console.log("registerDevice success", res);
                    }, function (err) {
                        console.log("registerDevice error", err);
                    });
                }
                $state.go('home');
            }
            else {
                $scope.goToErrorPage();
            }
            console.log(res.actualEntity.description, res.actualEntity.status, res.actualEntity.object);
        };
        $scope.goToErrorPage = function () {
            $state.go('errorPage');
        };
		}]);