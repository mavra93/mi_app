angular.module("miApp", ["ionic", "pascalprecht.translate", "ionMdInput"])

  .run(function ($ionicPlatform, $rootScope, $state, $translate) {
  $ionicPlatform.ready(function() {
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
    $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams, options) => {
      if (fromState.name !== "login" && (toState.name === "login" || toState.name === "signup")) {
        $state.go(fromState.name);
      }
    })
  });
})

.config(function($stateProvider, $urlRouterProvider) {
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
      abstract: true,
      url: "/app"
    })

    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'templates/modules/dashboard/dashboard_template.html',
      controller: 'DashboardCtrl'
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise("/signup");
});
