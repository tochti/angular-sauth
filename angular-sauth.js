'use strict';

angular.module('SAuth', [])
.factory('Auth', ['$http', '$q',
  function ($http, $q) {
    var sauth = {
      _urlPrefix: "/login",

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
      // pass() string, return password
      // signIn(id), get called when login was successfull passing user id
      //
      // The Function sends a GET request 
      // URL: /_urlPrefix/:name/:pass
      // Function expect following Response
      // JSON Format
      // When the request was succesfull
      // {
      //  Status: "success",
      //  Data: {
      //    UserID: "id",
      //    ...
      //  }
      // }
      //
      // When the request failed
      // {
      //  Status: "fail",
      //  Err: "Error Text",
      // }
      //
      // function returns a promise
      signIn: function (user) {
        var uID = '';
        var d = $q.defer();

        var name = user.name();
        var pass = user.pass();

        var url = this._urlPrefix +"/"+ name +"/"+ pass;

        var success = function (resp) {
            if (resp.data.Status === "success") {
              uID = resp.data.Data.UserID
              if (uID === undefined) {
                var r = {
                  data: {
                    Status: "fail",
                    Err: "Cannot find user id",
                  }
                }
                d.reject(r);
                return
              }

              user.signIn(uID);
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
