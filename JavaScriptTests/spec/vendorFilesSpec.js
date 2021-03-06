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

	    it('has a sinon function', function() {
	        expect(sinon).toBeDefined();
	    });

	    it('has a toastr object', function() {
	        expect(toastr).toBeDefined();
	    });
	});
});
