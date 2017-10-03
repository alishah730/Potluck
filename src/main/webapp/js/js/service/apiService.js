magmoapp.service('apiService', [
		'apiConfigService'
		, 'commonHttpService'
		, function (apiConfigService, commonHttpService) {
        var getCellList = function (showLoader,userRole_group) {
            var configObj = commonHttpService.makeConfigObj(apiConfigService.cellList,userRole_group);
            return commonHttpService.apiMediator(configObj, showLoader);
        };
        var getCellDetails = function (cellNo) {
            var configObj = commonHttpService.makeConfigObj(apiConfigService.cellDetails, cellNo);
            return commonHttpService.apiMediator(configObj, false);
        };
        var getSSOList = function () {
            var configObj = commonHttpService.makeConfigObj(apiConfigService.ssoList);
            return commonHttpService.apiMediator(configObj, false);
        };
        var searchGEssoList = function (sso) {
            var configObj = commonHttpService.makeConfigObj(apiConfigService.geUserSSOlist, sso);
            return commonHttpService.apiMediator(configObj, false);
        };
        var addnewUser = function (data) {
            var configObj = commonHttpService.makeConfigObj(apiConfigService.addnewUser, null, data);
            return commonHttpService.apiMediator(configObj, true);
        };
        var updateExistingUser = function (data) {
            var configObj = commonHttpService.makeConfigObj(apiConfigService.updateExistingUser, null, data);
            return commonHttpService.apiMediator(configObj, true);
        };
        var fetchUserDetails = function (sso) {
            var configObj = commonHttpService.makeConfigObj(apiConfigService.fetchUserDetails, sso);
            return commonHttpService.apiMediator(configObj, true);
        };
        var getcellThresholdList = function (cellNo, role_group,showloader,data) {
            var configObj = commonHttpService.makeConfigObj(apiConfigService.viewSensorDetails, role_group+'/'+cellNo,data);
            return commonHttpService.apiMediator(configObj, showloader);
        };
        var viewcellThresholdList = function (cellNo, role_group,showloader) {
            var configObj = commonHttpService.makeConfigObj(apiConfigService.viewCellThresholdList, role_group+'/'+cellNo);
            return commonHttpService.apiMediator(configObj, showloader);
        };
        var setcellThresholdList = function (data) {
            var configObj = commonHttpService.makeConfigObj(apiConfigService.setcellThresholdList, null, data);
            return commonHttpService.apiMediator(configObj, true);
        };
        var assignMagnet = function (data) {
            var configObj = commonHttpService.makeConfigObj(apiConfigService.assignMagnet, null, data);
            return commonHttpService.apiMediator(configObj, true);
        };
        var authenticateUser = function () {
            var configObj = commonHttpService.makeConfigObj(apiConfigService.authenticateUser);
            return commonHttpService.apiMediator(configObj, true);
        };
        var getAggregationsRequest = function () {
            var configObj = commonHttpService.makeConfigObj(apiConfigService.getAggregations);
            return commonHttpService.apiMediator(configObj, true);
        };
        var getTags = function () {
            var configObj = commonHttpService.makeConfigObj(apiConfigService.getTags);
            return commonHttpService.apiMediator(configObj, true);
        };
        var queryForDatapoints = function (data) {
            var configObj = commonHttpService.makeConfigObj(apiConfigService.queryForDatapoints, null, data);
            return commonHttpService.apiMediator(configObj, true);
        };
        var queryForLatestDatapoints = function (data) {
            var configObj = commonHttpService.makeConfigObj(apiConfigService.queryForLatestDatapoints, null, data);
            return commonHttpService.apiMediator(configObj, false);
        };
        var setcelllevelnotification = function (data) {
            var configObj = commonHttpService.makeConfigObj(apiConfigService.setcelllevelnotification, null, data);
            return commonHttpService.apiMediator(configObj, false);
        };
        var registerDevice = function (data) {
            var configObj = commonHttpService.makeConfigObj(apiConfigService.registerDevice, null, data);
            return commonHttpService.apiMediator(configObj, false);
        };
        var logout = function (data) {
            var configObj = commonHttpService.makeConfigObj(apiConfigService.logout, null, data);
            return commonHttpService.apiMediator(configObj, false);
        };
        return {
            getCellList: getCellList
            , getCellDetails: getCellDetails
            , getSSOList: getSSOList
            , searchGEssoList: searchGEssoList
            , addnewUser: addnewUser
            , updateExistingUser: updateExistingUser
            , fetchUserDetails: fetchUserDetails
            , getcellThresholdList: getcellThresholdList
            , setcellThresholdList: setcellThresholdList
            , assignMagnet: assignMagnet
            , authenticateUser: authenticateUser
            , getAggregationsRequest: getAggregationsRequest
            , getTags: getTags
            , queryForDatapoints: queryForDatapoints
            , queryForLatestDatapoints: queryForLatestDatapoints
            , setcelllevelnotification: setcelllevelnotification
            , registerDevice: registerDevice
            , logout: logout
            ,viewcellThresholdList:viewcellThresholdList
        };
		}]);