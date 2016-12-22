"use strict";
angular.module("miApp").controller("MiCtrl", function ($scope, ModalService, UserService, MiService, $timeout, ionicMaterialMotion, ionicMaterialInk) {
  let user;
  let quotesRef = firebase.database().ref("quotes/");
  ionicMaterialInk.displayEffect();

  $scope.newQuote = () => {
    ModalService.show('templates/modules/mi/add_new_quote_template.html', 'QuoteCtrl', {
        user: user
      })
      .then(() => {
        getQuotes();
      });
  };

  let getQuotes = () => {
    UserService.getCurrentUser().then(data => {
      user = data;
      MiService.getQuotes(user.uid).then(quotes => {
        $scope.quotes = quotes;
        $timeout(()=> {
          ionicMaterialMotion.ripple({
            selector: '.animate-ripple .item'
          });
        }, 200);
      })
    });
  };

  quotesRef.on("child_changed", (data) => {
    let changedQuote = data.val();
    let quoteKey = data.key;
    $scope.quotes.forEach(quote => {
      if (changedQuote.author === user.uid && quoteKey === quote.id) {
        quote.counter = changedQuote.counter;
        $scope.$applyAsync();
      }
    })
  });

  //Get all quotes on start
  getQuotes();


});
