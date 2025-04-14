import * as fct from "./fonctions.js";
import Player from "./Player.js";
import Enemy from "./Enemy.js";
import Item from "./Item.js";

var grp_portal;
export default class map_verso extends Phaser.Scene {
  spawnPoint = [];

  constructor() {
    super({ key: "map_verso" });
  }
  preload() {
  }

  create() {

    this.mapReversed = this.sys.settings.data.reverseMap;
    fct.playerCreation.call(this);
    this.player = new Player(this, 100, 150, "player_move_right_SS");
    //this.player.cursors = this.input.keyboard.createCursorKeys();
    // this.player.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    // this.player.fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.cursor = this.input.keyboard.createCursorKeys();

    // creation des groupes contenant les différents élements du niveau
    fct.groupsCreation.call(this);

    // Créer la carte en utilisant le fichier Tiled chargé
    this.map = this.make.tilemap({ key: 'map_verso' });
    // Ajouter le jeu de tuiles à la carte
    this.tileset = this.map.addTilesetImage('tileset_image', 'tileset_image');

    // creation du background + background parallax  
    fct.backgroundCreation.call(this, "main_background_verso", "main_background_over_parallax_effect_verso");
    //creation des calques usuels
    fct.commonLayersCreation.call(this);
    // creation du kill_layer et du death_layer
    fct.killLayerCreation.call(this);
    fct.deathLayerCreation.call(this);

    /* detection et ajout eventuel du calque d'échelles + overlap avec joueur
     * calque facultatif
    */
    if (this.map.getLayer("ladder_layer") != null) {
      this.ladder_layer = this.map.createLayer('ladder_layer', this.tileset, 0, 0);
      this.ladder_layer.setDepth(45);
      this.physics.add.overlap(this.player, this.ladder_layer, fct.onLadder, null, this);
    } else {
      this.ladder_layer = null;
    }

    // taille du monde et camera
    fct.worldsBoundsAndCameraConfiguration.call(this);

    // clavier : commande pour changer de portail
    this.actionKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    // ** chargement des destinations ( a passer en fonction) **/
    // chargement des objets du calque object_layer
    const tab_objects = this.map.getObjectLayer("object_layer");
    this.destinations = [];
    /// lecture des coordonnées destination 
    tab_objects.objects.forEach(point => {
      var enemy;
      if (point.name == "destination") {
        point.properties.forEach(property => {

          if (property.name == "id") {
            this.destinations[parseInt(property.value)] = {};
            this.destinations[parseInt(property.value)].x = point.x;
            this.destinations[parseInt(property.value)].y = point.y;
            console.log(this.destinations);
            console.log(point.x);

          }
        }, this);
      }
    }, this);

    // Creation des Ennemis  :
    // note : le modele de mobilité est chargé dans la classe ennemi
    fct.enemiesCreation.call(this);

  // Creation des powerUp a collecter :
    fct.powerUpCreation.call(this);

    // Creation des item a collecter :
    fct.itemCreation.call(this);

    /////
    // Creation des portails  :
    // le modele de mobilité est chargé dans la classe ennemi
    ///
    tab_objects.objects.forEach(point => {
      if (point.name == "portal") {
        var portal_properties = {};
        point.properties.forEach(property => {
          if (property.name == "id") {
            portal_properties.id = property.value;
          }
          if (property.name == "target") {
            portal_properties.target = property.value;
          }
          if (property.name == "style") {
            portal_properties.style = property.value;
          }
        }, this);

        var portal_texture;
        if (typeof (portal_properties.style) != 'undefined') {
          portal_texture = "portal_" + portal_properties.style;
        }
        else portal_texture = "portal";
        var portal = this.physics.add.sprite(point.x, point.y, portal_texture);
        portal.id = portal_properties.id;
        portal.target = portal_properties.target;

        this.grp_portal.add(portal);
        portal.body.allowGravity = false;

        console.log("[v] portail créé: id " + portal.id + " target : " + portal.target);
        portal.setDepth(47);
        // activation du portail
        this.physics.add.overlap(this.player, portal, this.portalActivation, function () {
          return (Phaser.Input.Keyboard.JustDown(this.actionKey));
        }, this);
      }
    });

    /////
    // Creation de la destination target  :
    ///
    tab_objects.objects.forEach(point => {
      if (point.name == "target") {
        var target = this.physics.add.sprite(point.x, point.y, "destination");
        target.body.allowGravity = false;
        target.setDepth(49);
        this.physics.add.overlap(this.player, target, function (player, target) {
          // Cette fonction sera appelée chaque fois que sprite1 et sprite2 entrent en collision
          var interfaceScene = this.scene.get('interfaceJeu');
          interfaceScene.setDestinationReached(true);

          // Détecter quand ils ne se superposent plus
          this.time.delayedCall(100, function () {
            if (!this.physics.overlap(player, target)) {
              // Les sprites ne se superposent plus
              interfaceScene.setDestinationReached(false);
            }
          }, [], this);
        }, null, this);
      }
    }
    );

    // collisions
    fct.collisionAndOverLapCreation.call(this);

    /////
    // Creation de la destination target  :
    ///
    tab_objects.objects.forEach(point => {
      if (point.name == "target") {
        var target = this.physics.add.sprite(point.x, point.y, "destination");
        target.body.allowGravity = false;
        target.setDepth(49);
        this.physics.add.overlap(this.player, target, function (player, target) {
          // Cette fonction sera appelée chaque fois que sprite1 et sprite2 entrent en collision
          var interfaceScene = this.scene.get('interfaceJeu');
          interfaceScene.setDestinationReached(true);

          // Détecter quand ils ne se superposent plus
          this.time.delayedCall(100, function () {
            if (!this.physics.overlap(player, target)) {
              // Les sprites ne se superposent plus
              interfaceScene.setDestinationReached(false);
            }
          }, [], this);
        }, null, this);
      }
    }
    );

    // création des textes et zones de texte
    const list_texts_and_zones = this.map.getObjectLayer("text_layer");
    if (list_texts_and_zones != null) {
      // on récupère le text_layer, on extrait les 2 éléments, zones et text
      var list_texts = list_texts_and_zones.objects.filter(function (object) {
        return object.name === "text";
      });
      var list_zones = list_texts_and_zones.objects.filter(function (object) {
        return object.name === "zone";
      });

      var tab_texts = [];
      list_texts.forEach(txtElement => {
        var texteObject = this.add.text(txtElement.x, txtElement.y, txtElement.text.text, {
          fontFamily: txtElement.text.fontfamily,
          fontSize: txtElement.text.pixelsize,
          color: (typeof(txtElement.text.color) != 'undefined'? txtElement.text.color : "#000000")

        });
        txtElement.properties.forEach(property => {
          if (property.name == "id") {
            texteObject.id = property.value;
          }
        }, this);
        tab_texts[texteObject.id] = texteObject;
        texteObject.setVisible(false);
        texteObject.setDepth(200);
      }, this
      );

      list_zones.forEach(zoneElement => {
        var zoneObject = this.add.zone(zoneElement.x, zoneElement.y).setOrigin(0, 0).setSize(zoneElement.width, zoneElement.height);
        this.physics.world.enable(zoneObject, 0); // (0) DYNAMIC (1) STATIC
        zoneObject.body.setAllowGravity(false);
        zoneObject.body.moves = false;
        zoneElement.properties.forEach(property => {
          if (property.name == "id_text") {
            zoneObject.associated_text = tab_texts[property.value];
          }
        }, this);
        this.physics.add.overlap(this.player, zoneObject, fct.printMsg, fct.checkDelay, this);

      }, this
      );

    }
    // this.cameras.main.setFlipX(true);
    if (this.mapReversed==true)
    this.cameras.main.setAngle(180);
  }

  update() {

    if (fct.win.call(this)) {
      this.scene.start("win");
    }
    if (this.game.config.sceneTarget != "verso") return;
    // spawn a partir d'un portail
    if (this.game.config.portalTarget != null) {
      fct.portalSpawning.call(this);
    }
    // mise a jour des mobilités / animations/ mouvements
    this.player.update(this.ladder_layer);
    this.grp_enemy.children.iterate(function iterateur(un_ennemi) {
      un_ennemi.update();
    }, this);
  }

  // partie spéciale sur les céhc
  checkLadderSpecifics(player, platform) {

    // le player veut monter 
    if (player.verticalDirection == "up" && player.onLadder) {
      if (player.isMoving == true) return true;
      return false;
    }
    if (this.ladder_layer != null && this.cursor.down.isDown) {
      if (player.isMoving == true) return true;
      const TileDown = this.ladder_layer.getTileAtWorldXY(player.x, player.getBottomCenter().y + 1);
      if (TileDown != null) {
        return false;
      }
      else {
      }
    }
    return true;
  }

  portalActivation(player, portal) {
    console.log('[V] activation de potail sur verso, je vais vers recto');
    console.log("[V] direction le portail num" + portal.target);
    this.game.config.portalTarget = portal.target;
    this.game.config.sceneTarget = "recto";
    this.scene.switch("map_recto");
  }

  wake() {
    console.log(this.game.config.portalTarget);
    console.log(this.scene.get('map_recto').target);

  }
  portalSpawnning() {
    var portalFound = false;
    console.log('spwan sur potail depuis verso');
    console.log(this.game.config.portalTarget);
    console.log("chek de portail depuis verso");
    grp_portal.children.iterate(function (portal) {
      console.log("portail analyse : " + portal.id + " cible :" + this.game.config.portalTarget);
      if (portal.id == this.game.config.portalTarget) {
        this.player.x = portal.x;
        this.player.y = portal.y;
        console.log("on teleporte player a " + this.player.x + ", " + this.player.y);
        this.game.config.portalTarget = null;
        portalFound = true;
        return true;
      }
    }, this);
    if (!portalFound) alert("destination inconnue");
  }

  itemCollision(player, item) {
    item.disableBody(true, true);

    switch (item.proprietes.item_type) {
      case "jump":
        player.increaseJumpHeight(item.proprietes.item_effect);
        break;
    }
    // Mettez en pause la scène PlateauJeu
    this.scene.pause();
    // Assombrissez la scène actuelle avec une transparence de 0.5 (50%)
    // Créez une couleur semi-transparente (50% de transparence)


    // Lancez la scène dialogBox
    this.scene.launch('dialogBox', { proprietes: item.proprietes, sceneToResume: this.scene.key });
  }


}

