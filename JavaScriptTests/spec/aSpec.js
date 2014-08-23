describe('Module a', function(){
	
	it('should exist', function(cb){
		require(['../../JavaScriptTests/src/modules/a'], function(a){
			expect(a).toBeDefined();
			cb();
		});
	});

});
