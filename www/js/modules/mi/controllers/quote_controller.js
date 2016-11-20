"use strict";
angular.module("miApp").controller("QuoteCtrl", function ($scope, parameters, UserService, MiService, ionicTimePicker) {
  $scope.users = UserService.storeUsers();
  $scope.quote = {
    message: "",
    time: ""
  };

  $scope.currentUser = parameters.user;

  $scope.selectUser = (user) => {
    $scope.selectedUser = user;
  };

  $scope.openTimePicker = () => {
    var ipObj1 = {
      callback: val => {
        if (typeof (val) === 'undefined') {
          console.log('Time not selected');
        } else {
          val = moment(val * 1000);
          val = val.subtract(1, "hour");
          $scope.quote.time = moment({hour: val.hour(), minute: val.minute()}).unix();
        }
      },
      inputTime: ((new Date()).getHours() * 60 * 60 + (0)),
      format: 24
    };
    ionicTimePicker.openTimePicker(ipObj1);
  };

  $scope.newQuote = () => {
    MiService.newQuote($scope.quote, $scope.selectedUser, parameters.user);
    $scope.removeModal();
  }
});
