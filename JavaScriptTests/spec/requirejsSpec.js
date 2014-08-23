describe('requirejs', function(){
	
	it('has to work hard to find files in this project', function(cb){
		require(['../../JavaScriptTests/src/modules/a'], function(a){
			expect(a).toBeDefined();
			cb();
		});
	});

});
