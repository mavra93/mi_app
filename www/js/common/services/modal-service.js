"use strict";
function ModalService($ionicModal, $rootScope, $q, $controller, $ionicPlatform) {

  this.show = (templateUrl, controller, parameters) => {
    let deferred = $q.defer(),
      ctrlInstance,
      modalScope = $rootScope.$new(),
      thisScopeId = modalScope.$id;

    $ionicModal.fromTemplateUrl(templateUrl, {
      scope: modalScope,
      animation: "no-animation"
    }).then(modal => {
      modalScope.modal = modal;

      modalScope.openModal = () => {
        modalScope.modal.show();
      };

      modalScope.removeModal = result => {
        deferred.resolve(result);
        modalScope.modal.hide();
      };

      modalScope.$on("modal.hidden", thisModal => {
        if (thisModal.currentScope) {
          let modalScopeId = thisModal.currentScope.$id;
          if (thisScopeId === modalScopeId) {
            deferred.resolve(null);
            _cleanup(thisModal.currentScope);
          }
        }
      });

      let locals = {'$scope': modalScope, 'parameters': parameters};
      let ctrlEval = _evalController(controller);
      ctrlInstance = $controller(controller, locals);
      if (ctrlEval.isControllerAs) {
        ctrlInstance.openModal = modalScope.openModal;
        ctrlInstance.removeModal = modalScope.removeModal;
      }

      modalScope.modal.show();

    }, err => {
      deferred.reject(err);
    });

    return deferred.promise;
  };

  let _cleanup = (scope) => {
    scope.$destroy();
    if (scope.modal) {
      scope.modal.remove();
    }
  };

  let _evalController = (ctrlName) => {
    let result = {
      isControllerAs: false,
      controllerName: "",
      propName: ""
    };
    $ionicPlatform.registerBackButtonAction(_cleanup, 100);

    let fragments = (ctrlName || "").trim().split(/\s+/);
    result.isControllerAs = fragments.length === 3 && (fragments[1] || "").toLowerCase() === "as";
    if (result.isControllerAs) {
      result.controllerName = fragments[0];
      result.propName = fragments[2];
    } else {
      result.controllerName = ctrlName;
    }

    return result;
  }
}
angular.module("miApp").service("ModalService", ModalService);
