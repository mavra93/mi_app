"use strict";
function GlobalService() {

  this.encodeImage = (imageUri, callback) => {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = function () {
      c.width = this.width;
      c.height = this.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = c.toDataURL("image/jpeg");
      callback(dataURL)
    };
    img.src = imageUri;
  }

}
angular.module("miApp").service("GlobalService", GlobalService);

