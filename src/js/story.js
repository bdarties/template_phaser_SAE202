
export default class story extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "story" //  ici on précise le nom de la classe en tant qu'identifiant
    });

  }

  preload() {

  }

  create() {

    const screen_welcome = this.add.image(this.game.config.width/2, this.game.config.height/2, "screen_story"); // Réglez la valeur selon vos besoins

    const button_play = this.add.image(this.game.config.width/2, 630, "button_play"); // Réglez la valeur selon vos besoins



    button_play.setInteractive();
    button_play.on("pointerover", () => {
      button_play.setScale(1.1);
      button_play.setTint(0xC0C0C0);
    });
    button_play.on("pointerout", () => {
      button_play.setScale(1.0);
      button_play.clearTint();
    });

    button_play.on("pointerup", () => {
      this.scene.launch('interfaceJeu');
      this.scene.bringToTop('interfaceJeu');
      this.scene.switch("map_recto");
    });

  }


  udpate() {

  }

}