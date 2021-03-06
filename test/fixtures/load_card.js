Conductor.require("alert.js");

var card = Conductor.card({
  activate: function() {
    ok(true, "Card was activated");
    start();
  },

  events: {
    didLoadData: function(data) {
      this.cards = data.cards;
    },

    render: function() {
      this.cards.forEach(function(childCard) {
        document.body.innerHTML += '<p>' + childCard.type + '</p>';
      });
    }
  }
});
