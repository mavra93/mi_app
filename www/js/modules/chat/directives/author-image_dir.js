/*jshint camelcase: false*/
"use strict";
angular.module("miApp").directive("authorImage", (UserService) => {
  return {
    restrict: "E",
    templateUrl: "templates/modules/chat/directives/author_image_dir_template.html",
    scope: {},
    bindToController: {
      uid: "<"
    },
    controllerAs: "ctrl",
    controller: function () {
      let users = UserService.users;
      this.getImage = () => {
        for (let i = 0; i < users.length; i++) {
          if (users[i].uid === this.uid) {
            return users[i].image.path;
          }
        }
      };
      this.image = this.getImage();
    }
  }
});
