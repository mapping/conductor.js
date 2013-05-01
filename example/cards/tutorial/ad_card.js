/*global Handlebars */

Conductor.require('/example/libs/jquery-1.9.1.js');
Conductor.require('/example/libs/handlebars-1.0.0-rc.3.js');
Conductor.requireCSS('/example/cards/tutorial/ad_card.css');


var videoSelectTemplate = '<div id="selectWrapper">Load Video: <select id="videoSelect">{{#each videoIds}}<option value="{{this}}">{{this}}</option>{{/each}}</select></div>';

var card = Conductor.card({
  videoIds: ['4d8ZDSyFS2g', 'EquPUW83D-Q'],

  consumers: {
    survey: Conductor.Oasis.Consumer,
    video: Conductor.Oasis.Consumer.extend({
      events: {
        play: function () {
          card.promise.then(function () {
            return card.videoCard.promise;
          }).then(function () {
            card.videoCard.sandbox.videoPort.send('play');
          });
        }
      }
    })
  },

  services: {
    video: Conductor.Oasis.Service.extend({
      initialize: function (port) {
        this.sandbox.videoPort = port;
      },
      events: {
        'videoWatched': function () {
          card.render('takeSurvey');
        }
      }
    }),

    survey: Conductor.Oasis.Service.extend({
      events: {
        'surveyTaken': function (grade) {
          card.consumers.survey.send('surveyTaken', {
            videoId: card.videoId,
            grade: grade
          });
        }
      }
    })
  },

  childCards: [
    {url: '../cards/tutorial/youtube_card.js', id: '1', options: { capabilities: ['video']}},
    {url: '../cards/tutorial/survey_card.js', id: '1',  options: { capabilities: ['survey']}}
  ],

  loadDataForChildCards: function(data) {
    var videoCardOptions = this.childCards[0],
        surveyCardOptions = this.childCards[1];

    this.videoId = this.videoIds[0];
    videoCardOptions.data = { videoId: this.videoId };
  },

  activate: function () {
    Conductor.Oasis.RSVP.EventTarget.mixin(this);

    videoSelectTemplate = Handlebars.compile(videoSelectTemplate);
    this.videoCard = this.childCards[0].card;
    this.surveyCard = this.childCards[1].card;
  },

  render: function (intent, _dimensions) {
    this.setDimensions(_dimensions);

    var dimensions = {
      width: this.getDimensions().width,
      height: this.cardWrapperDiv.height()
    };

    switch (intent) {
      case "thumbnail":
      case "video":
        $(this.videoCard.sandbox.el).css({
          width: dimensions.width,
          height: dimensions.height
        });
        this.videoCard.render('small', dimensions);
        $(this.surveyCard.sandbox.el).hide();
        break;
      case "takeSurvey":
        // TODO: change to use height service
        var videoWidth = dimensions.height * (267/200),
            surveyWidth = dimensions.width - videoWidth;
        $(this.videoCard.sandbox.el).css({
          width: videoWidth,
          height: dimensions.height
        });
        $(this.surveyCard.sandbox.el).css({
          width: surveyWidth,
          height: dimensions.height
        });
        this.videoCard.render('thumbnail',  { width: videoWidth,  height: dimensions.height });
        this.surveyCard.render('small',     { width: surveyWidth, height: dimensions.height });
        $(this.surveyCard.sandbox.el).show();
        break;
      case "summary":
        break;
    }
  },

  initializeDOM: function () {
    var card = this;

    $(videoSelectTemplate(this)).appendTo('body');
    $('#videoSelect').change(function () {
      card.changeVideo($(this).val());
    });

    this.selectWrapperDiv = $('#selectWrapper');
    this.cardWrapperDiv = $('<div id="cardWrapper"></div>');
    this.cardWrapperDiv.appendTo('body');
    this.videoCard.appendTo(this.cardWrapperDiv[0]);
    this.surveyCard.appendTo(this.cardWrapperDiv[0]);
  },

  changeVideo: function (videoId) {
    this.videoId = videoId;
    this.conductor.loadData('../cards/tutorial/youtube_card.js', '1', { videoId: this.videoId });
    this.render('video');
  },

  getDimensions: function () {
    if (!this._dimensions) { this.setDimensions(); }
    return this._dimensions;
  },

  setDimensions: function (dimensions) {
    if (dimensions !== undefined) {
      this._dimensions = dimensions;
    } else {
      this._dimensions = {
        height: window.innerHeight,
        width: window.innerWidth
      };
    }

    this.cardWrapperDiv.height(this._dimensions.height - this.selectWrapperDiv.height());
  }
});
