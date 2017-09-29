describe ('Calculate' , function(){

  describe ('time difference calculation' , function(){

    it ( 'should calculate milliseconds between two times', function(){

        expect(differenceInMilliseconds("13:59", "14:59")).toBe(60 * 60 * 1000);
        expect(differenceInMilliseconds("13:10", "13:12")).toBe(60 * 2 * 1000);
        expect(differenceInMilliseconds("13:00", "15:30")).toBe(60 * 150 * 1000);
        expect(differenceInMilliseconds("14:00", "13:00")).toBe(-60 * 60 * 1000);
    });
  });

  describe ('result rendering' , function(){

    it ( 'should render worked time in hours and minutes', function(){

        expect(workedTime(1000 * 60).hours).toBe(0);
        expect(workedTime(1000 * 60).minutes).toBe(1);
    });

  });
});
