describe('Module a', function(){
	
	it('should exist', function(cb){
		require(['a'], function(a){
			expect(a).toBeDefined();
			cb();
		});
	});

});
