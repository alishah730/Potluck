magmoapp.controller("assignMagnetcntrl", [
		'$scope'
		, 'apiService'
		, '$state'
		, '$stateParams'
		, 'toaster'
		, function ($scope, apiService, $state, $stateParams, toaster) {
        $scope.cellId = $stateParams.cellId;
        $scope.color = $stateParams.color;
        $scope.assignMagnet = function () {
            if (!$scope.magnetSerialNo) {
                toaster.pop('error', "Error", "Enter Magnet Serial No.");
            }
            else {
                var data = {
                    "magnet_serial_number": $scope.magnetSerialNo
                    , "cell_id": $scope.cellId
                };
                apiService.assignMagnet(data).then(function (res) {
                    console.log(res);
                }, function (err) {
                    console.log(err);
                    toaster.pop('error', "Error", "Some Error, Please Try Later");
                });
            }
        };
		}]);