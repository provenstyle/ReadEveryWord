define(['../../JavaScriptTests/src/modules/messageService'], function (messageService) {
	return {
		message: function(){
			return messageService.getMessage();
		}
	};
});