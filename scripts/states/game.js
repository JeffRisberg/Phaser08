define(['extensions/Monster', 'extensions/Generator', 'extensions/Tower'],
    function (Monster, Generator, Tower) {
        'use strict';
        var game;

        // Primary map display
        var mapSprite;

        // Groups
        var generators;
        var monsters;
        var towers;

        var generator;
        var tower;
        var timers = {};
        var gameover;

        function Game(_game) {
            game = _game;

            game.score = 0;
            game.money = 1000;
        }

        Game.prototype = {
            create: function () {
                this.game.physics.startSystem(Phaser.Physics.ARCADE);

                this.game.map = this.game.add.tilemap('tileData');

                this.game.map.addTilesetImage('tileSet', 'tileSet');

                this.game.layer = this.game.map.createLayer('control');

                this.game.tilePath = this.calcPath(this.game.map, this.game.layer);
                this.game.tileSize = 32;

                mapSprite = this.game.add.sprite(0, 0, 'mapImage');

                // Create group for generators
                generators = this.game.add.group();
                generators.enableBody = true;
                this.game.physics.enable(generators, Phaser.Physics.ARCADE);

                // Create group for monsters
                monsters = this.game.add.group();
                monsters.enableBody = true;
                this.game.physics.enable(monsters, Phaser.Physics.ARCADE);

                // Create group for towers
                towers = this.game.add.group();
                towers.enableBody = true;
                this.game.physics.enable(towers, Phaser.Physics.ARCADE);

                var style1 = { font: "11px Arial", fill: "#FFFFFF", align: "center" };
                var style2 = { font: "16px Arial", fill: "#FFFFFF", align: "center" };

                // Create tool for making Generators
                this.game.add.sprite(this.game.width - 200, this.game.height - 150, 'generator');
                generator = this.game.add.sprite(this.game.width - 200, this.game.height - 150, 'generator');
                generator.inputEnabled = true;
                generator.input.enableDrag();
                generator.events.onDragStop.add(this.addOneGenerator, this);
                text = "Generator";
                this.game.add.text(this.game.width - 120, this.game.height - 150, text, style1);
                text = "$50";
                this.game.add.text(this.game.width - 120, this.game.height - 120, text, style2);

                // Create tool for making Towers
                this.game.add.sprite(this.game.width - 200, this.game.height - 250, 'tower');
                tower = this.game.add.sprite(this.game.width - 200, this.game.height - 250, 'tower');
                tower.inputEnabled = true;
                tower.input.enableDrag();
                tower.events.onDragStop.add(this.addOneTower, this);
                text = "Tower";
                this.game.add.text(this.game.width - 120, this.game.height - 250, text, style1);
                text = "$100";
                this.game.add.text(this.game.width - 120, this.game.height - 230, text, style2);

                var text = "Cash available: $" + game.money;
                this.game.moneyText = this.game.add.text(this.game.width - 220, 50, text, { font: "14px Arial", fill: "#FFFFFF", align: "left" });

                text = "Score: " + game.score;
                this.game.scoreText = this.game.add.text(this.game.width - 220, 100, text, { font: "14px Arial", fill: "#FFFFFF", align: "left" });

                var freq = 4500;
                timers['monster'] = this.game.time.events.loop(freq, this.addOneMonster, this);

                this.game.fx = game.add.audio('sfx');
                this.game.fx.addMarker('ping', 10, 1.0);
                this.game.fx.addMarker('death', 12, 4.2);
                this.game.fx.addMarker('shot', 17, 1.0);

                gameover = false;
            },

            update: function () {
                var me = this;

                if (gameover == false) {
                    // Move the Monsters
                    monsters.forEach(function (monster) {
                        Monster.prototype.move(monster);
                    });

                    towers.forEach(function (tower) {
                        Tower.prototype.attack(tower, monsters);
                    });

                    // See if any monster has reach generator
                    monsters.forEach(function (monster) {
                            var monsterX = monster.x;
                            var monsterY = monster.y;

                            if (monster.alive) {
                                generators.forEach(function (generator) {
                                    var generatorX = generator.x;
                                    var generatorY = generator.y;

                                    if (Math.abs(monsterX - generatorX) < 32 && Math.abs(monsterY - generatorY) < 32) {
                                        var gameOverText = me.game.add.text(me.game.world.width / 2, me.game.world.height / 2, "Sorry, Game Over", { font: "50px Arial"});
                                        gameOverText.anchor.set(0.5);
                                        gameover = true;
                                    }
                                });
                            }
                        }
                    );
                }
            },

            // add a generator at the mouse position
            addOneGenerator: function (sprite, pointer) {
                var xTile, yTile;

                if (sprite != null) {
                    var x = sprite.x + this.game.tileSize / 2;
                    var y = sprite.y + this.game.tileSize / 2;

                    xTile = Math.round(x / this.game.tileSize);
                    yTile = Math.round(y / this.game.tileSize);
                }
                else {
                    var pathLength = this.game.tilePath.length;
                    xTile = this.game.tilePath[pathLength - 1].x;
                    yTile = this.game.tilePath[pathLength - 1].y;
                }
                var generator = generators.getFirstDead();

                if (generator === null) {

                    generator = new Generator(this.game, xTile, yTile, 1);
                    generators.add(generator);
                }

                if (sprite != null) {
                    sprite.x = this.game.width - 200;
                    sprite.y = this.game.height - 150;
                }
            },

            // add a monster at the start of the path
            addOneMonster: function () {
                var monster = monsters.getFirstDead();

                if (monster === null) {
                    var tileX = this.game.tilePath[0].x;
                    var tileY = this.game.tilePath[0].y;

                    monster = new Monster(this.game, tileX, tileY, 30, 'monster', 1);
                    monsters.add(monster);
                }
            },

            // add a tower at the mouse position
            addOneTower: function (sprite, pointer) {
                var x = sprite.x + this.game.tileSize / 2;
                var y = sprite.y + this.game.tileSize / 2;

                var xTile = Math.round(x / this.game.tileSize);
                var yTile = Math.round(y / this.game.tileSize);

                var towerSprite = 'tower';
                var offsetX = 30;
                var offsetY = 20;
                var damage = 30;
                var range = 4;
                var fireRate = 2500;
                var health = 1000;
                var price = 300;

                if (this.game.money > 0) {

                    var newTower = new Tower(this.game, xTile, yTile, towerSprite, damage, range, fireRate, health, price);
                    towers.add(newTower);

                    this.game.money -= 100;
                    this.game.moneyText.text = 'Cash available: $' + this.game.money;
                }

                sprite.x = this.game.width - 200;
                sprite.y = this.game.height - 250;
            },

            /**
             * Find the path from the tile with index 1 back to the starting point
             */
            calcPath: function (tilemap, layer) {
                var pathArray = [], yDetect, xDetect, oldTile;

                for (yDetect = 0; yDetect < tilemap.height; yDetect++) {
                    for (xDetect = 0; xDetect < tilemap.width; xDetect++) {
                        var tile = tilemap.getTile(xDetect, yDetect, layer, true);
                        if (tile.index === 1) { // starting point
                            pathArray.unshift({x: xDetect, y: yDetect});
                            break;
                        }
                    }

                    if (pathArray.length > 0) {
                        break;
                    }
                }

                // Step back one
                var tileToAdd = this.checkIndexAroundTile(tilemap, layer, 4, xDetect, yDetect, -50, -50);

                if (tileToAdd !== null) {
                    pathArray.unshift({x: tileToAdd.x, y: tileToAdd.y});
                    oldTile = pathArray[1];
                } else {
                    this.console.error("error1");
                    return null;
                }

                // Continue stepping back
                while (tileToAdd !== null) {
                    tileToAdd = this.checkIndexAroundTile(tilemap, layer, 4, tileToAdd.x, tileToAdd.y, oldTile.x, oldTile.y);
                    if (tileToAdd !== null) {
                        pathArray.unshift({x: tileToAdd.x, y: tileToAdd.y});
                        oldTile = pathArray[1];
                    } else {
                        return pathArray;
                    }
                }
            },

            /**
             * Locate a tile of the specified index that is adjacent to (tileX, tileY),
             * and is not at (previousX, previousY)
             */
            checkIndexAroundTile: function (tilemap, layer, desiredIndex, tileX, tileY, previousX, previousY) {
                var tile;

                tile = tilemap.getTile(tileX + 1, tileY, layer, true);
                if ((tile) && (tile.index === desiredIndex) && ((previousX !== tileX + 1) || (previousY !== tileY))) {
                    return tile;
                }

                tile = tilemap.getTile(tileX, tileY + 1, layer, true);
                if ((tile) && (tile.index === desiredIndex) && ((previousX !== tileX) || (previousY !== tileY + 1))) {
                    return tile;
                }

                tile = tilemap.getTile(tileX - 1, tileY, layer, true);
                if ((tile) && (tile.index === desiredIndex) && ((previousX !== tileX - 1) || (previousY !== tileY))) {
                    return tile;
                }

                tile = tilemap.getTile(tileX, tileY - 1, layer, true);
                if ((tile) && (tile.index === desiredIndex) && ((previousX !== tileX) || (previousY !== tileY - 1))) {
                    return tile;
                }

                return null;
            }
        };

        return Game;
    })
;
