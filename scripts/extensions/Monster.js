define(['Phaser'], function (Phaser) {
    'use strict';

    var Monster = function (game, xTile, yTile, damage, monsterSprite, frame) { // Extends Phaser.Sprite
        Phaser.Sprite.call(this, game, xTile * game.tileSize - 1, yTile * game.tileSize, monsterSprite, frame);

        this.scale.setTo(1.5, 1.5);
        this.anchor.setTo(0.5, 0.5);
        this.alive = true;
        this.game.physics.arcade.enableBody(this);

        this.body.allowGravity = false;
        this.tile = -1;
        this.speed = 2.5;
        this.health = 100;
        this.maxHealth = 100;
        this.damage = damage;

        this.healthBar = this.game.add.graphics(0, 0);
        this.healthBar.lineStyle(2, 0x000000, 1);
        this.healthBar.beginFill(0xFFFF00, 0.8);
        this.healthBar.drawRect(0, 0, this.width, 5);

        this.healthBarStatus = this.game.add.graphics(0, 0);
        this.healthBarStatus.lineStyle(2, 0x000000, 0);
        this.healthBarStatus.beginFill(0x00FF00, 0.9);
        this.healthBarStatus.drawRect(0, 0, this.width, 5);

        this.explosion = this.game.add.sprite(0, 0, 'explosion');
        this.explosion.anchor.x = 0.5;
        this.explosion.anchor.y = 0.5;
        this.explosion.width = Math.abs(this.width);
        this.explosion.scale.y = this.explosion.scale.x;
        this.explosion.animations.add('explosion');

        this.death = this.game.add.sprite(0, 0, 'death');
        this.death.anchor.x = 0.5;
        this.death.anchor.y = 0.5;
        this.death.width = 150;
        this.death.height = 150;
        this.death.scale.y = this.death.scale.x;
        this.death.animations.add('death');

        Monster.prototype.nextMove(this);
        Monster.prototype.move(this);
    };

    Monster.prototype = Object.create(Phaser.Sprite.prototype);
    Monster.prototype.constructor = Monster;

    Monster.prototype.move = function (monster) {
        monster.x += monster.speedX;
        monster.y += monster.speedY;

        if (monster.speedX > 0 && monster.x >= monster.nextPosX) {
            monster.x = monster.nextPosX;
            Monster.prototype.nextMove(monster);
        } else if (monster.speedX < 0 && monster.x <= monster.nextPosX) {
            monster.x = monster.nextPosX;
            Monster.prototype.nextMove(monster);
        } else if (monster.speedY > 0 && monster.y >= monster.nextPosY) {
            monster.y = monster.nextPosY;
            Monster.prototype.nextMove(monster);
        } else if (monster.speedY < 0 && monster.y <= monster.nextPosY) {
            monster.y = monster.nextPosY;
            Monster.prototype.nextMove(monster);
        }

        monster.healthBar.x = monster.x - monster.width / 2;
        monster.healthBar.y = monster.y - monster.height / 2 - 10;

        monster.healthBarStatus.x = monster.x - monster.width / 2;
        monster.healthBarStatus.y = monster.y - monster.height / 2 - 10;

        var healthRatio = monster.health / monster.maxHealth;
        monster.healthBarStatus.scale.x = healthRatio;

        monster.explosion.x = monster.x;
        monster.explosion.y = monster.y;
    };

    Monster.prototype.nextMove = function (monster) {
        if (monster.tile < monster.game.tilePath.length - 1) {
            monster.tile++;
        }
        monster.nextPosX = monster.game.tilePath[monster.tile].x * monster.game.tileSize;
        monster.nextPosY = monster.game.tilePath[monster.tile].y * monster.game.tileSize;

        if (monster.nextPosX > monster.x) {
            monster.speedX = monster.speed;
        } else if (monster.nextPosX < monster.x) {
            monster.speedX = -monster.speed;
        } else {
            monster.speedX = 0;
        }

        if (monster.nextPosY > monster.y) {
            monster.speedY = monster.speed;
        } else if (monster.nextPosY < monster.y) {
            monster.speedY = -monster.speed;
        } else {
            monster.speedY = 0;
        }
    };

    Monster.prototype.damageTaken = function (monster, damage) {
        monster.health -= damage;

        if (monster.health < 0) {
            monster.health = 0;

            monster.healthBar.destroy();
            monster.healthBarStatus.destroy();
            monster.explosion.destroy();
            monster.death.x = monster.x;
            monster.death.y = monster.y;
            monster.game.fx.play("death");
            monster.death.play('death', 10, false, true);
            monster.kill();
            monster.game.score += 10;
            monster.game.scoreText.text = 'Score: ' + monster.game.score;
        }
        else {
            monster.game.fx.play("shot");
            monster.explosion.play('explosion', 10, false, false);
        }
    };

    return Monster;
});
