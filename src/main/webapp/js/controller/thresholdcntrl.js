magmoapp.controller("thresholdcntrl", [
						'$scope'
						, 'apiService'
						, 'toaster'
						, '$state'
						, '$stateParams'
						,
    function ($scope, apiService, toaster, $state, $stateParams) {
        $scope.MagnetDetail = {};
        $scope.MagnetDetail.display_name = $stateParams.display_name;
        $scope.MagnetDetail.color = $stateParams.color;
        $scope.MagnetDetail.cell_id = $stateParams.cellId;
        $scope.MagnetDetail.magnet_serial_number = $stateParams.magnetserial;
        $scope.MagnetDetail.cell_level_notification_status = $stateParams.notification === 'true' ? true : false;
        $scope.originalSensorThresholdList;
        $scope.userselectedRow;
        $scope.userRole = $scope.getUserRole();
        if (!$scope.userRole) {
            $state.go('/');
        }
        apiService.viewcellThresholdList($scope.MagnetDetail.cell_id, $scope.userRole.groupName, true).then(function (res) {console.log(res);
            $scope.originalSensorThresholdList = angular.copy(res.sensorList);
            $scope.senserlist = res.sensorList;
        }, function (err) {
            console.log(err);
            toaster.pop('error', "Error", "Some Error, Please Try Later");
        });
        $scope.updateNotificationSatus = function () {
            console.log($scope.MagnetDetail);
            apiService.setcelllevelnotification(
	[{cell_level_notification_status: $scope.MagnetDetail.cell_level_notification_status,
                    cell_name: $scope.MagnetDetail.cell_id
	}]).then(function (res) {
                console.log(res);
                if ($scope.MagnetDetail.cell_level_notification_status) {
                    toaster.pop('success', "", "Notification Enabled Successfully");
                } else {
                    toaster.pop('success', "", "Notification Disabled Successfully");
                }
            }, function (err) {
                console.log(err);
                toaster.pop('error', "Error", "Some Error, Please Try Later");
                setTimeout(function () {
                    $scope.MagnetDetail.cell_level_notification_status = !$scope.MagnetDetail.cell_level_notification_status;
                    $scope.$digest();
                }, 1000);
            });
        };
        $scope.updateSensorThresholdList = function () {
            var changedSensorList = [];
            $scope.originalSensorThresholdList.forEach(function (originalSensorObj, key) {
                if (originalSensorObj.operand !== $scope.senserlist[key].operand || originalSensorObj.value !== $scope.senserlist[key].value) {
                    changedSensorList.push($scope.senserlist[key]);
                }
            });
            console.log("changedSensorList", changedSensorList);
            apiService.setcellThresholdList(changedSensorList).then(function (res) {
                console.log(res);
                toaster.pop('success', "", "Threshold Values Updated Successfully");
            }, function (err) {
                console.log(err);
                toaster.pop('error', "Error", "Some Error, Please Try Later");
            });
        };
        $scope.selectRow = function (index) {
            $scope.userselectedRow = index;
        };
						}]);