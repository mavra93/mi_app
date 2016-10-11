"use strict";
angular.module("miApp").controller("DashboardCtrl", function ($scope, $state, Auth, UserService, DashboardService, $ionicModal) {
  $scope.users = UserService.users;
  $scope.posts = [];
  let newPost = false;
  let postsRef = firebase.database().ref("posts/");
  var scrollRef = new firebase.util.Scroll(postsRef, "created");
  //new post added
  scrollRef.on("child_added", posts => {
    let post = posts.val();
    $scope.hasMoreData = true;
    let currentDateTime = moment().unix();
    let postCreated = post.created * (-1);
    post.id = posts.key;
    if (newPost) {
      $scope.posts.unshift(post);
    } else if (!newPost && currentDateTime === postCreated) {
      post.new = true;
      $scope.posts.unshift(post);
    } else {
      $scope.posts.push(post);
    }
    $scope.$broadcast("scroll.infiniteScrollComplete");
    $scope.$applyAsync();
    newPost = false;
  });


  //Load 4 more posts
  $scope.loadMore = () => {
    if ($scope.posts.length < 1) {
      $scope.hasMoreData = true;
    } else {
      $scope.hasMoreData = false;
    }
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

  //View post details
  $scope.postDetails = (post) => {
    $state.go("app.dashboardDetail", {post: post});
  };

  //Post image directly from dashboard
  $scope.newImagePost = (type) => {
    $scope.modal.show();
    $scope.addImage(type)
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
    $scope.addImage = (type) => {
      DashboardService.addImage(type).then(image => {
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

  //Comments modal
  $ionicModal.fromTemplateUrl("templates/modules/dashboard/comments_modal_template.html", {
    scope: $scope
  }).then(modal => {
    $scope.commentsModal = modal;
    $scope.openCommentModal = (id) => {
      $scope.comments = [];
      $scope.commentsModal.show();
      $scope.postId = id;
      let postsRef = firebase.database().ref("posts/" + id + "/comments");

      //Watch if any new comment added
      postsRef.on("child_added", data => {
        $scope.comments.push(data.val());
      });

      $scope.comment = {
        message: ""
      };
      //Add new comment
      $scope.newComment = () => {
        DashboardService.newComment($scope.postId, $scope.user.uid, $scope.comment).then(data => {
          $scope.comment.message = "";
        });
      }
    }
  });

  //Load 4 posts on start
  $scope.loadMore();
});
