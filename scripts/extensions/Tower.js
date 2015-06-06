define(['Phaser', 'extensions/Monster'], function (Phaser, Monster) {
    'use strict';

    var Tower = function (game, xTile, yTile, towerSprite, damage, range, fireRate, health, price, frame) { // Extends Phaser.Sprite
        this.xTile = xTile;
        this.yTile = yTile;

        Phaser.Sprite.call(this, game, xTile * game.tileSize - 1, yTile * game.tileSize, towerSprite, frame);

        this.anchor.setTo(0.5, 0.5);
        this.alive = true;
        this.game.physics.arcade.enableBody(this);

        this.damage = damage;
        this.range = range;
        this.health = health;
        this.fireRate = fireRate;
        this.clearLaserTime = game.time.now;
        this.nextShotTime = game.time.now;
        this.price = price;

        this.body.allowGravity = false;

        this.laserBeam = this.game.add.graphics(0, 0);
    };

    Tower.prototype = Object.create(Phaser.Sprite.prototype);
    Tower.prototype.constructor = Tower;

    Tower.prototype.attack = function (tower, generators, monsters) {
        if (tower.game.time.now > tower.clearLaserTime) {
            tower.laserBeam.clear();
            tower.clearLaserTime = tower.game.time.now + 10000;
        }

        if (tower.game.time.now > tower.nextShotTime) {
            var targets = [];
            monsters.forEach(function (monster) {
                if (monster.alive) {
                    if (Math.abs(tower.game.tilePath[monster.tile].y - tower.yTile) <= tower.range &&
                        Math.abs(tower.game.tilePath[monster.tile].x - tower.xTile) <= tower.range) {
                        targets.push(monster);
                    }
                }
            });

            if (targets.length > 0) {
                var sources = [];
                var supplyLimit = 3;

                generators.forEach(function (generator) {
                    if (generator.alive) {
                        if (Math.abs(generator.yTile - tower.yTile) <= supplyLimit &&
                            Math.abs(generator.xTile - tower.xTile) <= supplyLimit) {
                            sources.push(generator);
                        }
                    }
                });

                var damage = tower.damage;

                if (sources.length > 0) {
                    damage *= (sources.length - 1);
                }

                tower.laserBeam.lineStyle(5, 0xFF0000);
                tower.laserBeam.moveTo(tower.x, tower.y - tower.height / 2 + 10);
                tower.laserBeam.lineTo(targets[0].x, targets[0].y);

                Monster.prototype.damageTaken(targets[0], damage);
            }
            tower.clearLaserTime = tower.game.time.now + 40;
            tower.nextShotTime = tower.game.time.now + tower.fireRate;
        }
    };

    Tower.prototype.fire = function (tower, monster) {
    };

    Tower.prototype.damageTaken = function (tower, damage) {
        tower.health -= damage;

        if (tower.health <= 0) {
            tower.health = 0;
            Tower.prototype.death(this);
        }
    };

    Tower.prototype.death = function (tower) {
        console.log('tower destroyed' + tower);

        tower.laserBeam.destroy();
        tower.kill();
    };

    return Tower;
});
