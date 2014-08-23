describe('Vendor libraries needed for testing', function(){

	describe('requirejs', function(){
		it('has a requirejs function', function(){
			expect(requirejs).toBeDefined();
		});

		it('has a require function', function(){
			expect(require).toBeDefined();
		});

		it('has a define function', function(){
			expect(define).toBeDefined();
		});
	});

	describe('squire', function(cb){
		it('has to be loaded with require', function(cb){
			require(['Squire'], function(Squire){
				expect(Squire).toBeDefined();
				cb();
			});
		});
	});
});
