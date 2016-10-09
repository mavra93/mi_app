/*jshint camelcase: false*/
"use strict";
angular.module("miApp").directive("postOwner", (UserService) => {
  return {
    restrict: "E",
    templateUrl: "templates/modules/dashboard/directives/post_owner_dir.html",
    scope: {},
    bindToController: {
      uid: "<",
      created: "<"
    },
    controllerAs: "ctrl",
    controller: function () {
      let users = UserService.users;
      this.getOwner = () => {
        for (let i = 0; i < users.length; i++) {
          if (users[i].uid === this.uid) {
            return users[i];
          }
        }
      };
      this.user = this.getOwner();
    }
  }
});
