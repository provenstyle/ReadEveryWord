(function() {
    angular
        .module('readEveryWord')
        .config(validationConfig);

    validationConfig.$inject = ['showErrorsConfigProvider'];

    function validationConfig(showErrorsConfigProvider) {
        showErrorsConfigProvider.showSuccess(true);
    }
})();

