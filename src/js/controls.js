
export default class controls extends Phaser.Scene {
    // constructeur de la classe
    constructor() {
        super({
            key: "controls" //  ici on précise le nom de la classe en tant qu'identifiant
        });

    }

    preload() {

    }

    create(){

    const screen_welcome = this.add.image(this.game.config.width/2, this.game.config.height/2, "screen_controls"); // Réglez la valeur selon vos besoins

    const button_back = this.add.image(1040, 630, "button_back"); // Réglez la valeur selon vos besoins
    

    
    button_back.setInteractive();    
    button_back.on("pointerover", () => {
      button_back.setScale(1.1);
      button_back.setTint(0xC0C0C0);
    });
    button_back.on("pointerout", () => {
      button_back.setScale(1.0);
      button_back.clearTint();
    });

    button_back.on("pointerup", () => {
      this.scene.switch("accueil");
    });

    }


    udpate() {

    }

}