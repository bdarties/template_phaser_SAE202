export default class Item extends Phaser.Physics.Arcade.Sprite {


   constructor(scene, x, y, textureKey, proprietes) {
      super(scene, x, y, textureKey);
      this.proprietes = proprietes;

      // Ajoute l'item à la scène
      scene.add.existing(this);
      if (typeof (this.proprietes.type) != 'undefined') {
         if (this.proprietes.style != 'undefined') {
            this.setTexture("item_"+this.proprietes.style);
         }
         else {
            this.setTexture("item_"+this.proprietes.type);
         }  
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
