"use strict";
function DashboardService($q, $cordovaCamera) {
  let firebase = firebase.auth();
  this.newPost = () => {
    firebase.database().ref("posts").push({})
  }
}
angular.module("miApp").service("DashboardService", DashboardService);
