export default class DialogBox extends Phaser.Scene {
    constructor() {
        super({ key: 'dialogBox' });
    }

    create(data) {
   const dialogBackground = this.add.graphics();
dialogBackground.fillStyle(0x000000, 0.7); // Couleur noire avec une opacité de 0.7
dialogBackground.fillRect(300, 200, 600, 300); // Position et dimensions du cadre

// Texte du message
const titleText = this.add.text(350, 240, "Vous avez trouvé "+ data.proprietes.item_name, { fontSize: '24px', fill: '#fff' });

const messageText = this.add.text(350, 280, data.proprietes.item_description, { fontSize: '24px', fill: '#fff' });

// Ajoutez un bouton OK
const okButton = this.add.text(630, 400, 'OK', { fontSize: '24px', fill: '#fff' });
messageText.setDepth(1);
okButton.setDepth(1);
      okButton.setInteractive();  
      okButton.on('pointerover', () => {
    okButton.setScale(1.1); // Ajuste l'échelle à 1.1 lors du survol
});

// Supprime l'effet de scaling lorsque la souris quitte le bouton
okButton.on('pointerout', () => {
    okButton.setScale(1); // Rétablit l'échelle à 1 lorsque la souris quitte le bouton
});
        okButton.on('pointerdown', () => {
            // Faites disparaître la boîte de dialogue
            this.scene.stop('dialogBox');
            // Reprenez la scène PlateauJeu
            this.scene.resume(data.sceneToResume);
         
            // Annulez l'effet fadeIn si en cours
            if (this.scene.get(data.sceneToResume).cameras.main._fadeAlpha > 0) {
                this.scene.get(data.sceneToResume).cameras.main.resetFX();
            }

        });
    }
}
