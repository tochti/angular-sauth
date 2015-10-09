'use strict';

angular.module('SAuth', [])
.factory('Auth', ['$http', '$q',
  function ($http, $q) {
    var sauth = {
      _urlPrefix: "/login",

      newSha1Pass: function (pass) {
        return CryptoJS.SHA1(pass);
      },

      setup: function (spec) {
        if (spec.prefix !== undefined) {
          return this.setPrefix(spec.prefix);
        }
      },

      setPrefix: function (p) {
        if (p.length < 2) {
          return false
        }
        if (p.indexOf('/') !== 0) {
          return false
        }
        if (p.lastIndexOf('/') === p.length - 1) {
          p = p.substr(0, p.length - 1);
        }

        this._urlPrefix = p;
        return true
      },

      // Expect a object with the following methods
      // name() string, return username
      // pass() string, return password in cleartext
      // login(id), get called when login was successfull pass userid
      //
      // The Function attempt sends a GET request 
      // URL: /login/:name/:pass, pass is sended in sha1
      // Function expect following Response
      // JSON Format
      // When the request was succesfull
      // {
      //  Status: "success",
      //  ...
      // }
      // When the request failed
      // {
      //  Status: "fail",
      //  Err: "error msg",
      // }
      //
      // function auth(user) promise
      auth: function (user) {
        var uID = '';
        var d = $q.defer();

        var name = user.name();
        var pass = user.pass();

        var sha1Pass = this.newSha1Pass(pass)

        var url = this._urlPrefix +"/"+ name +"/"+ sha1Pass;

        var success = function (resp) {
            if (resp.data.Status === "success") {
              uID = resp.data.Data.UserID
              user.login(uID);
              d.resolve(resp);
              return
            }

            d.reject(resp);
        }

        var error = function (resp) {
            d.reject(resp);
        }

        $http.get(url).then(success, error);

        return d.promise;
      }
    };

    return sauth;
  }
])
