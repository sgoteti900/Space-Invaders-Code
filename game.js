class Level extends Phaser.Scene {
  constructor(key) {
    super(key);
    this.levelKey = key
    this.nextLevel = {
      'StartScene': 'TutorialScene',
      'TutorialScene': 'Level1',
      'Level1': 'Level2',
      'Level2': 'Level3',
      'Level3': 'Level4',
      'Level4': 'Level5',
      'Level5': 'Level6',
      'Level6': 'Level7',
      'Level7': 'Level8',
      'Level8': 'Level9',
      'Level9': 'Level10',
      }
      //changed the indent by one space 
    }
  
    preload() {
      this.load.image('platform', 'https://content.codecademy.com/courses/learn-phaser/Codey%20Tundra/platform.png');
      this.load.image('snowflake', 'https://content.codecademy.com/courses/learn-phaser/Codey%20Tundra/snowflake.png');
      this.load.spritesheet('campfire', 'https://content.codecademy.com/courses/learn-phaser/Codey%20Tundra/campfire.png',
      { frameWidth: 32, frameHeight: 32});
      this.load.spritesheet('codey', 'https://content.codecademy.com/courses/learn-phaser/Codey%20Tundra/codey.png', { frameWidth: 72, frameHeight: 90});
      this.load.spritesheet('exit', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/cave_exit.png', { frameWidth: 60, frameHeight: 70 });
  
      this.load.image('bg1', 'https://images.unsplash.com/photo-1590272456521-1bbe160a18ce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDR8fHxlbnwwfHx8fA%3D%3D&w=1000&q=80');
      this.load.image('bg3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5dI9NjTnAx4G1B6GBpbTwJKXxQ8P4wqKYzQ&usqp=CAU');
      this.load.image('bug1', 'https://content.codecademy.com/courses/learn-phaser/fastfoodie/art/Burger.png');
      this.load.image('bugPellet', 'https://content.codecademy.com/courses/learn-phaser/Bug%20Invaders/bugRepellent.png');
      this.load.image('bugRepellent',  'https://content.codecademy.com/courses/learn-phaser/Bug%20Invaders/bugPellet.png');
      
    }
  
    sortedEnemies(){
      const orderedByXCoord = gameState.enemies.getChildren().sort((a, b) => a.x - b.x);
      return orderedByXCoord;
    }
 
    numOfTotalEnemies() {
      const totalEnemies = gameState.enemies.getChildren().length;
      return totalEnemies;
    }
  
    
    
  
    create() {    
  
    
      gameState.active = true;
  
      gameState.bgColor = this.add.rectangle(0, 0, config.width, config.height, 0x00ffbb).setOrigin(0, 0);
 
      
      this.createStars();
      
      this.createParallaxBackgrounds();
  
      gameState.player = this.physics.add.sprite(125, 150, 'codey').setScale(.4);
 
      
      gameState.platforms = this.physics.add.staticGroup();
 
      gameState.levelText = this.add.text(gameState.player.x-100, 0, `${this.levelKey}`, { fontSize: '17px', fill: '#ffffff'})
      gameState.scoreText = this.add.text(gameState.player.x + 100, 0, 'Burgers left to destroy: 25', { fontSize: '17px', fill: '#ff0000' });
      gameState.scoreText2 = this.add.text(gameState.player.x + 600, 0, 'Burgers left to destroy: 25', { fontSize: '17px', fill: '#ff0000' });
      gameState.scoreText3 = this.add.text(gameState.player.x + 900, 0, 'Burgers left to destroy: 25', { fontSize: '17px', fill: '#ff0000' });
      gameState.scoreText4 = this.add.text(gameState.player.x + 1300, 0, 'Burgers left to destroy: 25', { fontSize: '17px', fill: '#ff0000' });
      
  
      this.createAnimations();
  
      this.createSnow();
  
      this.levelSetup();
  
      this.cameras.main.setBounds(0, 0, gameState.bg1.width * 1.75, 280);
      
      this.physics.world.setBounds(0, 0, gameState.width, 1500 + gameState.player.height);
  
      this.cameras.main.startFollow(gameState.player, true, 0.5, 0.5)
      
      gameState.player.setCollideWorldBounds(true);
  
      this.physics.add.collider(gameState.player, gameState.platforms);
      
      
      this.physics.add.collider(gameState.goal, gameState.platforms);
  
      gameState.cursors = this.input.keyboard.createCursorKeys();
 
      this.input.on('pointerup', () => {
        if (gameState.active === false){
          
          this.scene.restart();
        }
      })
  
      gameState.enemies = this.physics.add.group()
  
      for(let yVal = 1; yVal < 4; yVal++){
        for(let xVal = 1; xVal < 70; xVal++){
          gameState.enemies.create(30* xVal, 24* yVal + 10, 'bug1').setScale(.14).setGravityY(-200)
        }
      }
  
      let pellets = this.physics.add.group()
      const genPellet = () => {
        let randomBug = Phaser.Utils.Array.GetRandom(gameState.enemies.getChildren());
        pellets.create(randomBug.x, randomBug.y, 'bugPellet')
        
     
      }
 
      gameState.pelletsLoop = this.time.addEvent({
        delay: 130,
        callback: genPellet,
        callbackScope: this,
        loop: true,
      })
 
      
      this.physics.add.collider(pellets, gameState.platforms, (pellet) => {
        pellet.destroy();
      })
 
      this.physics.add.collider(pellets, gameState.player, () => {
        gameState.active = false;
        gameState.enemyVelocity = 1
        gameState.pelletsLoop.destroy();
        this.physics.pause()
        this.add.text(gameState.player.x-100, gameState.player.y - 100, 'Game Over \nClick to restart', { fontSize: '15px', fill: '#30ff00'})
      })
  
      gameState.bugRepellent = this.physics.add.group()
      this.physics.add.collider(gameState.enemies, gameState.bugRepellent, (bug, repellent) => {
        bug.destroy();
        repellent.destroy();
        if(this.numOfTotalEnemies() >= 182){
          gameState.scoreText.setText(`Burgers left to destroy: ${this.numOfTotalEnemies() -182} `)
          gameState.scoreText2.setText(`Burgers left to destroy: ${this.numOfTotalEnemies() -182}`)
          gameState.scoreText3.setText(`Burgers left to destroy: ${this.numOfTotalEnemies() -182}`)
          gameState.scoreText4.setText(`Burgers left to destroy: ${this.numOfTotalEnemies() -182}`)
 
        }
      })
 
      this.physics.add.collider(gameState.enemies, gameState.player, () => {
        gameState.active = false;
        gameState.enemyVelocity = 1
        this.physics.pause();
        this.add.text(150, 250, 'Game Over \nClick to restart', { fontSize: '15px', fill: '#000'})
      })
  
  
    }
 
  
    createPlatform(xIndex, yIndex) {
      // Creates a platform evenly spaced along the two indices.
      // If either is not a number it won't make a platform
        if (typeof yIndex === 'number' && typeof xIndex === 'number') {
          gameState.platforms.create((140 * xIndex),  yIndex * 40, 'platform').setOrigin(0, 0.5).setScale(0.6).refreshBody();
        }
    }
 
    
  
  
    createSnow() {
      gameState.particles = this.add.particles('snowflake').setScale(.5);
  
      gameState.emitter = gameState.particles.createEmitter({
        x: {min: 0, max: config.width * 20 },
        y: -5,
        lifespan: 2000,
        speedX: { min:-5, max: -200 },
        speedY: { min: 100, max: 400},
        scale: { start: 0.6, end: 0 },
        quantity: 10,
        blendMode: 'ADD'
      })
  
      gameState.emitter.setScrollFactor(2);
    }
  
    createAnimations() {
      this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('codey', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
      });
  
      this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('codey', { start: 2, end: 2 }),
        frameRate: 10,
        repeat: -1
      });
  
      this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('codey', { start: 2, end: 3 }),
        frameRate: 10,
        repeat: -1
      })
  
      this.anims.create({
        key: 'fire',
        frames: this.anims.generateFrameNumbers('campfire'),
        frameRate: 10,
        repeat: -1
      })
  
      this.anims.create({
        key: 'glow',
        frames: this.anims.generateFrameNumbers('exit', { start: 0, end: 5 }),
        frameRate: 4,
        repeat: -1
      });
    }
  
    createParallaxBackgrounds() {
      gameState.bg1 = this.add.image(0, 0, 'bg1').setScale(1.3);
      gameState.bg3 = this.add.image(1000000, 100000, 'bg3')
      gameState.bg1.setOrigin(0, 0);
  
  
      const game_width = parseFloat(2000)
      gameState.width = game_width;
      const window_width = config.width
  
      const bg1_width = gameState.bg1.getBounds().width
     
  
      gameState.bgColor .setScrollFactor(0);
      gameState.bg1.setScrollFactor((gameState.bg1.width - window_width) / (game_width - window_width));
    
    }
  
    levelSetup() {
      for (const [xIndex, yIndex] of this.heights.entries()) {
        this.createPlatform(xIndex, yIndex);
      } 
      
      // Create the campfire at the end of the level
      gameState.goal = this.physics.add.sprite(gameState.width - 350, 150, 'campfire').setScale(.7)
  
      this.physics.add.overlap(gameState.player, gameState.goal, function() {
        this.cameras.main.fade(800, 0, 0, 0, false, function(camera, progress) {
          if (progress > .9) {
            this.scene.stop(this.levelKey);
            this.scene.start(this.nextLevel[this.levelKey]);
          }
        });
      }, null, this);
  
      this.setWeather(this.weather);
    }
  
  
    update() {
      if(gameState.active){
        gameState.goal.anims.play('fire', true);
        if (gameState.cursors.right.isDown) {
          gameState.player.flipX = false;
          gameState.player.setVelocityX(150);
          gameState.player.anims.play('run', true);
        } else if (gameState.cursors.left.isDown) {
          gameState.player.flipX = true;
          gameState.player.setVelocityX(-150);
          gameState.player.anims.play('run', true);
        } else {
          gameState.player.setVelocityX(0);
          gameState.player.anims.play('idle', true);
        }
  
        if (gameState.cursors.up.isDown && gameState.player.body.touching.down) {
          gameState.player.anims.play('jump', true);
          gameState.player.setVelocityY(-150);
        }
 
        if(gameState.cursors.down.isDown){
          gameState.player.anims.play('jump', true); 
          gameState.player.setVelocityY(150)
        }
  
        if (!gameState.player.body.touching.down){
          gameState.player.anims.play('jump', true);
        }
        
        if (gameState.player.y > gameState.bg1.height) {
          this.cameras.main.shake(240, .01, false, function(camera, progress) {
            this.scene.restart(this.levelKey);
          });
        }
        
        if (Phaser.Input.Keyboard.JustDown(gameState.cursors.space)){
          gameState.bugRepellent.create(gameState.player.x, gameState.player.y, 'bugRepellent').setGravityY(-400)
         }
 
        if(this.numOfTotalEnemies() === 182){
          this.cameras.main.fade(800, 0, 0, 0, false, function(camera, progress) {
            if (progress > .9) {
              this.scene.stop(this.levelKey);
              this.scene.start(this.nextLevel[this.levelKey]);
            }
          });
        }
 
      }
    }
    createStars() {
      gameState.stars = [];
      function getStarPoints() {
        const color = 0xffffff;
        return {
          x: Math.floor(Math.random() * 900),
          y: Math.floor(Math.random() * config.height * .5),
          radius: Math.floor(Math.random() * 3),
          color,
        }
      }
      for (let i = 0; i < 200; i++) {
        const { x, y, radius, color} = getStarPoints();
        const star = this.add.circle(x, y, radius, color)
        star.setScrollFactor(Math.random() * .1);
        gameState.stars.push(star)
      }
    }
  
    
    
  
    setWeather(weather) {
      const weathers = {
  
        'morning': {
          'color': 0xecdccc,
          'snow':  1,
          'wind':  20,
          'bgColor': 0xF8c3aC,
        },
  
        'afternoon': {
          'color': 0xffffff,
          'snow':  1,
          'wind': 80,
          'bgColor': 0x0571FF,
        },
  
        'twilight': {
          'color': 0xccaacc,
          'bgColor': 0x18235C,
          'snow':  10,
          'wind': 200,
        },
  
        'night': {
          'color': 0x555555,
          'bgColor': 0x000000,
          'snow':  0,
          'wind': 0,
        },
      }
      let { color, bgColor, snow, wind } = weathers[weather];
      gameState.bg1.setTint(color);
      gameState.bgColor.fillColor = bgColor;
      gameState.emitter.setQuantity(snow);
      gameState.emitter.setSpeedX(-wind);
      gameState.player.setTint(color);
      for (let platform of gameState.platforms.getChildren()) {
        platform.setTint(color);
      }
      if (weather === 'night') {
        gameState.stars.forEach(star => star.setVisible(true));
      } else {
        gameState.stars.forEach(star => star.setVisible(false));
      }
  
      return
    }
  }
  
  
  
  class Level1 extends Level {
    constructor() {
      super('Level1')
      this.heights = [6, 7, 7, 8, 7, 6, 5, 5, 6, 6, 7, 8];
      this.weather = 'afternoon';
      this.level = 'Level1';
    }
    
    }
  
  class Level2 extends Level {
    constructor() {
      super('Level2')
      this.heights = [7, 8, 8, 7, 6, 7, 6, 6, 7, 8, 8, 7];
      this.weather = 'twilight';
    }
  }
  
  class Level3 extends Level {
    constructor() {
      super('Level3')
      this.heights = [6, 7, 7, 8, 7, 6, 7, 7, 6, 7, 8, 8];
      this.weather = 'night';
    }
  }
  
  class Level4 extends Level {
    constructor() {
      super('Level4')
      this.heights = [5, 7, 8, 7, 6, 6, 5, 5, 6, 4];
      this.weather = 'morning';
    }
  }
  
  class Level5 extends Level {
    constructor() {
      super('Level5')
      this.heights = [8, 7, 6, 7, 8, 7, 6, 7, 8];
      this.weather = 'afternoon';
    }
  }
  
  class Level6 extends Level{
    constructor(){
      super('Level6')
      this.heights = [5, 4, 3, 4, 5, 6, 5, 3, 4];
      this.weather = 'twilight';
    }
  }
  
  class Level7 extends Level{
    constructor(){
      super('Level7')
      this.heights = [5, 6, 7, 6, 4, 5, 3, 4, 5];
      this.weather = 'night';
    }
  }
  
  class Level8 extends Level{
    constructor(){
      super('Level8')
      this.heights = [7, 6, 5, 6, 4, 5, 6, 4, 5];
      this.weather = 'morning';
    }
  }
  
  class Level9 extends Level{
    constructor(){
      super('Level9')
      this.heights = [4, 3, 5, 6, 7, 5, 4, 5, 6];
      this.weather = 'afternoon';
    }
  }
  
  class Level10 extends Level{
    constructor(){
      super('Level10')
      this.heights = [5, 6, 7, 6, 4, 3, 2, 3, 4];
      this.weather = 'twilight';
    }
  }
  
  const gameState = {
    speed: 360,
    ups: 380,
    enemyVelocity: 1
  };
  
  const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 400,
    fps: {target: 60},
    backgroundColor: "b9eaff",
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 200 },
        enableBody: true,
  
    },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    
    scene: [StartScene, TutorialScene, Level1, Level2, Level3, Level4, Level5, Level6, Level7, Level8, Level9, Level10 ]
  };
  
  const game = new Phaser.Game(config);
