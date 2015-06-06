define(['Phaser'], function (Phaser) {
    'use strict';

    var Generator = function (game, xTile, yTile, frame) { // Extends Phaser.Sprite
        this.xTile = xTile;
        this.yTile = yTile;

        Phaser.Sprite.call(this, game, xTile * game.tileSize - 1, yTile * game.tileSize, 'generator', frame);

        this.scale.setTo(1.0, 1.0);
        this.anchor.setTo(0.5, 0.5);
        this.alive = true;
        this.game.physics.arcade.enableBody(this);

        this.body.allowGravity = false;

        this.tile = -1;
    };

    Generator.prototype = Object.create(Phaser.Sprite.prototype);
    Generator.prototype.constructor = Generator;

    Generator.prototype.update = function () {
    };

    return Generator;
});
