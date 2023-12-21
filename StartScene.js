class StartScene extends Phaser.Scene {
  constructor(){
    super({ key: 'StartScene' })
  }
 
  preload(){
    
    this.load.image('start', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5dI9NjTnAx4G1B6GBpbTwJKXxQ8P4wqKYzQ&usqp=CAU');
    this.load.image('bug1', 'https://content.codecademy.com/courses/learn-phaser/fastfoodie/art/Burger.png');
    this.load.audio('introTheme', [
      `https://content.codecademy.com/courses/learn-phaser/fastfoodie/audio/music/3-winTheme.mp3`], 
      'clickNoise', [`https://content.codecademy.com/courses/learn-phaser/fastfoodie/audio/sfx/placeFood.ogg`]); // Credit: "Happy 8bit Loop 01" by Tristan Lohengrin: https://www.tristanlohengrin.com
   
    
  }
 
    
 
  create() {
    
    this.add.image(0, 0, 'start').setOrigin(0,0).setScale(2.75)
    
 
    // Creates keyboard keys
    this.add.text( 140, 100, 'Space Attack', {fill: '#ffffff', fontSize: '40px'})
 
    this.add.text( 210, 200, 'Click to start!', {fill: '#ffffff', fontSize: '20px'})
    this.input.on('pointerdown', () => {
        this.scene.stop('StartScene');
        this.scene.start('TutorialScene');
        gameState.currentMusic = this.soud.add('clickNoise')
        gameState.currentMusic = this.sound.add('introTheme');
        gameState.currentMusic.play({ loop: true });
  })
  }
}
 
