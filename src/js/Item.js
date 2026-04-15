export default class Item extends Phaser.Physics.Arcade.Sprite {


   constructor(scene, x, y, textureKey, proprietes) {
      super(scene, x, y, textureKey);
      this.proprietes = proprietes;

      // Ajoute l'item à la scène
      scene.add.existing(this);

      // Déterminer la clé de base pour la texture/animation
      var itemKey = textureKey;
      if (typeof (this.proprietes.type) != 'undefined') {
         if (this.proprietes.style != 'undefined') {
            itemKey = "item_" + this.proprietes.style;
         } else {
            itemKey = "item_" + this.proprietes.type;
         }
      }

      // Si une animation spritesheet existe, on la joue en boucle
      var animKey = "anim_" + itemKey;
      if (scene.anims.exists(animKey)) {
         this.play({ key: animKey, repeat: -1 });
      } else {
         this.setTexture(itemKey);
         console.log(animKey+ "non trouvé");
      }

      // Physique de l'item 
      scene.physics.world.enable(this); // Active la physique pour l'item
   }  

   getType() {
      if (typeof (this.proprietes.type) == 'undefined') {
         return "collect";
      }
      return this.proprietes.type
   }

}
