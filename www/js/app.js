angular.module("miApp", ["ionic", "pascalprecht.translate", "ionMdInput", "ionic-material", "LocalStorageModule", "ngCordova", "angularMoment", "ionic-native-transitions", "jett.ionic.scroll.sista", "firebase"])

  .run(function ($ionicPlatform, $rootScope, $state) {
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
      $rootScope.transitions = {};
      $rootScope.$on("$stateChangeSuccess", function (event, to, toParams, from, fromParams) {
        if (from.name !== "login") {
          $rootScope.transitions[to.name] = {"name": from.name, "params": fromParams};
        }
      });

      $ionicPlatform.registerBackButtonAction(() => {
        if ($state.current.name == "login") {
          navigator.app.exitApp();
        }
        else {
          navigator.app.backHistory();
        }
      }, 100);
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $translateProvider, $ionicConfigProvider) {
    $ionicConfigProvider.views.forwardCache(true);
    $ionicConfigProvider.views.maxCache(0);
    $translateProvider.useSanitizeValueStrategy("sanitizeParameters");
    $ionicConfigProvider.scrolling.jsScrolling(false);
    $stateProvider
      .state("signup", {
        url: "/signup",
        templateUrl: "templates/modules/signup/signup_template.html",
        controller: "SignupCtrl",
        nativeTransitionsAndroid: {
          "type": "fade"
        }
      })

      .state("login", {
        url: "/login",
        templateUrl: "templates/modules/login/login_template.html",
        controller: "LoginCtrl",
        nativeTransitionsAndroid: {
          "type": "fade"
        }
      })
      .state("app", {
        url: "/app",
        abstract: true,
        templateUrl: "templates/modules/tabs/tabs_template.html",
        controller: "SidemenuCtrl",
        onEnter: function ($state, localStorageService, UserService) {
          let language = localStorageService.get("language");
          let user = localStorageService.get("user") || null;
          if (!user) {
            $state.go('login');
          } else {
            UserService.setLanguage(language);
          }
        }
      })
      .state("app.dashboard", {
        url: "/dashboard",
        views: {
          dashboard: {
            templateUrl: "templates/modules/dashboard/dashboard_template.html",
            controller: "DashboardCtrl"
          }
        },
        params: {
          username: null
        },
        nativeTransitionsAndroid: {
          "type": "fade"
        }
      })
      .state("app.newPost", {
        url: "/newPost",
        views: {
          menuContent: {
            templateUrl: "templates/modules/newPost/newPost_template.html",
            controller: "NewPostCtrl"
          }
        },
        params: {
          uid: null
        },
        nativeTransitionsAndroid: {
          "type": "fade"
        }
      })
      .state("app.user", {
        url: "/user",
        views: {
          user: {
            templateUrl: "templates/modules/user/user_template.html",
            controller: "UserCtrl"
          }
        },
        resolve: {
          userData: (UserService) => {
            return UserService.getCurrentUser().then(user => {
              return user;
            }, err => {
              throw new Error(err);
            });
          }
        },
        params: {
          user: null
        },
        nativeTransitionsAndroid: {
          "type": "fade"
        }
      })
      .state("app.settings", {
        url: "/settings",
        views: {
          user: {
            templateUrl: "templates/modules/user/settings_template.html",
            controller: "SettingsCtrl"
          }
        },
        nativeTransitionsAndroid: {
          "type": "fade"
        }
      })
      .state("app.editAccount", {
        url: "/editAccount",
        views: {
          user: {
            templateUrl: "templates/modules/user/editAccount_template.html",
            controller: "EditAccountCtrl"
          }
        },
        resolve: {
          userData: (UserService) => {
            return UserService.getCurrentUser().then(user => {
              return user;
            }, err => {
              throw new Error(err);
            });
          }
        },
        nativeTransitionsAndroid: {
          "type": "fade"
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise("/app/dashboard");
  });
