class PlayableController {
    constructor() {
        app.events.on( app.events.PART_CLICK, this.onPartClick);
        app.events.on( app.events.PLAYER_DRESSED, this.onPlayerDressed);
        app.events.on( app.events.PLAYER_SHOW_BOSS, this.onPlayerShowBoss);

        //this.onPlayerDressed();
    }    

    hideAllParts() {
        let delay = 0;
        for (let circle of app.upgradeCircles) {
            circle.hidePart( delay );
            delay += 0.05;
        }
    }
    
    showAllParts() {
        let delay = 0;
        for (let circle of app.upgradeCircles) {
            circle.showPart( app.currentPartId, delay );
            delay += 0.05;
        }
    }
    
    hideAllCircles() {
        for (let circle of app.upgradeCircles) {
            circle.hide();
        }
    }

    openDoor() {
        gsap.to( app.obj3d.door1.position, 0.25, {z: '-=0.15', ease: 'sine.inOut'} );
        gsap.to( app.obj3d.door2.position, 0.25, {z: '-=0.15', ease: 'sine.inOut'} );

        gsap.to( app.obj3d.door1.position, 0.5, {y: '-=1.6', delay: 0.25, ease: 'sine.inOut'} );
        gsap.to( app.obj3d.door2.position, 0.5, {y: '+=1.6', delay: 0.25, ease: 'sine.inOut'} );
    }
    
    onPartClick = (object) => {
        let part = object.circle.parts[app.currentPartId];
        part.isClick = true;
        app.obj3d.player.dressUp(part);

        playSound('choice');

        this.hideAllParts();

        app.currentPartId++;
        
        if (app.currentPartId < 4) {
            gsap.delayedCall(0.6, ()=>this.showAllParts());
        } else {
            this.hideAllCircles();
            app.obj3d.followCamera.offset.set(0, 1.5, 3);
            app.obj3d.followCamera.look.set(0, 1.1, 0);
        }
    }
    
    onPlayerDressed = () => {
        this.openDoor();

        app.obj3d.player.model.anim.set('Victory');        

        gsap.to( app.obj3d.podium.rotation, 0.5, {y: Math.PI, ease: 'sine.out', onComplete: this.playerRunToStart} );
        gsap.to( app.obj3d.player.model.position, 1.5, {z: -4.5, y:0, delay: 0.5, ease: 'sine.inOut', onComplete: this.startFightGame});     

        app.events.off( app.events.PLAYER_DRESSED, this.onPlayerDressed);
        
		fadeSound("lobby_song", assets.sounds["lobby_song"].volume(), 0, 1000);	
    }    

    playerRunToStart() {
        app.obj3d.world.attach( app.obj3d.player.model );
        app.obj3d.player.model.anim.set('Run_Hero');
        app.obj3d.followCamera.offset.set(0, 2.2, 2);
        app.obj3d.followCamera.look.set(0, 1.0, 0);
        app.obj3d.followCamera.target = app.obj3d.player.model;
    }

    startFightGame() {
        playSound("music", true);
		fadeSound("music", 0, assets.sounds["music"].volume(), 1000);	

        app.stateGame = app.states.FIGHT;

        app.obj3d.player.model.anim.set('Idle');
        app.obj3d.player.startFightPhase();
        app.obj2d.joystick.start();

        app.obj2d.tutorialJoystick.display.visible = true;
        app.obj2d.coinsBar.show();

        app.enemies.forEach( enemy => enemy.startFightPhase() );
        app.coins.forEach( coin => coin.startFightPhase() );

        app.obj3d.followCamera.offset.set(0, 7.7, 5);
        app.obj3d.followCamera.look.set(0, 0, -1);
        app.obj3d.followCamera.dump = 0.25;
        app.obj3d.room.visible = false;       
    }

    onPlayerShowBoss = () => {
        app.stateGame = app.states.BOSS;
        app.obj2d.joystick.stop();

        app.obj2d.bossFightText.show();

        app.obj3d.player.stopFightPhase();
        app.enemies.forEach( enemy => enemy.stopFightPhase() );

        app.obj3d.followCamera.offset.set(0, 4.0, 4.0);
        app.obj3d.followCamera.look.subVectors( app.obj3d.boss.model.position, app.obj3d.player.model.position );        
        app.obj3d.followCamera.dump = 0.1;

        app.obj2d.tutorialJoystick.display.visible = true;
        app.obj2d.coinsBar.hide();

        app.events.off( app.events.PLAYER_SHOW_BOSS, this.onPlayerShowBoss);
        
        fadeSound("music", assets.sounds["music"].volume(), 0, 1000);	

        gsap.delayedCall(0.5, ()=>{
            playSound("win");
            appEndGame();
        })
    }
}