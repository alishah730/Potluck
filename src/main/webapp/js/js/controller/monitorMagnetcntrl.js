magmoapp.controller("monitorMagnetcntrl", [
						'$scope'
						, 'apiService'
						, '$filter'
						, '$interval'
						, '$stateParams'
						, 'toaster'
						,function ($scope, apiService, $filter, $interval, $stateParams, toaster) {
        $scope.MagnetDetail = {};
        $scope.MagnetDetail.display_name = $stateParams.display_name;
        $scope.MagnetDetail.color = $stateParams.color;
        $scope.MagnetDetail.cell_id = $stateParams.cellId;
        $scope.MagnetDetail.magnet_serial_number = $stateParams.magnetserial;
        $scope.MagnetDetail.cell_level_notification_status = $stateParams.notification === 'true' ? true : false;
        var previousColor = angular.copy($stateParams.color);
        $scope.cellName = "Cell_01";
        $scope.timeduration = '1';
        $scope.latestDatapointsRequest = [];
        $scope.selectindex = 1;
        var TimeInterval = 50000;
        var intervalPromise;
        $scope.sensorCurrentTimeSeriesList = [];
        $scope.senserLatestValue;
        $scope.userRole = $scope.getUserRole();
        $scope.senserlistObj = {};
        var startValue = '30mi-ago';
        var startValueLatestPoint = "30mi-ago";
        $scope.interval = '1mi';
        $scope.showSensorInGraph = function (senorObj) {
            $scope.selectedsensor = senorObj;
            $scope.getTimeSeries($scope.timeduration, false);
        };
        $("#loaderDiv").show();
        $scope.getSenserThreshold = function (firstTime, currentTime, latestPoint) {
            var data = {
                "startValue": startValue,
                "name": "",
                "filterAttrMap": "",
                "filterAttrValue": "",
                "interval": $scope.interval,
                "tagList": [],
                "fetchDataPoints": true
            }
            if (!firstTime) {
                data.startValue = currentTime;
                data.name = $scope.selectedsensor.tagName;
                data.tagList = $scope.tagList;
                data.fetchDataPoints = true;
            }
            if (latestPoint) {
                $("#loaderDiv").hide();
                data.fetchDataPoints = false;
            }
            apiService.getcellThresholdList($scope.MagnetDetail.cell_id + '/', $scope.userRole.groupName, false, data).then(function (res) {
                console.log(res);
                if (res.alarmStatus) {
                    $scope.MagnetDetail.color = res.alarmStatus;
                }
                var formattedList = $scope.formatThresholdSenorList(res, firstTime, latestPoint);
                var sortedlist = $filter('orderBy')(formattedList, 'riskIndicator', true);
//                if (firstTime) {
//                    $scope.selectedsensor = sortedlist[0];
//                }
                $scope.sensorCurrentTimeSeriesList = angular.copy(sortedlist);
                if (!latestPoint || $scope.prevDataEmpty) {
                    $scope.generateGraph();
                    $("#loaderDiv").hide();
                }

            }, function (err) {
                console.log(err);
                $("#loaderDiv").hide();
                toaster.pop('error', "Error", "Some Error, Please Try Later");
            });
        };
        $scope.getTimeSeries = function (timeduration) {
            $("#loaderDiv").show();
            $scope.selectedDuration = timeduration;
            $scope.interval = "1mi";
            var currentTime = "";
            if (timeduration === "1") {
                currentTime = "30mi-ago";
            }
            if (timeduration === "2") {
                currentTime = "60mi-ago";
            }
            if (timeduration === "3") {
                currentTime = '1440mi-ago';
            }
            if (timeduration === "4") {
                currentTime = "10080mi-ago";
                $scope.interval = "10mi";
            }
            $scope.getSenserThreshold(false, currentTime, false);
        };
        $scope.selectedduration = function (timeduration) {
            $scope.timeduration = timeduration;
            $scope.getTimeSeries(timeduration);
        };
        $scope.generateGraph = function (previousdata) {
            var mydata = [];
            if ($scope.selectedSensorDetails.values && $scope.selectedSensorDetails.values.length > 0) {
                $scope.prevDataEmpty = false;
                for (var i = 0; i < $scope.selectedSensorDetails.values.length; i++) {
                    if ($scope.selectedSensorDetails.values[i]) {
                        if ($scope.selectedSensorDetails.values[i][1] && ($scope.selectedSensorDetails.values[i][1] === true || $scope.selectedSensorDetails.values[i][1] === "true")) {
                            mydata.push([$scope.selectedSensorDetails.values[i][0]
         						, 1]);
                        } else if ($scope.selectedSensorDetails.values[i][1] && ($scope.selectedSensorDetails.values[i][1] === false || $scope.selectedSensorDetails.values[i][1] === "false")) {
                            mydata.push([$scope.selectedSensorDetails.values[i][0]
          						, 0]);
                        } else {
                            mydata.push([$scope.selectedSensorDetails.values[i][0]
         						, $scope.selectedSensorDetails.values[i][1]]);
                        }
                    }
                }
            } else {
                $scope.prevDataEmpty = true;
            }
            console.log(mydata);
            Highcharts.setOptions({
                global: {
                    useUTC: false
                }
            });
            Highcharts.stockChart('magmograph', {
                chart: {
                    events: {
                        load: function () {
                            var self = this;
                            $scope.$watch('senserLatestValue', function (newval, oldval) {
                                if (newval && newval.sensorValue) {
                                    console.log(newval, oldval);
                                    var x, y, series, yAxis;
                                    if (self.series && self.series[0] && newval) {
                                        series = self.series[0];
                                        yAxis = self.yAxis[0];
                                        x = (new Date(newval.timestamp)).getTime();
                                        y = newval.sensorValue;
                                    }
                                    console.log("series", series, x, y, newval.sensorValue);
                                    if (series && x && y) {
                                        series.addPoint([x, y], true, true);
                                    }
                                }
                            }, true);
                        }
                    },
                    zoomType: "x",
                    marginRight: 10,
                    marginTop: 0,
                    spacingBottom: 0
                },
                rangeSelector: {
                    buttons: [],
                    inputEnabled: false,
                    selected: 0
                },
                title: {
                    text: $scope.selectedsensor.name + ' data'
                },
                exporting: {
                    enabled: false
                },
                series: [{
                    name:  'Sensor Data',
                    data: mydata
                }]
            });
        };
        $scope.formatThresholdSenorList = function (thresoldResponse, first, latestPoint) {
            var screenThresholdList = [];
            $scope.tagList = thresoldResponse.tagList;
            if (latestPoint || first) {
                var sensorObj = {};
                if (thresoldResponse.selectedSensorDetails.values && thresoldResponse.selectedSensorDetails.values.length > 0) {
                    if (thresoldResponse.selectedSensorDetails.values[0][1] && (thresoldResponse.selectedSensorDetails.values[0][1] === true || thresoldResponse.selectedSensorDetails.values[0][1] === "true")) {
                        sensorObj.sensorValue = 1;
                        sensorObj.timestamp = thresoldResponse.selectedSensorDetails.values[0][0];
                    } else if (thresoldResponse.selectedSensorDetails.values[0][1] && (thresoldResponse.selectedSensorDetails.values[0][1] === false || thresoldResponse.selectedSensorDetails.values[0][1] === "false")) {
                        sensorObj.sensorValue = 0;
                        sensorObj.timestamp = thresoldResponse.selectedSensorDetails.values[0][0];
                    } else {
                        sensorObj.sensorValue = thresoldResponse.selectedSensorDetails.values[0][1];
                        sensorObj.timestamp = thresoldResponse.selectedSensorDetails.values[0][0];
                    }
                    $scope.senserLatestValue = sensorObj;
                }
            }
            if (!latestPoint || $scope.prevDataEmpty) {
                $scope.selectedSensorDetails = thresoldResponse.selectedSensorDetails;
            }
            var thresholdValue = 0;
            thresoldResponse.sensorList.forEach(function (thresholdObj) {
                var paramName = thresholdObj.tagName;
                if (thresholdObj.value && (thresholdObj.value === true || thresholdObj.value === "true")) {
                    thresholdValue = 1;
                } else if (thresholdObj.value && (thresholdObj.value === true || thresholdObj.value === "true")) {
                    thresholdValue = 0;
                } else {
                    thresholdValue = thresholdObj.value;
                }
                var obj = {
                    name: thresholdObj.sensors,
                    tagName: thresholdObj.tagName,
                    thresholdValue: thresholdValue,
                    sensorValue: $scope.senserlistObj[paramName.toUpperCase()] ? $scope.senserlistObj[paramName.toUpperCase()].value : "NA",
                    riskIndicator: thresholdObj.riskIndicator
                };
                if($scope.selectedSensorDetails.sensor===obj.tagName)
                {
                	$scope.selectedsensor = angular.copy(obj);
                }
                screenThresholdList.push(obj);
            });
            return screenThresholdList;
        };
        intervalPromise = $interval(function () {
            $scope.getSenserThreshold(false, startValueLatestPoint, true);
        }, TimeInterval);
        $scope.$on('$destroy', function () {
            if (intervalPromise) {
                $interval.cancel(intervalPromise);
            }
        });
        $scope.getSenserThreshold(true, false);
        $("#loaderDiv").hide();
       }]);