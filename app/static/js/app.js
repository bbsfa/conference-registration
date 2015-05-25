$(document).ready(function() {
  'use strict';
  var app = angular.module('app', ['ngResource']);

  app.config([function() {

  }]);

  app.run([function() {

  }]);

  app.directive('input', [function() {
    return {
      restrict: 'E',
      link: function($scope, $element) {
        var type = $element.attr('type');
        if (type == 'radio') {
          $.material[type]($element);
        }
      }
    };
  }]);

  app.factory('Signup', ['$resource', function($resource) {
    return $resource('/api/signup');
  }]);

  app.value('shirtSizes', [
      { id: 'YS',  group: 'Youth', name: 'Youth Small' },
      { id: 'YM',  group: 'Youth', name: 'Youth Medium' },
      { id: 'YL',  group: 'Youth', name: 'Youth Large' },
      { id: 'S',   group: 'Adult', name: 'Small' },
      { id: 'M',   group: 'Adult', name: 'Medium' },
      { id: 'L',   group: 'Adult', name: 'Large' },
      { id: 'XL',  group: 'Adult', name: 'XL' },
      { id: '2XL', group: 'Adult', name: '2XL' },
      { id: '3XL', group: 'Adult', name: '3XL' },
  ]);

  app.factory('bbsGenes', function() {
    var genes = []
    for (var i = 1; i <= 18; i++) {
      genes.push('BBS' + i);
    }
    return genes;
  });

  app.factory('birthYears', function() {
    var start = new Date().getFullYear();
    var end   = start - 100;
    var years = [];
    for (var year = start; year >= end; year--) {
      years.push(year);
    }
    return years;
  });

  app.controller('AppCtrl', ['$scope', '$window', 'shirtSizes', 'bbsGenes', 'birthYears', 'Signup',
    function($scope, $window, shirtSizes, bbsGenes, birthYears, Signup) {

    $scope.shirtSizes = shirtSizes;
    $scope.bbsGenes = bbsGenes;
    $scope.birthYears = birthYears;

    $scope.signup = {
      attendees: [],
      bbs: {},
      payment_method: 'paypal'
    };

    // Test Data
    $scope.signup.name      = 'Gary Hurst';
    $scope.signup.address   = '4879 Hardman Road';
    $scope.signup.address2  = '';
    $scope.signup.city      = 'South Burlington';
    $scope.signup.state     = 'VT';
    $scope.signup.zip       = '05403';
    $scope.signup.email     = 'ghurst@example.com';
    $scope.signup.phone     = '802-846-0249';
    $scope.signup.shirt_size = shirtSizes[4];

    $scope.signup.bbs.relationship = 'Parent';
    $scope.signup.bbs.gene = bbsGenes[1];
    $scope.signup.bbs.birth_year = birthYears[6];
    $scope.signup.bbs.cribbs = 'joined';

    $scope.addAttendee = function() {
      $scope.signup.attendees.push({
        name: '',
        ticket_type: 'adult'
      });
    };

    var calculateRegistrationAmount = function() {
      var total = 40;
      for(var i = 0, l = $scope.signup.attendees.length; i < l; i++) {
        var ticketType = $scope.signup.attendees[i].ticket_type;
        total += ticketType === 'child' ? 20 : 40;
      }
      return total;

    };

    var donation = 0;
    var calculateDonation = function() {
      var donation = 0;
      if ($scope.signup.donation) {
        donation = $scope.signup.donation === 'other' ?
            $scope.signup.donation_other : $scope.signup.donation;
        donation = parseFloat(donation)
        if (isNaN(donation)) {
          donation = 0;
        }
        return donation;
      }
    };

    var updateTotal = function() {
      $scope.total = $scope.registrationAmount + donation;
    };

    var onDonationChange = function(newValue, oldValue) {
      if (newValue === oldValue) {
        return;
      }
      donation = calculateDonation();
      updateTotal();
    };

    $scope.$watch('signup.attendees', function() {
      $scope.registrationAmount = calculateRegistrationAmount();
      updateTotal();
    }, true);

    $scope.$watch('signup.donation', onDonationChange);
    $scope.$watch('signup.donation_other', onDonationChange);

    $scope.submit = function() {
      var args = angular.copy($scope.signup);
      args.shirt_size = args.shirt_size.id;
      args.total = $scope.total;
      args.donation_amount = donation;
      var signup  = new Signup(args);

      $scope.submitting = true;
      var promise = signup.$save();
      promise.then(function(response) {
        if ($scope.signup.payment_method == 'paypal' && response.paypal_url) {
          $window.location = response.paypal_url;
        } else {
          $scope.showPostSignup = true;
        }
      });
      promise.finally(function() {
        if ($scope.showPostSignup) {
          $scope.submitting = false;
        }
      });

    };

  }]);

  angular.bootstrap(document, ['app']);
  $.material.init();
});
