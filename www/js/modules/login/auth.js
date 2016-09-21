"use strict";
function Auth($q) {
  let auth = firebase.auth();

  /**
   * function which is creating a new user and saving them in firebase/users
   * @param username[String] - User username
   * @param email[String] - User email
   * @param password[String] - User password
   */
  this.createUser = function (username, email, password) {
    var q = $q.defer();
    auth.createUserWithEmailAndPassword(email, password).then(data => {
      q.resolve(data);
    }).catch(error => {
      q.reject(error);
    });
    return q.promise;
  };


  this.setUser = (id, username, email) => {
    firebase.database().ref('users/' + id).set({
      username: username,
      email: email
    });
  };


  /**
   * Function which sign in user in application
   * @param email[String] - User email
   * @param password[String] - User password
   */

  this.login = (email, password) => {
    var q = $q.defer();
    auth.signInWithEmailAndPassword(email, password).then(data => {
      q.resolve(data);
    }).catch(error => {
      q.reject(error);
    });
    return q.promise;
  };

  this.logout = () => {
    var q = $q.defer();
    auth.signOut().then(data => {
      q.resolve(data);
    }, (error) => {
      q.reject(error);
    });
    return q.promise;
  }

}
angular.module("miApp").service("Auth", Auth);
