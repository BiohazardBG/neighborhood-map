var ViewModel = function() {
    var self = this;
    self.showRow = ko.observable(false);
    self.toggleVisibility = function() {
        $('.navbar-nav').toggleClass('slide-in');
        $('.side-body').toggleClass('body-slide-in');
    };
};

ko.applyBindings(new ViewModel());