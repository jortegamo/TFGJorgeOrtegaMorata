if (!(typeof MochaWeb === 'undefined')){
  MochaWeb.testOnly(function(){
    describe("loginForms", function(){
      var modalShown = false;

      it("modal container and enterbutton should be defined!!", function(){
        chai.assert($("#loginForm") != undefined);
        chai.assert($("#enterbutton") != undefined);
      });

      it("the sessions must to be false",function(){
      	chai.assert.notEqual(Session.get("signUp"),true);
      	chai.assert.notEqual(Session.get("forgot"),true);
      });

      it("the session must to be changed when I change the sign Form",function(){
      	//got to SignUpForm
      	chai.assert.isDefined($("#signUp"));
      	$("#signUp").click();
      	chai.assert.equal(Session.get("signUp"),true);

      	//back to return at signInForm
      	chai.assert.isDefined($("#back"));
      	$("#back").click();
      	
      	//go to forgotPasswordForm
      	chai.assert.isDefined($("#forgot"));
      	$("#forgot").click();
      	chai.assert.equal(Session.get("forgot"),true);

      	//back to return at signInForm
      	chai.assert.isDefined($("#back"));
      });

    });
  });
}
