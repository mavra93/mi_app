"use strict";
function MiService($q) {
  let quotesRef = firebase.database().ref("quotes/");

  this.newQuote = (quote, selectedUser, user) => {
    quotesRef.push({
      message: quote.message,
      to: selectedUser.deviceToken || "",
      toID: selectedUser.uid,
      author: user.uid,
      at: quote.time,
      repeat: quote.repeat,
      counter: 0
    });
  };

  this.getQuotes = (id) => {
    let q = $q.defer();
    let quotes = [];
    quotesRef.orderByChild("author").equalTo(id).on("child_added", data => {
      let quote = data.val();
      quote.id = data.key;
      quotes.push(quote);
      q.resolve(quotes);
    });
    return q.promise
  }

}
angular.module("miApp").service("MiService", MiService);
