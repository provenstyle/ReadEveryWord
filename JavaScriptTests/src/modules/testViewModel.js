define(['messageService'], function(messageService){
	return {
		message: function(){
			return messageService.getMessage();
		}
	};
});