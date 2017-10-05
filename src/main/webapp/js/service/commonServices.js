magmoapp.factory('LocalStorageService', function () {
    var cacheObj = localStorage;
    var _getLocalStorageData = function (key) {
        return JSON.parse(cacheObj.getItem(key));
    };
    var _setLocalStorageData = function (key, data) {
        cacheObj.setItem(key, JSON.stringify(data));
    };
    var _resetLocalStorageData = function (key) {
        cacheObj.removeItem(key);
    };
    return {
        getLocalStorageData: _getLocalStorageData
        , setLocalStorageData: _setLocalStorageData
        , resetLocalStorageData: _resetLocalStorageData
    };
});