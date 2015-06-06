define(function () {
    'use strict';
    var game;

    function Boot(_game) {
        game = _game;
    }

    Boot.prototype = {
        preload: function () {
            this.load.image('preloader', 'assets/sprites/loader.png');
        },

        create: function () {
            this.game.state.start('preload');
        }
    };

    return Boot;
});
