angular.module('owmLibrary', [])

//each constant below defines the API structure, which includes the URL base, the API key and a variable containing the path to the local JSON file (which contains a list of cities)
.constant('OWM_API_PREFIX', 'http://api.openweathermap.org/data/2.5/forecast')
    .constant('OWM_API_KEY', 'db886594d5161ed75ebbfbcda76ccff4')
    .constant('OWM_CITIES_JSON_FILE', './owm-cities.json')
    //key service for the entire app
    .factory('owmRequest', ['$http', '$q', 'OWM_API_PREFIX', 'OWM_API_KEY', function ($http, $q, OWM_API_PREFIX, OWM_API_KEY) {
        return function (params) {
            var reqParams = angular.extend({}, params, {
                APPID: OWM_API_KEY
            });
            return $http.get(OWM_API_PREFIX, {
                    params: reqParams
                })
                .then(function (response) {
                    return $q.when(response.data);
                });
        };
  }])
    .factory('owmUSCities', ['$http', '$q', 'OWM_CITIES_JSON_FILE', function ($http, $q, OWM_CITIES_JSON_FILE) {
        return function () {
            return $http.get(OWM_CITIES_JSON_FILE, {
                    cache: true
                })
                .then(function (response) {
                    return $q.when(response.data);
                });
        };
  }])
    .factory('owmFindCity', ['owmRequest', function (owmRequest) {
        return function (q) {
            var params;
            if (q.match(/^\d+$/)) {
                params = {
                    id: q
                };
            } else {
                params = {
                    q: q
                };
            }
            return owmRequest(params);
        };
  }])
    .factory('owmNearby', ['owmRequest', function (owmRequest) {
        return function (loc) {
            var params = {
                lat: loc.lat,
                lng: loc.lng
            };
            return owmRequest(params);
        };
  }]);
