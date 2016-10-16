"use strict";
angular.module("miApp").controller("DashboardCtrl", function ($scope, $state, Auth, UserService, DashboardService, $ionicModal, $ionicScrollDelegate) {

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
    if (post.comments) {
      post.commentsLength = Object.keys(post.comments).length;
    } else {
      post.commentsLength = null;
    }
    if (newPost) {
      $scope.posts.unshift(post);
    } else if (!newPost && (currentDateTime - postCreated) < 20) {
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
    scrollRef.scroll.next(8);
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

  //Post image directly from dashboard
  $scope.newImagePost = (type) => {
    $scope.newPostModal.show();
    $scope.addImage(type)
  };


  /**
   New post modal
   */

  $scope.openNewPostModal = () => {
    $ionicModal.fromTemplateUrl("templates/modules/newPost/newPost_template.html", {
      scope: $scope,
      animation: "no-animation"
    }).then(modal => {
      $scope.newPostModal = modal;
      modal.show();

      $scope.addImage = (type) => {
        $scope.postButtonDisabled = true;
        DashboardService.addImage(type).then(image => {
          $scope.postButtonDisabled = false;
          $scope.newPost.image = image;
        })
      };

      $scope.addNewPost = (post) => {
        let newPostObject = {
          title: post.title,
          message: post.message,
          image: post.image
        };
        newPost = true;
        DashboardService.newPost(newPostObject, $scope.user.uid).then(()=> {
          $scope.newPostModal.remove();
          post.title = post.message = post.image = undefined;
        });
      };
    });
  };


  /**
   Comments modal
   */

  $scope.openCommentModal = (post) => {
    $ionicModal.fromTemplateUrl("templates/modules/dashboard/comments_modal_template.html", {
      scope: $scope,
      animation: "no-animation"
    }).then(modal => {
      let newComment = false;
      $scope.comment = {
        message: ""
      };
      let scrollBottom = () => {
        // Scroll to the bottom
        $ionicScrollDelegate.$getByHandle("modalContent").scrollBottom();
      };

      $scope.commentsModal = modal;
      let postsRef = firebase.database().ref("posts/" + post.id + "/comments");
      $scope.comments = [];
      $scope.commentsModal.show();
      $scope.postId = post.id;

      //Watch if any new comment added
      postsRef.on("child_added", data => {
        let comment = data.val();
        if ($scope.comments.length > 1) {
          if ($scope.comments[$scope.comments.length - 1].message !== comment.message || $scope.comments[$scope.comments.length - 1].created !== comment.created) {
            $scope.comments.push(comment);
          }
        } else {
          $scope.comments.push(comment);
        }
        if (newComment) {
          post.commentsLength++;
        }
        $scope.$applyAsync();
        scrollBottom();
        });

      //Add new comment
      $scope.newComment = () => {
        newComment = true;
        DashboardService.newComment($scope.postId, $scope.user.uid, $scope.comment);
        $scope.comment.message = "";
      };
    });
  };

  /**
   Post details modal
   */

  $scope.openPostDetails = (post) => {
    $ionicModal.fromTemplateUrl("templates/modules/dashboard/dashboardDetail_template.html", {
      scope: $scope,
      animation: "no-animation"
    }).then(modal => {
      $scope.postDetailsModal = modal;

      $scope.post = post;
      $scope.postDetailsModal.show();
    })
  };

  //Load 4 posts on start
  $scope.loadMore();
});
