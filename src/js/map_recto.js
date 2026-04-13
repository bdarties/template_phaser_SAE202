import * as fct from "./fonctions.js";
import Player from "./Player.js";

export default class map_recto extends Phaser.Scene {
  spawnPoint = [];

  constructor() {
    super({ key: "map_recto" });
  }

  preload() {}

  create() {
    this.mapReversed = false;

    // Joueur et clavier
    fct.playerCreation.call(this);
    this.player = new Player(this, 100, 150, "player_move_right_SS");
    // application du scale initial pour la map recto
    var scaleRecto = this.game.config.initial_scale_recto || 1;
    this.player.setScale(scaleRecto);
    this.player.body.setSize(this.player.frame.width, this.player.frame.height);
    this.player.body.setOffset(0, 0);
    this.cursor   = this.input.keyboard.createCursorKeys();
    this.actionKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEMICOLON);

    // Groupes physiques (balles, portails, ennemis, items…)
    fct.groupsCreation.call(this);

    // Carte Tiled
    this.map         = this.make.tilemap({ key: 'map_recto' });
    this.tileset      = this.map.addTilesetImage('tileset_image',       'tileset_image');
    this.tileset_extra = this.map.addTilesetImage('tileset_image_extra', 'tileset_image_extra');

    // Fond et parallax
    fct.backgroundCreation.call(this, "main_background", this.game.config.fixedBackgroundRecto, "main_background_over_parallax_effect");

    // Calques de la carte
    fct.commonLayersCreation.call(this);
    fct.killLayerCreation.call(this);
    fct.deathLayerCreation.call(this);

    // Calque d'échelles (optionnel)
    if (this.map.getLayer("ladder_layer") != null) {
      this.ladder_layer = this.map.createLayer('ladder_layer', this.tileset, 0, 0);
      this.ladder_layer.setDepth(45);
      this.physics.add.overlap(this.player, this.ladder_layer, fct.onLadder, null, this);
    } else {
      this.ladder_layer = null;
    }

    // Taille du monde et caméra
    fct.worldsBoundsAndCameraConfiguration.call(this);

    // Point de départ et destinations (depuis l'object_layer)
    const tab_objects = this.map.getObjectLayer("object_layer");
    this.destinations = [];
    tab_objects.objects.forEach(point => {
      if (point.name === "start") {
        this.player.x    = point.x;
        this.player.y    = point.y;
        this.spawnPoint.x = point.x;
        this.spawnPoint.y = point.y;
      }
      if (point.name === "destination") {
        point.properties.forEach(property => {
          if (property.name === "id") {
            const id = parseInt(property.value);
            this.destinations[id] = { x: point.x, y: point.y };
          }
        });
      }
    });

    // Ennemis et collectibles (items et powerups)
    fct.enemiesCreation.call(this);
    fct.collectiblesCreation.call(this);

    // Portails (créés depuis object_layer, activation via touche W)
    fct.portalsCreation.call(this);

    // Collisions et overlaps physiques
    fct.collisionAndOverLapCreation.call(this);
    fct.setDestinationReachedVictoryCondition.call(this);

    // Textes et zones de message (calque text_layer, optionnel)
    fct.textZonesCreation.call(this);

    // Musique
    this.game.config.sceneTarget = "recto";
    if (this.sound.get("son_intro")) this.sound.stopByKey("son_intro");
    if (this.sound.get('son_game')) {
      this.sound.play('son_game', { loop: true });
    }
  }

  update() {
    if (fct.win.call(this)) {
      this.scene.get('interfaceJeu').launchWinScene();
    }
    if (this.game.config.sceneTarget !== "recto") return;
    if (this.game.config.portalTarget != null) {
      fct.portalSpawning.call(this);
    }
    this.player.update(this.ladder_layer);
    this.grp_enemy.children.iterate(ennemi => ennemi.update(this.platform_layer), this);
  }

  // Gestion de la collision joueur/plateforme en présence d'une échelle
  checkLadderSpecifics(player, platform) {
    if (player.verticalDirection === "up" && player.onLadder) {
      return player.isMoving;
    }
    if (this.ladder_layer != null && this.cursor.down.isDown) {
      if (player.isMoving) return true;
      const tileDown = this.ladder_layer.getTileAtWorldXY(player.x, player.getBottomCenter().y + 1);
      return tileDown == null;
    }
    return true;
  }

  // Activation d'un portail : vérifie la clé requise puis bascule vers map_verso
  portalActivation(player, portal) {
    if (portal.locked) {
      if (player.playerProperties.isInInventory(portal.requiredKey)) {
        portal.locked = false;
      } else {
        alert(`Portail verrouillé — il vous faut la clef n°${portal.requiredKey}`);
        return;
      }
    }
    this.game.config.portalTarget = portal.target;
    this.game.config.sceneTarget  = "verso";
    // sauvegarde du scale actuel du player avant le switch
    this.game.config.playerScaleBeforeSwitch = this.player.scaleX;
    this.scene.switch("map_verso");
  }
}


