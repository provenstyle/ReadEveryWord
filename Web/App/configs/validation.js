angular.module('readEveryWord')
    .config(['showErrorsConfigProvider', function (showErrorsConfigProvider) {
        showErrorsConfigProvider.showSuccess(true);
    }]);