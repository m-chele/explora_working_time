//describe your code
describe ('Calculate' , function(){
  
  //what it should do
  it ( 'should be working ;)', function(){
      expect("one").toBe("one");
  });
});

describe ('extractTime' , function(){  
  it ( 'should extract time from check-in string', function(){
      
      expect(extractTime("E08:03")).toBe("08:03");

  });

  it ( 'should extract time from check-out string', function(){
          
      expect(extractTime("U13:59")).toBe("13:59");    

  });
});