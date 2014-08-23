describe('testViewModel', function(){

	var injector;

	beforeEach(function(cb){
		require(['Squire'], function(s){
			Squire = s;
			injector = new Squire();
			cb();
		});
	});

	it('returns expected message', function(cb){
		require(['testViewModel'], function(target){
			expect(target.message()).toEqual('Hello, World!');
			cb();
		});
	});
	
	describe('squire.mock', function(){

		it('can mock the messageService dependency', function(cb){
			injector.mock('messageService', {
				getMessage: function(){
					return 'mock message';
				}
			});

			injector.require(['testViewModel'], function(target){
				expect(target.message()).toEqual('mock message');
				cb();
			});
		});

		it('can suppy different mocks for different tests', function(cb){
			injector.mock('messageService', {
				getMessage: function(){
					return 'a different mock message';
				}
			});

			injector.require(['testViewModel'], function(target){
				expect(target.message()).toEqual('a different mock message');
				cb();
			});
		});

		it('only mocks within the scope of an it block', function(cb){
			require(['testViewModel'], function(target){
				expect(target.message()).toEqual('Hello, World!');
				cb();
			});
		});
	});

	describe('squire can help jasmine spy on actual dependencies', function(){

		it('it can count how many times getMessage is called', function(cb){
			injector
				.store('messageService')
				.require(['testViewModel', 'mocks'], function(target , mocks){
					var messageService = mocks.store.messageService;
					spyOn(messageService, "getMessage");

					target.message();

					expect(messageService.getMessage).toHaveBeenCalled();
					cb();
				});

		});
	});

});