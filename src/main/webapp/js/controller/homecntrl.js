magmoapp.controller("homecntrl", ['$scope', 'apiService', '$state', 'toaster', '$interval', function ($scope, apiService, $state, toaster, $interval) {
    $scope.action = 'moniterMagnet';
    $scope.ETAcellList = [];
    $scope.FPGcellList = [];
    $scope.FGAcellList = [];
    $scope.userRole = $scope.getUserRole();
    if (!$scope.userRole) {
        $state.go('/');      
    }
    $scope.getCellList = function (firstTime) {
    	if($scope.userRole){
    		apiService.getCellList(firstTime,$scope.userRole.groupName).then(function (res) {
                console.log(res);
                $scope.createCellList(res);
            }, function (error) {
                console.log(error);
            });
    	}        
    };
    $scope.createCellList = function (cellList) {
        $scope.ETAcellList = [];
        $scope.FGAcellList = [];
        if(cellList){
        cellList.forEach(function (cellObj) {
            if (cellObj.cell_type === 'ETA') {
                $scope.ETAcellList.push(cellObj);
            }
            else if (cellObj.cell_type === 'FGA') {
                $scope.FGAcellList.push(cellObj);
            }
         
        });
        }
    };
    $scope.getCellDetails = function (cellObj) {
        var obj = {
            display_name: cellObj.display_name
            , cellId: cellObj.cell_id
            , color: cellObj.color
            , magnetserial: cellObj.magnet_serial_number
            , notification: cellObj.cell_level_notification_status
        };
        if ($scope.action === 'moniterMagnet') {
            $state.go('monitorMagnet', obj);	
        }
        else if ($scope.action === 'setThreshold') {
            $state.go('threshold', obj);
        }
    };
    $scope.getCellList(true);
    var intervalPromise = $interval(function () {
        $scope.getCellList(false);
    }, 1 * 60 * 1000);
    $scope.$on('$destroy', function () {
        if (intervalPromise) {
            $interval.cancel(intervalPromise);
        }
    });    
		}]);