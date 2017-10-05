magmoapp.service("commonHttpService", [
		'$http',
		'$q',
		'LocalStorageService',
		'$state',
		function($http, $q, LocalStorageService, $state) {
			var actionOnError = function(err) {
				console.log("actionOnError....", err);
				if (err.status === 403) {
					$state.go('errorPage');
				}
			};
			var callhttp = function(configObj) {
				var deferred = $q.defer();
				$http(configObj).then(function(res) {
					console.log("reponse", configObj.url, res);
					deferred.resolve(res);
				}, function(err) {
					console.log("error", configObj.url, err);
					deferred.reject(err);
				});
				return deferred.promise;
			};
			var makeConfigObj = function(urlObj, urlAppendString, _data) {
				var _url = urlObj.url;
				var _method = urlObj.method;
				if (urlAppendString) {
					_url += urlAppendString;
				}
				var configObj = {
					url : _url,
					method : _method,
					headers : {
						"X-XSRF-TOKEN" : LocalStorageService
								.getLocalStorageData("X-XSRF-TOKEN")
					}
				};
				if (_data) {
					configObj.data = _data;
				}
				return configObj;
			};
			var apiMediator = function(configObj, showloader) {
				if (showloader) {
					$("#loaderDiv").show();
				}
				var deferred = $q.defer();
				callhttp(configObj).then(function(res) {
					if (showloader) {
						$("#loaderDiv").hide();
					}
					deferred.resolve(res.data);
				}, function(err) {
					if (showloader) {
						console.log("hide loader....");
						$("#loaderDiv").hide();
					}
					actionOnError(err);
					deferred.reject(err);
				});
				return deferred.promise;
			};
			return {
				makeConfigObj : makeConfigObj,
				apiMediator : apiMediator
			};
		} ]);