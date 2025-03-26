export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, textureKey) {
        super(scene, x, y, textureKey);
        this.interface = this.scene.scene.get('interfaceJeu');
        // la plupart des proprietes sont dans l'objet playerProperties
        this.playerProperties = this.interface.playerProperties;

        // Physique du joueur
        scene.add.existing(this);
        scene.physics.world.enable(this); // Active la physique pour le joueur
        this.refreshBody();
        this.setBounce(0.2);
        this.setCollideWorldBounds(true);
        this.setDepth(50);
        this.body.setMaxVelocityY(400);

        if (typeof (this.scene.game.config.player_gravity) != 'undefined') {
            this.gravity = this.scene.game.config.player_gravity - this.scene.physics.world.gravity.y;
        }
        else this.gravity = 300;
        //  this.body.gravity.y = this.gravity;

        this.direction = "right";
        this.isShooting = false;
        this.isMoving = true;
        this.isJumping = false;
        this.onLadder = false;
        this.justCrossingPortal = false;
        this.invincible = false;

        // gestion de l'arme
        this.closeCombat = this.scene.game.config.player_closeCombat;

        if (this.closeCombat == true) {
            this.weapon = this.scene.physics.add.sprite(this.x, this.y, 'bullet');
            this.weapon.setVisible(false);
            this.weapon.setSize(40, 8);
            this.weapon.setOrigin(0, 0);
            this.weapon.body.allowGravity = false;
            this.weapon.disableBody(true, true);
            this.weapon.setDepth(49);
        }


        this.body.setCollideWorldBounds(true); // Empêche le joueur de sortir des limites du monde
        this.body.setBounce(0.2); // Rebondissement lorsque le joueur heurte quelque chose (facultatif)
        this.body.setGravityY(300); // Gravité du joueur (facultatif, dépend du jeu)

        // Configuration des touches de déplacement
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.jumpKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.fireKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

        if (scene.sys.settings.key == "map_recto") {

        }

   
        this.itemCollected = 0;
        if (this.scene.mapReversed == true) {
            this.coefDirection = -1;
        }
        else {
            this.coefDirection = 1;
        }

    }

    // Gestion des attributs liés au mouvement
    getSpeed() {
        return this.playerProperties.speed;
    }

    getAcceleration() {
        return this.playerProperties.acceleration;
    }

    getJumpHeight() {
        return this.playerProperties.jumpHeight;
    }

    increaseJumpHeight(increaseHeightValue) {
        this.playerProperties.jumpHeight += increaseHeightValue;
    }

    increaseSpeed(increaseSpeedValue) {
        this.playerProperties.speed += increaseSpeedValue;
    }

    // Gestion des attributs liés au combat
    getProjectileDuration() {
        return this.playerProperties.projectileDuration;
    }

    getProjectileSpeed() {
        return this.playerProperties.projectileSpeed;
    }

    getCoolDownDuration() {
        return this.playerProperties.coolDownDuration;
    }

    fire() {
        // attaque au corps à corps
        if (this.closeCombat == true) {
            this.weapon.enableBody(true, this.x, this.y, true, true);
            this.weaponEnabled = true;
            this.scene.time.delayedCall(500, function () {
                this.weapon.disableBody(true, true);
                this.weaponEnabled = false;
            }, [], this);
        }
        // attaque a distance
        else {
            var projectile;
            if (this.scene.anims.exists("anim_projectile_player")) {
                projectile = this.scene.physics.add.sprite(this.x, this.y, 'projectile_player_SS');
            }
            else
                projectile = this.scene.physics.add.sprite(this.x, this.y, 'bullet');

            this.scene.grp_bullet_player.add(projectile);
            projectile.body.allowGravity = false;
            projectile.setDepth(50);
            projectile.setVelocityX(this.getProjectileSpeed());
            // direction et texture du projectile en fonction de l'orientation du joueur
            if (this.flipX == true) {
                projectile.setVelocityX(-this.getProjectileSpeed());
                projectile.flipX = true;
                projectile.x = projectile.x - this.scene.game.config.ss["player_shoot_right"].width / (2 * this.scene.game.config.ss["player_shoot_right"].nbFrames);
            }
            else {
                projectile.x = projectile.x + this.scene.game.config.ss["player_shoot_right"].width / (2 * this.scene.game.config.ss["player_shoot_right"].nbFrames);
            }
            // lancement de l'animation du spritesheet projectile si elle existe
            if (this.scene.anims.exists("anim_projectile_player")) {
                projectile.anims.play({ key: "anim_projectile_player", repeat: -1 })
            }
            // destruction du projectile après un certain délai
            this.scene.time.delayedCall(this.getProjectileDuration(), function () {
                projectile.destroy();
            }, [], this);
        }
    }

    // Gestion de la santé
    getHealth() {
        return this.playerProperties.health;
    }

    decreaseHealthPoints() {
        this.playerProperties.health--;
    }

    increaseHealthPoints() {
        if (this.getHealth() < this.getMaxHealth()) {
            this.playerProperties.health++;
        }
    }

    resetHealthPoints() {
        this.playerProperties.health = this.playerProperties.maxHealth;
    }

    getMaxHealth() {
        return this.playerProperties.maxHealth;
    }

    increaseMaxHealthPoints() {
        this.playerProperties.maxHealth++;
    }

    setInvincible() {
        this.invincible = true;
        this.setTint("0xFF0000")
        // Activer l'animation de clignotement
        this.blinkAnimation = this.scene.tweens.add({
            targets: this,
            alpha: 0.3, // Baisser l'opacité à 50%
            duration: 150, // Durée d'une itération de clignotement
            ease: 'Linear',
            repeat: -1, // Répéter indéfiniment
            yoyo: true // Inverser l'animation (pour que le sprite clignote)
        });
        // Timer pour revenir à l'état normal après 3 secondes
        this.scene.time.delayedCall(3000, () => {
            this.invincible = false;
            this.clearTint();
            this.alpha = 1; // Remettre l'opacité à 100%
            this.blinkAnimation.stop(); // Arrêter l'animation de clignotement
        }, [], this);
    }

    isInvincible() {
        return this.invincible;
    }

    isDead() {
        return (this.getHealth() == 0);
    }

    // Gestion des vies
    getLifes() {
        return this.playerProperties.lifes;
    }

    decreaseLife() {
        this.playerProperties.lifes--;
    }

    // Gestion des objets collectés
    collectItem(item) {
        if (item.getType() == "collect") {
            this.playerProperties.itemsCollected++;
        }
        if (item.getType() == "hearth") {
            this.increaseHealthPoints();
        }
    }

    // Gestion de l'apparence
    setNewLook(proprietes) {
        // apparence dynamique :

        if (typeof (proprietes.shoot) != 'undefined') this.playerProperties.animShootName = proprietes.shoot;
        if (typeof (proprietes.move) != 'undefined') this.playerProperties.animMoveName = proprietes.move;
        if (typeof (proprietes.jump) != 'undefined') this.playerProperties.animJumpName = proprietes.jump;
        if (typeof (proprietes.stand) != 'undefined') this.playerProperties.animStandtName = proprietes.stand;
    }

    // Gestion des kills
    getKills() {
        return this.playerProperties.kills;
    }

    addOneKill() {
        this.playerProperties.kills++;
    }

    // Gestion des états et du statut
    resetStatut() {
        this.direction = "right";
        this.isShooting = false;
        this.isMoving = true;
        this.isJumping = false;
        this.onLadder = false;
        this.justCrossingPortal = false;
        this.invincible = false;

        this.prepareToJump = false;
        this.body.setVelocityX(0);
        this.body.setAccelerationX(0);
    }

    setDestinationReached(valueToAffect) {
        this.playerProperties.destinationReached = valueToAffect;
    }

    // Méthodes liées au mouvement et à l'update
    update(ladder_layer) {
        // escalade sur une echelle
        if (ladder_layer != null) {
            const playerTileUp = ladder_layer.getTileAtWorldXY(this.x, this.getTopCenter().y + 1);
            const playerTileDown = ladder_layer.getTileAtWorldXY(this.x, this.getBottomCenter().y - 1);
            if (playerTileUp || playerTileDown) {
                this.onLadder = true;
                this.body.gravity.y = 0;
            }
            else {
                this.onLadder = false;
                this.body.gravity.y = this.gravity;
            }
        }

        // Déplacement et statut
        if (this.cursors.left.isDown && this.cursors.right.isDown) {
            this.setVelocityX(0);
            this.setAccelerationX(0);
        }
        if (this.cursors.left.isDown) {
            if (this.isJumping == false) {
                if (this.direction == "right" && this.isMoving == true) {
                    this.setAccelerationX(0);
                    this.setVelocityX(0);
                }

                this.setAccelerationX(-this.getAcceleration() * this.coefDirection);
                // Limitation de la vitesse maximale
                if (this.body.velocity.x * this.coefDirection < -this.getSpeed() * this.coefDirection) {
                    this.body.setVelocityX(-this.getSpeed() * this.coefDirection);
                }
            }
            else this.body.setVelocityX(-this.getSpeed() * this.coefDirection / 2);
            if (typeof (this.scene.fond) != "undefined" && this.x > 680) {
                this.scene.fond.tilePositionX -= 0.35;
            }
            this.direction = "left";
            this.isMoving = true;
        } else if (this.cursors.right.isDown) {
            if (this.isJumping == false) {
                if (this.direction == "left" && this.isMoving == true) {

                    this.setAccelerationX(0);
                    this.setVelocityX(0);
                }
                this.setAccelerationX(this.getAcceleration() * this.coefDirection);

                // Limitation de la vitesse maximale
                if (this.body.velocity.x * this.coefDirection > this.getSpeed() * this.coefDirection) {
                    this.body.setVelocityX(this.getSpeed() * this.coefDirection);
                }

            }
            else this.body.setVelocityX(this.getSpeed() * this.coefDirection / 2);
            if (typeof (this.scene.fond) != "undefined" && this.x > 680) {
                this.scene.fond.tilePositionX += 0.35;
            }
            this.direction = "right";
            this.isMoving = true;

        } else {
            this.body.setVelocityX(0);
            this.body.setAccelerationX(0);
            this.isMoving = false;
        }
        if (this.direction == "right") {
            this.flipX = false;
        }
        else {
            this.flipX = true;
        }
        if (this.body.onFloor()) {
            this.isJumping = false;
            this.setVelocityY(0);
        }
        // Saut
        // saut controllé
        if (this.prepareToJump == true && Phaser.Input.Keyboard.JustUp(this.jumpKey)) {
            this.body.setVelocityY(-1 * this.getJumpHeight() * ((50 + this.jumpKey.duration) / 180));
            this.prepareToJump = false;
        }
        if (this.jumpKey.isDown && this.body.onFloor()) {
            this.prepareToJump = true;
            if (this.jumpKey.getDuration() > 130) {
                this.isJumping = true;
                this.body.setVelocityY(-1 * this.getJumpHeight());
                this.prepareToJump = false;
            }
        }


        if (this.coefDirection == -1) {
            this.flipX = !this.flipX;
        }
        // cas particulier de la présence d'échelles 
        if (this.onLadder) {
            if (this.cursors.up.isDown) {
                this.setVelocityY(-100); // Ajustez la vitesse de montée
                this.verticalDirection = "up";
            } else if (this.cursors.down.isDown) {
                this.setVelocityY(100); // Ajustez la vitesse de descente
                this.verticalDirection = "down";
            } else {
                this.verticalDirection = "center";
                this.setVelocityY(0); // Arrêter le mouvement si aucune touche n'est enfoncée
            }
        }

        // action de tir 
        if (this.fireKey.isDown && this.isShooting == false) {
            this.isShooting = true;
            this.fire();
            this.scene.time.delayedCall(this.getCoolDownDuration(), () => {
                this.isShooting = false;
            });
        }
        // Si attaque au corps à corps : mise à jour de l'arme de poing
        if (this.closeCombat == true && this.weaponEnabled == true) {
            this.weapon.y = this.y;
            var coefDirection = (this.flipX == false ? 1 : -1);
            this.weapon.x = this.x + coefDirection * this.scene.game.config.ss["player_shoot_right"].width / (2 * this.scene.game.config.ss["player_shoot_right"].nbFrames);
        }

        // animations du player
        if (this.isShooting) {
            this.anims.play(this.playerProperties.animShootName, true);
        } else if (this.isJumping) {
            this.anims.play(this.playerProperties.animJumpName, true);
        } else if (this.isMoving) {
            this.anims.play(this.playerProperties.animMoveName, true);
        } else {
            this.anims.play(this.playerProperties.animStandtName, true);
        }
    }

    // Autres méthodes
}

