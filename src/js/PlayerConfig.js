/* configuration du personnage principal */

/* ces elements sont rattachés à l'interface de jeu, pour avoir une unicité de la configuration, 
	 quel que soit le monde 
*/
export default class Playerconfig {
	constructor(config) {
		// Valeurs par défaut
		
		this.maxHealth = 4;
		this.lifes = 4;
		this.acceleration = 250;
		this.speed = 300;
		this.jumpHeight = 600;
		this.gravity = 350;
		this.projectileDuration = 400;
		this.projectileSpeed = 500;
		this.coolDownDuration = 400;
		this.closeCombat = false;
      	this.canShoot = false;

		// gestion du double saut, triple saut, et vol
		this.canDoubleJump = false;
		this.canTripleJump = false;
		this.canFly = false;
		this.canWallJump = false;
  


		// écrasement des valeurs par défaut, si définies dans la config
		var playerConfigNamesTable = ["speed", "jumpHeight", "projectileDuration", "projectileSpeed", "coolDownDuration", "closeCombat", "maxHealth", "lifes", "canShoot"];
		playerConfigNamesTable.forEach(function (paramName, index) {
			if (typeof (config["player_" + paramName]) != 'undefined') {
				this[paramName] = config["player_" + paramName];
				console.log("player_" + paramName + " : " + this[paramName]);
			}
		}, this);

		if (this.canShoot == "false") {
			this.canShoot = false;
		}
		else this.canShoot = true;

		// gravité
		if (typeof (config.player_gravity) != 'undefined') {
			this.gravity = config.player_gravity - config.default_gravity;

		}

		// apparence dynamique :
		this.animShootName = 'anim_player_shoot_right';
		this.animMoveName = 'anim_player_move_right';
		this.animJumpName = 'anim_player_jump_right';
		this.animStandtName = 'anim_player_stand_right';

		// apparence dynamique :
		this.animShootName_recto = 'anim_player_shoot_right';
		this.animMoveName_recto = 'anim_player_move_right';
		this.animJumpName_recto = 'anim_player_jump_right';
		this.animStandtName_recto = 'anim_player_stand_right';

		// Vérification si 'anim_player_shoot_right' est une clé d'animation du gestionnaire d'animation Phaser
		// apparence dynamique_verso :
		this.animShootName_verso = (typeof config.player_verso_shoot_right !== 'undefined') ? 'anim_player_verso_shoot_right' : this.animShootName;
		this.animMoveName_verso = (typeof config.player_verso_move_right !== 'undefined') ? 'anim_player_verso_move_right' : this.animMoveName;
		this.animJumpName_verso = (typeof config.player_verso_jump_right !== 'undefined') ? 'anim_player_verso_jump_right' : this.animJumpName;
		this.animStandtName_verso = (typeof config.player_verso_stand_right !== 'undefined') ? 'anim_player_verso_stand_right' : this.animStandtName;
		
		// Affichage des valeurs des animations verso
		console.log("animShootName_verso: " + this.animShootName_verso);
		console.log("et surtout "+ config.player_verso_move_right)
		console.log("animMoveName_verso: " + this.animMoveName_verso);
		console.log("animJumpName_verso: " + this.animJumpName_verso);
		console.log("animStandtName_verso: " + this.animStandtName_verso);

		console.log(config);
		// initialisation des éléments dynamiques de jeu
		this.kills = 0;
		this.itemsCollected = 0;
		this.health = this.maxHealth;
		this.destinationReached = false;
	}

	switchLevel(level) {
		console.log("changement de textures");

		if (level === 'recto') {
			this.animShootName = this.animShootName_recto;
			this.animMoveName = this.animMoveName_recto;
			this.animJumpName = this.animJumpName_recto;
			this.animStandtName = this.animStandtName_recto;
		} else {
			this.animShootName = this.animShootName_verso;
			this.animMoveName = this.animMoveName_verso;
			this.animJumpName = this.animJumpName_verso;
			this.animStandtName = this.animStandtName_verso;
		}
		console.log("Current animMoveName: " + this.animMoveName);
	}
}