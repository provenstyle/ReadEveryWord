define(function() {
    var ctor = function(number) {
        this.number = number;
        this.read = false;
    };

    return ctor;
});