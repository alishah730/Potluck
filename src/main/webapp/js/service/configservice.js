magmoapp.service('apiConfigService', [function () {
    this.geUserSSOlist = {
        url: "https://my.ge.com/search?category=profile&callback=JSON_CALLBACK&query="
        , method: 'JSONP'
    };
    var baseurl = "/";
    this.cellList = {
        url: baseurl + "listCell/"
        , method: 'GET'
    };
    this.cellDetails = {
        url: baseurl + "assignedMagnet/"
        , method: 'GET'
    };
    this.ssoList = {
        url: baseurl + "fetchUserSSOList"
        , method: 'GET'
    };
    this.viewCellThresholdList = {
        url: baseurl + "viewThresholdrDetails/"
        , method: 'GET'
    };
    this.cellThresholdList = {
            url: baseurl + "getthresholdlist/"
            , method: 'GET'
        };
    this.setcellThresholdList = {
        url: baseurl + "setthresholdvalue"
        , method: 'POST'
    };
    this.addnewUser = {
        url: baseurl + "addUser"
        , method: 'POST'
    };
    this.updateExistingUser = {
        url: baseurl + "updateUserDetails"
        , method: 'POST'
    };
    this.fetchUserDetails = {
        url: baseurl + "fetchUserDetails/"
        , method: 'GET'
    };
    this.authenticateUser = {
        url: baseurl + "user"
        , method: 'GET'
    };
    this.getAggregations = {
        url: baseurl + "getAggregations"
        , method: 'GET'
    };
    this.getTags = {
        url: baseurl + "getTags/"
        , method: 'GET'
    };
    this.viewSensorDetails = {
            url: baseurl + "viewSensorDetails/"
            , method: 'POST'
        };
    this.queryForDatapoints = {
        url: baseurl + "queryForDatapoints"
        , method: 'POST'
    };
    this.queryForLatestDatapoints = {
        url: baseurl + "queryForLatestDatapoints"
        , method: 'POST'
    };
    this.setcelllevelnotification = {
        url: baseurl + "setcelllevelnotification"
        , method: 'POST'
    };
    this.registerDevice = {
        url: baseurl + "registerDevice"
        , method: 'POST'
    };
    this.logout = {
        url: baseurl + "logout"
        , method: 'POST'
    };
				}]);