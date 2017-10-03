magmoapp.controller("manageUsercntrl", [
		'$scope'
		, 'toaster'
		, 'apiService'
		, '$filter'
		, function ($scope, toaster, apiService, $filter) {
        $scope.hidelist = false;
        $scope.gessolist = [];
        $scope.action = 'ADD';
        $scope.ssolist = [];
        $scope.getSSOListFromDB = function () {
            apiService.getSSOList().then(function (ssolist) {
                $scope.ssolist = ssolist;
            }, function (err) {
                console.log(err);
            });
        };
        $scope.getSSOListFromDB();
        $scope.checkUser = function (sso) {
            if ($scope.findIfExistinguser(sso)) {
                $scope.fetchUserDetails(sso);
            }
            console.log(sso);
            $scope.selectedUser = sso;
            $scope.hidelist = true;
        };
        $scope.fetchUserDetails = function (sso) {
            apiService.fetchUserDetails(sso).then(function (res) {
                var user = res[0];
                $scope.selectedUser = user.sso;
                $scope.group_id = user.group_id;
                $scope.is_active = user.is_active;
                $scope.is_admin = user.is_admin;
                $scope.disableForm = false;
            }, function (err) {
                console.log(err);
                toaster.pop('error', "Error", "Some Error, Please Try Later");
            });
        };
        $scope.serachGEuser = function () {
            $scope.disableForm = false;
        };
        $scope.checkForGeUser = function (selectedUser) {
            console.log("checkForGeUser", selectedUser);
            $scope.group_id = undefined;
            $scope.is_active = true;
            $scope.is_admin = false;
            $scope.gessolist = $filter('filter')($scope.ssolist, selectedUser);
            $scope.hidelist = false;
            $scope.disableForm = true;
        };
        $scope.AddOrModifyuser = function () {
            if (!$scope.selectedUser) {
                toaster.pop('error', "Error", "Enter User's SSO");
                return;
            }
            if (!$scope.group_id) {
                toaster.pop('error', "Error", "Select a Role for user");
                return;
            }
            $scope.findIfExistinguser($scope.selectedUser);
            var data = {
                "sso": $scope.selectedUser
                , "group_id": parseInt($scope.group_id)
                , "is_admin": $scope.is_admin
                , "is_active": $scope.is_active
            };
            if ($scope.action === 'ADD') {
                apiService.addnewUser(data).then(function (res) {
                	console.log(res);
                    toaster.pop('info', "","User Added Successfully...");
                    $scope.resetScreen();
                    $scope.getSSOListFromDB();
                }, function (err) {
                    console.log(err);
                    toaster.pop('error', "Error", "Some Error, Please Try Later");
                });
            }
            else if ($scope.action === 'EDIT') {
                apiService.updateExistingUser(data).then(function (res) {
                    toaster.pop('info', "", res.description);
                    $scope.resetScreen();
                }, function (err) {
                    console.log(err);
                    toaster.pop('error', "Error", "Some Error, Please Try Later");
                });
            }
        };
        $scope.findIfExistinguser = function (sso) {
            var usso = parseInt(sso);
            var userfound = false;
            $scope.ssolist.forEach(function (existingsso) {
                if (existingsso === usso) {
                    userfound = true;
                    $scope.action = 'EDIT';
                }
            });
            if (!userfound) {
                $scope.action = 'ADD';
            }
            return userfound;
        };
        $scope.resetScreen = function () {
            $scope.selectedUser = undefined;
            $scope.group_id = undefined;
            $scope.is_active = true;
            $scope.is_admin = false;
            $scope.disableForm = true;
        };
        $scope.resetScreen();
		}]);