Conductor.require('/example/libs/jquery-1.9.1.js');
Conductor.requireCSS('/example/cards/tutorial/youtube_card.css');

var card = Conductor.card({
  videoId: null,

  activate: function (data) {
    Conductor.Oasis.RSVP.EventTarget.mixin(this);
    this.videoId = data.videoId;
  },

  initializeDOM: function () {
    $('body').html('<img id="thumbnail" /><div id="player"></div>');
    $('head').append('<script src="https://www.youtube.com/iframe_api"></script>');

    this.on('resize', this.resizeThumbnail);
  },

  render: function (intent, dimensions) {
    this.setDimensions(dimensions);

    $('#thumbnail').attr('src', 'http://img.youtube.com/vi/' + this.videoId + '/0.jpg');
  },

  resizeThumbnail: function () {
    var dimensions = this.getDimensions();
    $('#thumbnail').css({ height: dimensions.height });
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

    this.trigger('resize');
  }
});
