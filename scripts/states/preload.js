define(function () {
    'use strict';
    var game;

    function Preload(_game) {
        game = _game;
    }

    Preload.prototype = {

        preload: function () {
            this.ready = false;
            this.game.load.start();

            this.loading = this.add.sprite(this.game.world.width / 2 - 50, this.game.world.height / 2 - 50, 'preloader');
            this.loading.anchor.setTo(0.5, 0.5);

            this.game.load.setPreloadSprite(this.loading);

            this.game.stage.backgroundColor = '#222222';

            this.game.load.image('tower', 'assets/sprites/tower.jpg');
            this.game.load.image('generator', 'assets/sprites/generator.jpg');
            this.game.load.image('monster', 'assets/sprites/monster.png');

            this.game.load.atlasJSONHash('explosion', 'assets/sprites/explosion.png', 'assets/sprites/explosion.json');
            this.game.load.atlasJSONHash('death', 'assets/sprites/death.png', 'assets/sprites/death.json');

            this.game.load.tilemap('tileData', 'assets/tilemaps/tileData.json', null, Phaser.Tilemap.TILED_JSON);
            this.game.load.image('tileSet', 'assets/tilemaps/tileSet.png');
            this.game.load.image('mapImage', 'assets/tilemaps/mapArt.png');

            this.game.load.image('menu', 'assets/backgrounds/menu.png');

            this.load.spritesheet('btn-game-start', 'assets/buttons/btn-game-start.png', 401, 143);

            this.load.audio('sfx', 'assets/audio/fx_mixdown.ogg');
        },

        create: function () {
            this.game.load.onLoadComplete.addOnce(this.loadComplete, this);
        },

        update: function () {
            if (this.ready) {
                this.game.state.start('menu');
            }
        },

        loadComplete: function () {
            this.ready = true;
        }
    }

    return Preload;
});

