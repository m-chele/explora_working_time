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

describe ('differenceInHours' , function(){  

  it ( 'should calculate hours and minutes beetwen two times', function(){    
          
      expect(differenceInMilliseconds("13:59", "14:59")).toBe(60 * 60 * 1000);          
      expect(differenceInMilliseconds("13:10", "13:12")).toBe(60 * 2 * 1000);
      expect(differenceInMilliseconds("13:00", "15:30")).toBe(60 * 150 * 1000);
      expect(differenceInMilliseconds("14:00", "13:00")).toBe(-60 * 60 * 1000);
  });


  
});