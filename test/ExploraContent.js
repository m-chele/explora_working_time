describe ('ZucchettiContent' , function(){ //TODO: rename

  describe ('time extraction from Zucchetti formatted text' , function(){
    it ( 'should extract time from check-in string', function(){

        expect(extractTime("08.03")).toBe("08:03");
    });

  });

});
