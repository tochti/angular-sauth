'user strict';

describe('Auth', function () {

  var $s, 
      $rootScope,
      $httpBackend,
      auth,
      userName,
      userPass;

  var User = function (name, pass) {
    return {
      state: false,
      name: function () {
        return name;
      },
      pass: function () {
        return pass;
      },
      login: function (s) {
        this.state = s;
      },
      signedIn: function () {
        return this.state; 
      },
    };
  }

  beforeEach(module('SAuth'));

  beforeEach(inject(function ($injector) {
    $rootScope = $injector.get('$rootScope');
    $s = $rootScope.$new();
    $httpBackend = $injector.get('$httpBackend');

    $s.auth = $injector.get('Auth');

    userName = "ladyKiller_99";
    userPass = "123";
  }));


  it('authenticate user success', function (done) {
    var u = User(userName, userPass);

    var sha1P = CryptoJS.SHA1(userPass);
    var url = '/auth/ladyKiller_99/'+ sha1P;

    $httpBackend.expectGET(url)
      .respond({"Status": "success"});
    
    $s.auth.setup({
      prefix: "/auth",
    })
    var p = $s.auth.auth(u);

    $httpBackend.flush();

    p.then(function (resp) {
      expect(u.signedIn).toBe(true);
      done();
    })

    $s.$apply();

  });

  it('authenticate user fail', function (done) {
    var u = User(userName, userPass);

    var sha1P = CryptoJS.SHA1(userPass);
    var url = '/auth/ladyKiller_99/'+ sha1P;

    $httpBackend.expectGET(url)
      .respond({"Status": "fail"});
    
    $s.auth.setup({
      prefix: "/auth",
    })
    var p = $s.auth.auth(u);

    $httpBackend.flush();

    p.then(function (resp) {
      fail("should not be called");
    }, function (resp) {
      expect(u.signedIn).toBe(false);
      done();
    });

    $s.$apply();

  });

  it('test set prefix', function () {
    $s.auth.setPrefix('/l');
    expect($s.auth._urlPrefix).toBe('/l');

    $s.auth.setPrefix('/l/');
    expect($s.auth._urlPrefix).toBe('/l');

    $s.auth.setPrefix('/l/l');
    expect($s.auth._urlPrefix).toBe('/l/l');

    $s.auth.setPrefix('/');
    expect($s.auth._urlPrefix).toBe('/l/l');

  })

  it('test setup', function () {
    $s.auth.setup({
      prefix: '/l',
    });

    expect($s.auth._urlPrefix).toBe('/l');
  });

});
