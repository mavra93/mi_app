"use strict";
angular.module("miApp").controller("MiCtrl", function ($scope, ModalService, UserService, MiService, $timeout, ionicMaterialMotion, ionicMaterialInk) {
  let user;
  $timeout(()=> {
    ionicMaterialMotion.fadeSlideIn({
      selector: '.animate-fade-slide-in .item'
    });
  }, 200);

  ionicMaterialInk.displayEffect();


  $scope.newQuote = () => {
    ModalService.show('templates/modules/mi/add_new_quote_template.html', 'QuoteCtrl', {
        user: user
      })
      .then(result => {
        if (!result) {

        } else {
          console.log(result);
        }
      });
  };
  UserService.getCurrentUser().then(data => {
    user = data;
    MiService.getQuotes(user.uid).then(data => {
      $scope.quotes = data;
    })
  });

});
