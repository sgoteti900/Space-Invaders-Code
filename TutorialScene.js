class TutorialScene extends Phaser.Scene {
  constructor(){
    super({ key: 'TutorialScene' })
  }

  preload(){
    
    this.load.image('start2', 'https://images.template.net/wp-content/uploads/2016/12/20121249/sea-Sunset-Painting.jpg');
    this.load.image('bug1', 'https://content.codecademy.com/courses/learn-phaser/fastfoodie/art/Burger.png');

    
  }

  create() {
   
    
    this.add.image(0, 0, 'start2').setOrigin(0,0)
    
 
    // Creates keyboard keys
    this.add.text( 150, 50, 'Instructions', {fill: '#ffffff', fontSize: '40px'})      
    this.add.text( 25, 120, 'Your job is to survive and destroy at least', {fill: '#ffffff', fontSize: '17px'})
    this.add.text( 25, 145, '25 burgers to go onto the next level or pass the fire', {fill: '#ffffff', fontSize: '17px'})
    this.add.text( 25, 180, 'Press the space bar to emit fire to destroy the burgers', {fill: '#ffffff', fontSize: '17px'})
    this.add.text( 25, 210, 'Use the arrow keys to navigate yourself in the game', {fill: '#ffffff', fontSize: '17px'})

    this.add.text( 25, 250, 'When you are ready, click to start!', {fill: '#ffffff', fontSize: '17px'})
    this.input.on('pointerdown', () => {
        this.scene.stop('TutorialScene');
        this.scene.start('Level1');
  })
  }
}

