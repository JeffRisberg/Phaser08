'use strict';

requirejs.config({
    baseUrl: './scripts/',
    paths: {
        //libs
        almond: '../bower_components/almond/almond',
        phaser: '../bower_components/phaser/dist/phaser.min',
        Phaser: '../bower_components/phaser/dist/phaser.min',

        //states
        bootState: 'states/boot',
        preloadState: 'states/preload',
        menuState: 'states/menu',
        gameState: 'states/game'
    }
});

require([
    'phaser',
    'bootState',
    'preloadState',
    'menuState',
    'gameState'
], function (phaser, boot, preload, menu, game) {
    var phaserGame = new Phaser.Game("100", "100", Phaser.AUTO, 'Phaser06');

    phaserGame.state.add('boot', boot);
    phaserGame.state.add('preload', preload);
    phaserGame.state.add('menu', menu);
    phaserGame.state.add('game', game);
    phaserGame.state.start('boot');

    return phaserGame;
});

