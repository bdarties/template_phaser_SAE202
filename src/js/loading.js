import * as fct from "./fonctions.js";
import accueil from "./accueil.js";
import credits from "./credits.js";
import controls from "./controls.js";
import map_recto from "./map_recto.js";
import map_verso from "./map_verso.js";
import story from "./story.js";
import lose from "./lose.js";
import win from "./win.js";
import Player from "./Player.js";
import interfaceJeu from "./interfaceJeu.js";
import dialogBox from "./dialogBox.js";

var configFile = await fct.chargerConfig('./src/assets/config.txt');

export default class loading extends Phaser.Scene {
    // constructeur de la classe
    constructor() {
        super({
            key: "loading" //  ici on précise le nom de la classe en tant qu'identifiant
        });

    }
    preload() {
       /* chargement des textures de portail */
        var directory = "src/assets/images/";
        self = this;
        // Utilisation de l'API Fetch pour récupérer la liste des fichiers du répertoire
        fetch(directory)
            .then(response => response.text())
            .then(text => {
                // Parsing du contenu HTML pour extraire les noms de fichiers
                var parser = new DOMParser();
                var htmlDoc = parser.parseFromString(text, "text/html");
                var fileNodes = htmlDoc.querySelectorAll('a');
                // Parcours des nœuds pour charger les images
                fileNodes.forEach(function (node) {
                    var filePath = node.getAttribute("href");
                    var fileName = filePath.substring(filePath.lastIndexOf("/") + 1);
                    // Si le fichier commence par "portal" et se termine par ".png"
                    if ((fileName.startsWith("portal") || fileName.startsWith("item_to_collect_")) && fileName.endsWith(".png")) {
                        var fileNameWithoutExtension = fileName.split(".")[0];
                        // Vérification de l'existence du fichier avant de le charger
                        fetch(directory + fileName, { method: 'HEAD' })
                            .then(response => {
                                if (response.ok) {
                                    self.load.image(fileNameWithoutExtension, directory + fileName);
                                    console.log("image chargée "+fileNameWithoutExtension);
                                } else {
                                    console.warn(`Fichier introuvable : ${directory + fileName}`);
                                }
                            })
                            .catch(error => console.error(`Erreur lors de la vérification du fichier : ${directory + fileName}`, error));
                    }
                });
            })
            .catch(error => console.error('Erreur lors de la récupération des fichiers du répertoire :', error));


        /* nous ne chargeons que les textures mais pas sous forme de spritesheet, nous les découpons apres */
        this.load.image('player_move_right', './src/assets/spritesheets/player_move_right_spritesheet.png');
        this.load.image('player2_move_right', './src/assets/spritesheets/player2_move_right_spritesheet.png');
        this.load.image('player_jump_right', './src/assets/spritesheets/player_jump_right_spritesheet.png');
        this.load.image('player_shoot_right', './src/assets/spritesheets/player_shoot_right_spritesheet.png');
        this.load.image('player_stand_right', './src/assets/spritesheets/player_stand_right_spritesheet.png');
        this.load.image('enemy_1_move_right', './src/assets/spritesheets/enemy_1_move_right_spritesheet.png');
        this.load.image('enemy_2_move_right', './src/assets/spritesheets/enemy_2_move_right_spritesheet.png');
        this.load.image('enemy_3_move_right', './src/assets/spritesheets/enemy_3_move_right_spritesheet.png');
        this.load.image('enemy_3_jump_right', './src/assets/spritesheets/enemy_3_jump_right_spritesheet.png');
        this.load.image('enemy_4_move_right', './src/assets/spritesheets/enemy_4_move_right_spritesheet.png');
        this.load.image('enemy_5_move_right', './src/assets/spritesheets/enemy_5_move_right_spritesheet.png');
        this.load.image('projectile_player', './src/assets/spritesheets/projectile_player.png');
        this.load.image('projectile_enemy', './src/assets/spritesheets/projectile_enemy.png');

        /* chargement des boutons */
        this.load.image("button_credits", "src/assets/images/button_credits.png");
        this.load.image("button_back", "src/assets/images/button_back.png");
        this.load.image("button_play", "src/assets/images/button_play.png");
        this.load.image("button_controls", "src/assets/images/button_controls.png");

        /* chargement des screens de fond */
        this.load.image("screen_welcome", "src/assets/images/screen_welcome.png");
        this.load.image("screen_controls", "src/assets/images/screen_controls.png");
        this.load.image("screen_credits", "src/assets/images/screen_credits.png");
        this.load.image("screen_story", "src/assets/images/screen_story.png");
        this.load.image("screen_win", "src/assets/images/screen_win.png");
        this.load.image("screen_lose", "src/assets/images/screen_lose.png");
        this.load.image("main_background", "src/assets/images/main_background.png");
        this.load.image("main_background_over_parallax_effect", "src/assets/images/main_background_over_parallax_effect.png");
        this.load.image("main_background_verso", "src/assets/images/main_background_verso.png");
        this.load.image("main_background_verso_over_parallax_effect", "src/assets/images/main_background_verso_over_parallax_effect.png");

        /* chargement des autres textures */
        this.load.image("destination", "src/assets/images/destination.png");
        this.load.image("bullet", "src/assets/images/bullet.png");
        this.load.image("item_to_collect", "src/assets/images/item_to_collect.png");
        this.load.image("item_jump", "src/assets/images/item_jump.png");
        
        this.load.image("item_doubleJump", "src/assets/images/item_doubleJump.png");
        this.load.image("item_tripleJump", "src/assets/images/item_tripleJump.png");

        // Écouter l'événement d'erreur de chargement
        this.load.on('loaderror', (file) => {
            if (file.key === "item_doubleJump") {
                console.warn("Fichier introuvable ou erreur de chargement : src/assets/images/item_doubleJump.png");
            }
        });

        this.load.image("item_hearth", "src/assets/images/item_hearth.png");
        
        this.load.image("coeur", "src/assets/images/coeur.png");

        /* chargement des cartes */
        this.load.tilemapTiledJSON('map_recto', './src/assets/maps/carte_recto.json');
        this.load.tilemapTiledJSON('map_verso', './src/assets/maps/carte_verso.json');
        this.load.image('tileset_image', './src/assets/maps/tileset_image.png');
    }
    create() {
        // chargement des caractéristiques du player
        this.game.config.player_closeCombat = false;
        if (typeof (configFile["player"]) != 'undefined') {
            if (typeof (configFile["player"].closeCombat) != 'undefined' && configFile["player"].closeCombat == "true") {
                this.game.config.player_closeCombat = true;
            }
            // parcours des éléments de configuration pour player et ajout dans configFile
            var playerConfigNamesTable = ["speed", "jumpHeight", "gravity", "projectileDuration", "projectileSpeed", "coolDownDuration", "maxHealth", "lifes"];      
            playerConfigNamesTable.forEach(function (paramName, index) { 
                if (typeof (configFile["player"][paramName]) != 'undefined') {
                  this.game.config["player_"+paramName] = configFile["player"][paramName];
                }
        }, this);

        }
        // chargement des conditions de victoire du jeu 
        if (typeof (configFile["game"]) != 'undefined') {
            if (typeof (configFile["game"].objective_kill_them_all) != 'undefined' && configFile["game"].objective_kill_them_all == "true") {
                this.game.config.objective_kill_them_all = true;
            }
            else this.game.config.objective_kill_them_all = false;
            if (typeof (configFile["game"].objective_collect_all_items) != 'undefined' && configFile["game"].objective_collect_all_items == "true") {
                this.game.config.objective_collect_all_items = true;
            }
            else this.game.config.objective_collect_all_items = false;
            if (typeof (configFile["game"].objective_reach_destination) != 'undefined' && configFile["game"].objective_reach_destination == "true") {
                this.game.config.objective_reach_destination = true;
            }
            else this.game.config.objective_reach_destination = false;
            // objectif : terminer dans le temps imparti
            if (typeof (configFile["game"].objective_complete_in_time) != 'undefined' && typeof (configFile["game"].objective_max_time) != 'undefined' && configFile["game"].objective_complete_in_time == "true") {
                this.game.config.objective_complete_in_time = true;
                this.game.config.objective_max_time = configFile["game"].objective_max_time;
            }
            else this.game.config.objective_complete_in_time = false;
            

            console.log("objectifs chargés :");
            console.log("- kill them all : " + this.game.config.objective_kill_them_all);
            console.log("- collect all item : " + this.game.config.objective_collect_all_items);
            console.log("- reach destination : " + this.game.config.objective_reach_destination);   
        }
        else console.log("Aucun objectif trouvé");

        // configuration particuliere : retourner la map verso
        this.game.config.reverse_map_verso =  ((typeof (configFile["game"]) != 'undefined' && typeof (configFile["game"].reverse_map_verso) != 'undefined' && configFile["game"].reverse_map_verso=="true") ? true : false);


        // chargement et calcul des dimensions du spritesheet player_move_right
        var SpriteSheetNamesTable = ["player_move_right", "player2_move_right", "player_jump_right", "player_stand_right", "player_shoot_right", "enemy_1_move_right", "enemy_2_move_right", "enemy_2_shoot_right", "enemy_3_move_right", "enemy_3_jump_right", "enemy_4_move_right", "enemy_5_move_right", "projectile_player"];
        this.game.config.ss = [];
        SpriteSheetNamesTable.forEach(function (ssname, index) {
            if (this.textures.exists(ssname)) {

                this.game.config.ss[ssname] = {};
                console.log(ssname + ">" + this.game.config.ss[ssname]);
                
                this.game.config.ss[ssname].nbFrames = configFile[ssname].nbFrames;
                this.game.config.ss[ssname].width = this.textures.get(ssname).getSourceImage().width;
                console.log(this.game.config.ss[ssname].width);
                this.game.config.ss[ssname].height = this.textures.get(ssname).getSourceImage().height;
                this.game.config.ss[ssname].frameWidth = this.game.config.ss[ssname].width / this.game.config.ss[ssname].nbFrames;
                this.game.config.ss[ssname].frameHeight = this.game.config.ss[ssname].height;
                var b = this.textures.addSpriteSheet(ssname + '_SS', this.textures.get(ssname).getSourceImage(), { frameWidth: this.game.config.ss[ssname].frameWidth, frameHeight: this.game.config.ss[ssname].frameHeight });
                console.log("creation du spritesheet " + ssname + "_SS de dimension  " + this.game.config.ss[ssname].frameWidth + " / " + this.game.config.ss[ssname].frameHeight);
                this.anims.create({
                    key: 'anim_' + ssname,
                    frames: this.anims.generateFrameNumbers(ssname + '_SS', { start: 0, end: configFile[ssname].nbFrames - 1 }),
                    frameRate: 10
                });
                console.log("creation de l'animation " + 'anim_' + ssname + " avec  " + configFile[ssname].nbFrames + " frames");
            }
        }, this);

       // Test pour afficher les noms des fichiers item_to_collect_*** chargés
        const loadedItemToCollectFiles = Object.keys(this.textures.list).filter(textureName => textureName.startsWith("item_to_collect_"));
        console.log("Fichiers item_to_collect_*** chargés :", loadedItemToCollectFiles);

        this.game.config.default_gravity = this.physics.world.gravity.y;

        // chargement des scenes
        this.scene.add('accueil', accueil, false);
        this.scene.add('credits', credits, false);
        this.scene.add('controls', controls, false);
        this.scene.add('story', story, false);
        this.scene.add('map_verso', map_verso, false, { reverseMap: this.game.config.reverse_map_verso});
        this.scene.add('lose', lose, false);
        this.scene.add('win', win, false);
        this.scene.add('map_recto', map_recto, false);
        this.scene.add('dialogBox', dialogBox, false);

        // chargement de la map recto pour extraction du nombre d'item / monster
        var map = this.make.tilemap({ key: 'map_recto' });
        var tab_objects = map.getObjectLayer("object_layer");
        var remainingItems = 0;
        var remainingMonsters = 0;
        tab_objects.objects.forEach(point => {
            if (point.name.startsWith("enemy_")) {
                remainingMonsters++;
            }
             if (point.name == "item") {
                if (typeof (point.properties) == 'undefined') {
                remainingItems++;
            }
             }
        }, this);

        // chargement de la map verso pour extraction du nombre d'item / monster
        map = this.make.tilemap({ key: 'map_verso' });
        tab_objects = map.getObjectLayer("object_layer");
        tab_objects.objects.forEach(point => {
            if (point.name.startsWith("enemy_")) {
                remainingMonsters++;
            }
            if (point.name == "item") {
                if (typeof (point.properties) == 'undefined') {
                remainingItems++;
            }
            }
        }, this);

        // chargement de l'interface de jeu avec les parametres de victoire
        this.scene.add('interfaceJeu', interfaceJeu, false, { remainingMonsters: remainingMonsters, remainingItems: remainingItems });
        
 
        // lancement du jeu
        this.scene.start("accueil");

    }

    update() {
    }
}

