"use strict";
angular.module("miApp").controller("DashboardCtrl", function ($scope, $state, Auth, UserService, DashboardService, $ionicModal, $ionicScrollDelegate, $firebaseObject, $firebaseArray) {

  $scope.users = UserService.users;
  $scope.posts = [];

  let newPost = false;
  let postsRef = firebase.database().ref("posts/");
  var scrollRef = new firebase.util.Scroll(postsRef, "created");

  let getCommentsLength = (post) => {
    return Object.keys(post.comments).length;
  };

  //new post added
  scrollRef.on("child_added", posts => {
    let post = posts.val();
    $scope.hasMoreData = true;
    let currentDateTime = moment().unix();
    let postCreated = post.created * (-1);
    post.$id = posts.key;
    if (post.comments) {
      post.commentsLength = getCommentsLength(post);
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

  postsRef.on("child_changed", (data) => {
    $scope.posts.forEach(post => {
      if (data.key === post.$id) {
        post.numberOfComments = data.val().numberOfComments;
        $scope.$applyAsync();
      }
    })
  });


  //Load 8 more posts
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
    $scope.openNewPostModal();
    $scope.postButtonDisabled = true;
    DashboardService.addImage(type).then(image => {
      $scope.postButtonDisabled = false;
      $scope.newPostModal.image = image;
    })
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
          $scope.newPostModal.image = image;
        })
      };

      $scope.addNewPost = (post) => {
        let newPostObject = {
          title: post.title,
          message: post.message,
          image: post.image,
          numberOfComments: 0
        };
        newPost = true;
        DashboardService.newPost(newPostObject, $scope.user.uid).then(()=> {
          $scope.newPostModal.remove();
          post.title = post.message = post.image = undefined;
        });
      };

      $scope.closeNewPostModal = () => {
        $scope.newPostModal.hide();
        $scope.newPostModal.remove();
      }
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
      let commentsRef = firebase.database().ref("posts/" + post.$id + "/comments");
      $scope.commentsModal = modal;
      $scope.commentsModal.show();
      $scope.comment = {
        message: ""
      };
      let scrollBottom = () => {
        // Scroll to the bottom
        $ionicScrollDelegate.$getByHandle("modalContent").scrollBottom();
      };
      $scope.comments = $firebaseArray(commentsRef);
      scrollBottom();

      //Add new comment
      $scope.newComment = () => {
        DashboardService.newComment(post, $scope.user.uid, $scope.comment, $scope.comments.length);
        $scope.comment.message = "";
        scrollBottom();
      };

      $scope.closeCommentsModal = () => {
        $scope.commentsModal.hide();
        $scope.commentsModal.remove();
      }
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
      if (post.new) {
        post.new = false;
      }
      $scope.post = post;
      $scope.postDetailsModal.show();

      $scope.closePostDetailsModal = () => {
        $scope.postDetailsModal.hide();
        $scope.postDetailsModal.remove();
      }
    })
  };

  //Load 8 posts on start
  $scope.loadMore();
});
