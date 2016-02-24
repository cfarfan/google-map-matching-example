angular.module('experiment',['ngRoute'])
  .constant('debug', true)
  .config( function ($routeProvider) {
    $routeProvider
      .when('/', {
        controller: 'mapMatchingCtrl',
        templateUrl: 'template.html',
        active: 'index'
      })
      .otherwise({
        redirectTo:'/'
      });
  })
  .controller('mapMatchingCtrl',function($scope, $route, $http, $timeout){
    $scope.$route = $route

    L.mapbox.accessToken = config.mapbox.token
    var map = L.mapbox.map('map', 'mapbox.dark')
        .setView([37.765015, -122.416363], 13)

    var gpsdata = undefined
    var p = L.polyline([],{color: '#00CBFF', opacity: 1}).addTo(map)

    $http.get('data/gpsdata.json')
    .then(function(response){
      gpsdata = response.data
      gpsdata = gpsdata.filter(function(e){return e.codename === "WAYPOINT" && e.accuracy <= 20}).map(function(e){return [e.lat,e.lng]})
      p.setLatLngs(gpsdata)
      map.fitBounds(p.getBounds())
    })

    var fn = $scope.fn = {
      mapMatching: function () {
        var l = gpsdata.length
        for(var i = 0; i <= parseInt(l/100); i++){
          var parameters = "path="+gpsdata.slice(i*100,i*100+((l-i*100)>=101?100:l%100)).map(function(e){return e.splice(0,2).join(',')}).join('|')
          $http.get('https://roads.googleapis.com/v1/snapToRoads?'+parameters+'&interpolate=true&key='+config.google.maps.roads.token)
          .then(function (response) {
            var datafixed = response.data.snappedPoints.map(function(e){ return [e.location.latitude,e.location.longitude]})
            L.polyline(datafixed,{color: '#E400FF', opacity: 1}).addTo(map)
          })
        }
      }
    }
  })


