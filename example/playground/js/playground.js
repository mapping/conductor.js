/*globals $*/

// Pluck off the RSVP object from Conductor and
// re-export it to the global scope.
window.RSVP = Conductor.Oasis.RSVP;

// Create a namespace for the Playground jQuery app
// to live in.
window.Playground = {
  initialize: function() {
    // Create a new Conductor instance that will
    // manage all of the cards on the page.
    this.conductor = new Conductor();

    // Wiretap the card and configure any events
    // to be displayed in the analytics panel on
    // screen.
    //this.initializeAnalytics();

    this.initializeServices();
    this.initializeCards();
    this.initializeAnalytics();

    $('#show-borders').on('change', function() {
      $('body').toggleClass('show-borders', $(this).val());
    });

    this.cardTemplate = $('.card-wrapper').hide();

    this.conductor.services.survey = Conductor.Oasis.Service.extend({
      initialize: function (port) {
        this.sandbox.surveyPort = port;
      },
      events: {
        surveyTaken: function (data) {
          console.log("User took a survey:", data);
        }
      }
    });

    this.conductor.services.video = Conductor.Oasis.Service.extend({
      initialize: function (port) {
        this.sandbox.videoPort = window.videoPort = port;
      },
      events: {
        videoWatched: function () {
          console.log("User watched a video");
        }
      }
    });
    
    this.conductor.loadData('../cards/tutorial/ad_card.js', '1', { videoId: '4d8ZDSyFS2g'});
    this.addCard('../cards/tutorial/ad_card.js', 1, ['video', 'survey']);
  }
};

RSVP.EventTarget.mixin(window.Playground);

// Initialize the Playground application once the
// page has finished loading.
$(function() {
  Playground.initialize();
});

(function() {
  "use strict";

  addStringExtensions();

  function addStringExtensions() {
    var stringProto = String.prototype;

    function fmt(str, formats) {
      // first, replace any ORDERED replacements.
      var idx  = 0; // the current index for non-numerical replacements
      return str.replace(/%@([0-9]+)?/g, function(s, argIndex) {
        argIndex = (argIndex) ? parseInt(argIndex,0) - 1 : idx++ ;
        s = formats[argIndex];
        return ((s === null) ? '(null)' : (s === undefined) ? '' : s).toString();
      }) ;
    }

    stringProto.fmt = function() {
      return fmt(this, arguments);
    };

    function extend(prop, getter) {
      Object.defineProperty(stringProto, prop, {
        get: getter
      });
    }

    extend('p', function() {
      return '<p>'+this+'</p>';
    });

    extend('bold', function() {
      return '<span style="font-weight: bold;">'+this+'</span>';
    });

    var colors = {
      red: '#a00',
      green: '#0a0',
      blue: '#4866ff',
      yellow: '#aa0',
      teal: '#0aa',
      magenta: '#a0a',
      lightGrey: '#aaa',
      veryLightGrey: '#666'
    };

    Object.keys(colors).forEach(function(color) {
      extend(color, function() {
        return "<span style='color: "+colors[color]+";'>"+this+"</span>";
      });
    });
  }
})();
