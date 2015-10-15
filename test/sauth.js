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
      _id: '',
      state: false,
      name: function () {
        return name;
      },
      pass: function () {
        return pass;
      },
      id: function () {
        return this._id;
      },
      signIn: function (id) {
        this._id = id;
        this.state = true;
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
    userID = "456";
  }));


  it('authenticate user success', function (done) {
    var u = User(userName, userPass);

    var url = '/auth/ladyKiller_99/'+ u.pass();

    $httpBackend.expectGET(url)
      .respond({"Status": "success", "Data": {"UserID": userID}});
    
    $s.auth.setup({
      prefix: "/auth",
    })
    var p = $s.auth.signIn(u);

    $httpBackend.flush();

    p.then(function (resp) {
      expect(u.signedIn()).toBe(true);
      expect(u.id()).toBe(userID);
      done();
    })

    $s.$apply();

  });

  it('authenticate user fail', function (done) {
    var u = User(userName, userPass);

    var url = '/auth/ladyKiller_99/'+ u.pass();

    $httpBackend.expectGET(url)
      .respond({"Status": "fail"});
    
    $s.auth.setup({
      prefix: "/auth",
    })
    var p = $s.auth.signIn(u);

    $httpBackend.flush();

    p.then(function (resp) {
      fail("should not be called");
    }, function (resp) {
      expect(u.signedIn()).toBe(false);
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
