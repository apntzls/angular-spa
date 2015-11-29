// App Module
angular.module('App', ['ngRoute']).

// Constants
constant('baseURL', 'http://api.openweathermap.org/data/2.5/forecast/daily').

// Routes
config(function ($routeProvider) {

  $routeProvider.

  when('/forecast/:city/:country?', { // Optional country parameter, otherwise search by city.
    templateUrl: 'views/forecast.html',
    controller: 'forecastController',
    controllerAs: 'forecast'
  }).
  otherwise({
    redirectTo: '/'
  })

}).

// Controllers  

controller('forecastController', ['$routeParams', '$http', 'baseURL', function ($routeParams, $http, baseURL) {
  var vm = this,
    city = $routeParams.city,
    country;

  // Checking for the optional country parameter
  if ($routeParams.country) {
    country = ',' + $routeParams.country
  } else {
    country = ''
  }

  var url = baseURL + '?q=' + city + country + '&cnt=16&units=imperial&appid=2de143494c0b295cca9337e1e96b00e0&callback=JSON_CALLBACK';

  $http.jsonp(url)
    .success(function success(response) {
      vm.city = response.city.name;
      vm.country = response.city.country;
      vm.days = response.list;
    });

  // Utilizing Moment.js to set the day
  vm.getDay = function (time) {
    var day = moment(time * 1000).format('dddd');
    return day;
  }

  // Utilizing Moment.js to set the date
  vm.getDate = function (time) {
    var date = moment(time * 1000).format('l');
    return date;
  }

  // Rounding the temperature to a whole number
  vm.round = function (temp) {
    return Math.round(temp);
  };

  vm.sortBy;
  vm.reverse = false;

  // Sorts temperatures by time of day from low to high then reverses high to low
  vm.sort = function (evt, sort) {
    evt.preventDefault();

    if (sort === vm.sortBy) {
      vm.reverse = !vm.reverse;
    } else {
      vm.reverse = false;
    }

    vm.sortBy = sort;
  }
      }]);
