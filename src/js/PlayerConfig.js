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

		// gestion du double saut, triple saut, et vol
		this.canDoubleJump = false;
		this.canTripleJump = false;
		this.canFly = false;
		this.canWallJump = false;

		// écrasement des valeurs par défaut, si définies dans la config
		var playerConfigNamesTable = ["speed", "jumpHeight", "projectileDuration", "projectileSpeed", "coolDownDuration", "closeCombat", "maxHealth", "lifes"];
		playerConfigNamesTable.forEach(function (paramName, index) {
			if (typeof (config["player_" + paramName]) != 'undefined') {
				this[paramName] = config["player_" + paramName];
			}
		}, this);
		// gravité
		if (typeof (config.player_gravity) != 'undefined') {
			this.gravity = config.player_gravity - config.default_gravity;

		}

		// apparence dynamique :
		this.animShootName = 'anim_player_shoot_right';
		this.animMoveName = 'anim_player_move_right';
		this.animJumpName = 'anim_player_jump_right';
		this.animStandtName = 'anim_player_stand_right';
		
		// initialisation des éléments dynamiques de jeu
		this.kills = 0;
		this.itemsCollected = 0;
		this.health = this.maxHealth;
		this.destinationReached = false;
	}
}