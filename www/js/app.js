angular.module("miApp", ["ionic", "pascalprecht.translate", "ionMdInput", "ionic-material", "LocalStorageModule", "ionic.contrib.NativeDrawer", "ngCordova"])

  .run(function ($ionicPlatform, $rootScope, $state, $translate, localStorageService) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
      $translate.use("hr");
      $ionicPlatform.registerBackButtonAction(function (event) {
        if ($state.current.name == "login") {
          navigator.app.exitApp();
        }
        else {
          navigator.app.backHistory();
        }
      }, 100);
    });

    // If user is logged in go to dashboard, else go to login page
    $rootScope.$on("$stateChangeSuccess",
      function (event, toState, toParams, fromState) {
        let user = localStorageService.get("user");
        if (!user && toState.name !== "signup") {
          event.preventDefault();
          $state.go("login");
        } else if (user && (fromState.name === "login" || toState.name === "login")) {
          $state.go("app.dashboard");
        }
      });
  })

  .config(function ($stateProvider, $urlRouterProvider, $translateProvider) {
    $translateProvider.useSanitizeValueStrategy("sanitizeParameters");
    $stateProvider
      .state("signup", {
        url: "/signup",
        templateUrl: "templates/modules/signup/signup_template.html",
        controller: "SignupCtrl"
      })

      .state("login", {
        url: "/login",
        templateUrl: "templates/modules/login/login_template.html",
        controller: "LoginCtrl"
      })
      .state("app", {
        url: "/app",
        abstract: true,
        templateUrl: "templates/modules/sidemenu/sidemenu_template.html",
        controller: "SidemenuCtrl"
      })


      .state("app.dashboard", {
        url: "/dashboard",
        views: {
          menuContent: {
            templateUrl: "templates/modules/dashboard/dashboard_template.html",
            controller: "DashboardCtrl"
          }
        },
        params: {
          username: null
        }
      })
      .state("app.newPost", {
        url: "/newPost",
        views: {
          menuContent: {
            templateUrl: "templates/modules/newPost/newPost_template.html",
            controller: "NewPostCtrl"
          }
        }
      })
      .state("app.user", {
        url: "/user",
        views: {
          menuContent: {
            templateUrl: "templates/modules/user/user_template.html",
            controller: "UserCtrl"
          }
        },
        params: {
          user: null
        }
      })
      .state("app.settings", {
        url: "/settings",
        views: {
          menuContent: {
            templateUrl: "templates/modules/user/settings_template.html",
            controller: "SettingsCtrl"
          }
        }
      })
      .state("app.editAccount", {
        url: "/editAccount",
        views: {
          menuContent: {
            templateUrl: "templates/modules/user/editAccount_template.html",
            controller: "EditAccountCtrl"
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise("/login");
  });
