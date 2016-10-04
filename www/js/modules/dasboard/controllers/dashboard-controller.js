"use strict";
angular.module("miApp").controller("DashboardCtrl", function ($scope, $state, Auth, UserService, DashboardService, $ionicModal) {
  $scope.users = UserService.users;
  $scope.posts = [];
  let newPost = false;
  let postsRef = firebase.database().ref("posts/");
  var scrollRef = new firebase.util.Scroll(postsRef, "created");
  scrollRef.on("child_added", posts => {
    if (newPost) {
      $scope.posts.unshift(posts.val());
    } else {
      $scope.posts.push(posts.val());
    }
    $scope.$applyAsync();
    $scope.$broadcast("scroll.infiniteScrollComplete");
    newPost = false;
  });

  $scope.loadMore = () => {
    scrollRef.scroll.next(4);
  };

  $scope.getPostOwner = (users, uid) => {
    DashboardService.getPostOwner(users, uid).then(postOwner => {
      return postOwner
    })
  };

  UserService.getCurrentUser().then(user => {
    if (user) {
      let userProfile = user;
      if (!user.photoURL) {
        let username = $state.params.username;
        Auth.setExtraUserSettings(user, username).then(newUser => {
          userProfile = newUser;
        });
      }
      $scope.user = userProfile;
    } else {
      $state.go("login");
    }
  });


  $scope.loadPosts = () => {
    DashboardService.loadPosts().then(posts => {
      $scope.posts = posts;
    })
  };

  //Method that open modal with new post form
  $ionicModal.fromTemplateUrl("templates/modules/newPost/newPost_template.html", {
    scope: $scope
  }).then(modal => {
    $scope.modal = modal;

    $scope.post = {
      title: "",
      message: "",
      image: ""

    };
    $scope.addImage = () => {
      DashboardService.addImage().then(image => {
        $scope.post.image = image;
      })
    };

    $scope.newPost = () => {
      newPost = true;
      DashboardService.newPost($scope.post, $scope.user.uid).then(()=> {
        $scope.modal.hide();
      })
    }
  });
});
