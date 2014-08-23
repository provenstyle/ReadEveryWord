requirejs.config({
	baseUrl: 'Web/App', 
	paths:{
	    'Squire': '../../JavaScriptTests/spec/squire',
	    'text': '../Scripts/text',
	    'durandal': '../Scripts/durandal',
	    'plugins': '../Scripts/durandal/plugins',
	    'transitions': '../Scripts/durandal/transitions'
	}
});

define('jquery', function () { return jQuery; });
define('knockout', ko);