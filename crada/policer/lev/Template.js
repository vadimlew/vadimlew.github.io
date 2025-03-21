function Template() {
    this.downloadButton = function ({text = 'DOWNLOAD', bgColor = 0xfff000, textColor = 0x4e2f16} = {}) {
        let downloadBtn = new PIXI.Container();
        if (adPlatform.value == 'google') return downloadBtn;

        let btnSprite = new PIXI.Container();
        downloadBtn.addChild(btnSprite);
        
        let btnBg = PIXI.Sprite.from('data:image/png;base64,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');
        btnBg.tint = bgColor;
        btnBg.anchor.set(0.5, 0.5);        

        let dropShadow = new PIXI.filters.DropShadowFilter({
            offset: {x:0, y:10},
            alpha: 0.2, 
            blur: 4            
        });
        btnBg.filters = [dropShadow];        
        btnSprite.addChild(btnBg);
        
        let btnText = PIXIText(text, {
            fontFamily: "font_baloo",
            fontSize: 40,
            color: textColor,
            align: "center",			// left, right, center
            valign: "center",			// top, bottom, center
            letterSpacing: -3           
        });
        btnText.x = 0;
        btnText.y = 0;
        btnSprite.addChild(btnText);        
        
        downloadBtn.interactive = true;
	    downloadBtn.on('pointerdown', clickAd);

        downloadBtn.show = function() {            
            gsap.to(downloadBtn, 0.5, {alpha:1});
        }
        
        downloadBtn.hide = function() {            
            gsap.to(downloadBtn, 0.5, {alpha:0});
        }

        return downloadBtn;
    }  

    
    this.soundButton = function() {
        let soundBtn = new PIXI.Container();
		let sndSpriteOn = PIXI.Sprite.from('data:image/png;base64,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');
		let sndSpriteOff = PIXI.Sprite.from('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAAB1CAMAAAC1SsluAAAAXVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADv7+8AAADd3d319fUAAAAAAAAAAACfn5/ExMTV1dXd3d0AAAD6+vrT09Pl5eVfX1////9+3VrNAAAAHnRSTlMABgcOCAsFAQMCEBQNF9c9xJ9aKVyFO4VOVPKutmq7P7LTAAAEgUlEQVRo3u3bbULiMBSFYWcKI9MUilSo+MH+lzkZSnxbbpIbQ0v/cBbgfTyJRZv49Mgjj9yY52Ge7hsGz+Bg/BwMxs+iADCj4vnnmRzw9zqTIrTpZCJF2nwyOiI6f+UyoSI4f+VLRDEyYBWLrsgHyPl/+hEKBZELYLo/oyqCAOYrDA2RD/iTkDgiV+Cd/4sEFLmIKIDpMsmITIFn/m/iZYQRyQIvQEwXDomQhhyBnL8YBsZAESpCFbAIAiDGC4YPkW6IVABgEc23ItMQEUjAsp9UBIQkgQSI8QEGiEgRCkEIAAznt6f3VjIkQukhUQCAvJxsMEQQGBSCFACQC1BZgc1LJVcEBAYbacgXVDYXwWlTneNHhHrQCUIgAEVhBR2hsEERREiDVgICAMzvBBAcA4TfoBJ0QTcfAQSpCBtUAhsBAQAngFDaCARF6AZZQljgAOVFAKHP6CGEQSVQghRQQYkAAgoQwkANIQIlsBGc4K0XJxCEwwHE8nAIGAI1eEtAcHg/BbMxxgnsc8o1UbXdcxMDS6ETpGC5OcUI55wFZ0Pp9qswiBoiJbAMy3NOOsFYgTOUnQDDcCkgpJdQRQkInIH9esCQR3CCNAIG9uvb+QtoNUAIllAkENbbkwt7d7teptYQL0EhrG2MaV6/DQiOTSVq0Ahsxn4JOsGm/jYgqKsqVINOYB2qRAIGBEWBwbsSCCB41qFIIGBAsKuLDMJKEqoEAoZ39uSuLgsbVoLNMD6BfJ7IZ9kRKjbDDwmLDMLlecAzKosgd2ORSECAgc2QR2A3likEBBj8+3EyQstOHBjuRzj0fhr52TzclYDgiEEhjLsdm/YieK1N7QztuqhGIryrBNO8tk5gnKE9Qrj1ubBP2I7WcBE4Q7trxHMh++l4/Nr3shWEi+FrfxGYst7t91ZwK4H9uD7uXF5ttkMCBicwpTVYgfIZoX9YQyhM00vdGSCAcAKbZl2on5Q6gZUou1wmYOgTjFkj+B8IGb+yyBogYBgQDBGC2wlxw4bxQwE7gXVI+w16BQFDZC02JiygBJ2QXAOG3RaCACCghCyCMIDA8OEBIMj5a0rUgAFE39D25xsAQhAj6DVgcHM6w4ctoeb7H1QwEFBCCiFocAhS72waXKKCvPcL1HBloIhuojkbjg3TAahvetLfNWGQRRDmA1AEEEI1rJR3fsH5ANLfuKW/9QMBg/ERAAJK0AkYWAsQwVQCoL59TTcMEZU6XxdA0N+DY0BxxZDHAcppgH4YIHsAgYIwP+s8QjcIRDwLANrJkH42JQ0gdAAV6ALdACKuWAQPxxBoBGmgCBBehu+wVBfoB8YYQBAxnAIAKIJEAwgUysG5fmadf3egm5J+cK8K0g3yAgWOq1sUo96hAIECRuIlDl2gG0CgQBK+UJN/n0ZHwCAT3SrCAGLmy1Uo8q+YjXLLThmfc8VNLwJEhDH9dUMUAnKXS5dSMcPVUxABx/QXcFHMfA1ZV0x7GZso08nUt/L908ns/xow7ngUs/+TBoo55pN5x5OZx0vJ0yOPPDJy/gE2YnFZ7OrSAwAAAABJRU5ErkJggg==');
        soundBtn.addChild(sndSpriteOn, sndSpriteOff);
		
		sndSpriteOn.anchor.set(0.5, 0.5);
		sndSpriteOff.anchor.set(0.5, 0.5);
		sndSpriteOff.visible = false;

		function switchOff() {
			sndSpriteOn.visible = false;
			sndSpriteOff.visible = true;
		}

		function switchOn() {
			sndSpriteOn.visible = true;
			sndSpriteOff.visible = false;
		}

		soundBtn.interactive = true;				
		soundBtn.on('pointerup', clickSoundButtonHandler);

        function clickSoundButtonHandler(e) {
            if (app.isSounds) {
                app.isSounds = false;		
                switchOff();
                Howler.mute(true);
            } else {
                app.isSounds = true;	
                switchOn();
                Howler.mute(false);
            }
        }
		
		return soundBtn;
    }


    this.overlay = function(stageDownHandler, stageMoveHandler, stageUpHandler) {
        let overlay = new PIXI.Graphics();
        overlay.beginFill(0x939393, 0.9);
        overlay.drawRect(-1280 * 0.5, -1280 * 0.5, 1280, 1280);
        overlay.endFill();
        overlay.alpha = 0;
        overlay.interactive = true;

        if (stageDownHandler) overlay.on('pointerdown', stageDownHandler);
        if (stageMoveHandler) overlay.on('pointermove', stageMoveHandler);
        if (stageUpHandler) {
            overlay.on('pointerup', stageUpHandler);
            overlay.on('pointerout', stageUpHandler);
            overlay.on('pointeroutside', stageUpHandler);
            overlay.on('touchendoutside', stageUpHandler);
        }
        
        return overlay;
    }


    this.fullScreenCTA = function() {
        let fsCTA = new PIXI.Graphics();
        fsCTA.beginFill(0x121214, 1);
        fsCTA.drawRect(-1280 * 0.5, -1280 * 0.5, 1280, 1280);
        fsCTA.endFill();
        fsCTA.alpha = 0;
        fsCTA.visible = false;
        
        fsCTA.interactive = true;
        fsCTA.on('pointerup', clickAd);

        return fsCTA;
    }


    this.text = function({txt='', color=0xffffff, fontSize=50, fontFamily='font_baloo'}) {
        let text = PIXIText(txt, {
            fontFamily,
            fontSize,
            color,
            align: "center", //left, right, center
        	valign: "center", //top, bottom, center
        	letterSpacing: -3                     
        });       
        return text;
    }     


    this.outlinedText = function({txt='', color=0xffffff, fontSize=50, fontFamily='font_baloo', outlineColor=0x000000, outlineWidth=4}) {
        let filterOutline = new PIXI.filters.OutlineFilter(outlineWidth, outlineColor);
        filterOutline.padding = 10;

        let text = PIXIText(txt, {
            fontFamily,
            fontSize,
            color,
            align: "center", //left, right, center
        	valign: "center", //top, bottom, center
        	letterSpacing: -3                     
        });

        text.filters = [filterOutline];
        return text;
    }    


    this.joystick = function({player, layer, maxSpeed=1, isTutor=false}) {
        let hand;
        let bgSize = 100;
        let barSize = 35;
        let limit = bgSize - barSize;
        
        player.speed = 0;
        player.toSpeed = 0;
        player.toRotate = 0;

        let joystick = new PIXI.Container();
        let mouse = {x:0, y:0, isDown:false};

        let joystickBg = new PIXI.Graphics();
        joystickBg.lineStyle (2, 0xdddddd);
        joystickBg.beginFill(0xffffff);
        joystickBg.drawCircle(0, 0, bgSize);
        joystickBg.alpha = 0.5;
        joystick.addChild(joystickBg);

        let joystickBar = new PIXI.Graphics();
        joystickBar.lineStyle (2, 0xdddddd);
        joystickBar.beginFill(0xffffff);
        joystickBar.drawCircle(0, 0, barSize);
        joystickBar.alpha = 0.65;
        joystick.addChild(joystickBar);

        if (isTutor) {
            hand = PIXI.Sprite.from(assets.textures.pixi['hand']);
            hand.anchor.set(0.1, 0.1);
            joystick.addChild(hand);
            hand.a = 0
            gsap.to(hand, 1.5, {a:Math.PI*2, repeat:-1, ease:'none', onUpdate:() => {
				hand.x = 57*Math.cos(hand.a);
				hand.y = 57*Math.sin(hand.a);
                joystickBar.x = hand.x;
                joystickBar.y = hand.y;
				hand.rotation = 0.2*Math.sin(hand.a+1);
            }});
        } else {
            joystick.visible = false;
        } 

        joystick.on('added', addedHandler);
        function addedHandler() {
            joystick.start();
            joystick.off('added', addedHandler);
        }          

        function stageDownHandler(e) {
            mouse.isDown = true;

            if (isTutor && hand.visible) {
                hand.visible = false;
                gsap.killTweensOf(hand);
            }

			joystick.parent.toLocal(e.global, null, mouse);

			joystick.visible = true;
			joystick.x = mouse.x;
			joystick.y = mouse.y;
			joystickBar.x = 0;
			joystickBar.y = 0;           
        }

        function stageMoveHandler(e) {
            if (mouse.isDown) {
                joystick.parent.toLocal(e.global, null, mouse);
                
                let dx = mouse.x - joystick.x;
                let dy = mouse.y - joystick.y;
                let angle = Math.atan2(dy, dx);
                let dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist > limit) dist = limit;
                
                joystickBar.x = dist * Math.cos(angle);
                joystickBar.y = dist * Math.sin(angle);
                
                player.toRotate = -angle;
                player.toSpeed = maxSpeed * dist / limit;
            }
        }

        function stageUpHandler(e) {
            player.toSpeed = 0;
            mouse.isDown = false;
	        joystick.visible = false;           
        }

        joystick.stop = function() {
            layer.off('pointerdown', stageDownHandler);
            layer.off('pointermove', stageMoveHandler);
            layer.off('pointerup', stageUpHandler);
            layer.off('pointerupoutside', stageUpHandler);

            stageUpHandler();
        }

        joystick.start = function() {
            layer.on('pointerdown', stageDownHandler);
            layer.on('pointermove', stageMoveHandler);
            layer.on('pointerup', stageUpHandler);
            layer.on('pointerupoutside', stageUpHandler);
        }

        return joystick;
    }
    

    this.debug3dHelpers = function() {
        var GridHelper3d = new THREE.GridHelper( 100, 10, 0xcccccc, 0xcccccc);
        var AxesHelper3d = new THREE.AxesHelper(100);
        AxesHelper3d.position.y = 0.01;
        app.scene3d.add(GridHelper3d);
        app.scene3d.add(AxesHelper3d);
    }

    this.particles = function(material, num, update, preCalc=0) {
        let group = new THREE.Group();     
        let parts = [];
        
        for (let i = 0; i < num; i++) {           
            let part = new THREE.Sprite(material);
            part.visible = false;
            group.add(part);
            parts.push(part);
        }

        group.update = function() {            
            parts.forEach(update);
        }

        for (let i=0; i < preCalc; i++) group.update();
        
        return group;
    }


    this.confetti = function(num, vy) {
        let group = new THREE.Group();     
        let parts = [];
        
        for (let i = 0; i < num; i++) {           
            let geometry = new THREE.PlaneGeometry(0.08 + 0.08*Math.random(), 0.05 + 0.05*Math.random());
            let material = new THREE.MeshBasicMaterial({color: 0xffffff*Math.random(), side:THREE.DoubleSide});
            let part = new THREE.Mesh(geometry, material);  

            part.vx = -0.05 + 0.1 * Math.random();
            part.vz = -0.05 + 0.1 * Math.random();
            part.vy = vy + vy/2*Math.random();           

            group.add(part);
            parts.push(part);
        }

        group.update = function() {            
            parts.forEach(part => {
                part.position.x += part.vx;
                part.position.y += part.vy;
                part.position.z += part.vz;

                part.vy -= 0.007;

                part.rotation.x = Math.atan2(part.vz, part.vy);
                part.rotation.y = Math.atan2(part.vx, part.vz);
                part.rotation.z = Math.atan2(part.vy, part.vx);             

                if (part.position.y < -2) {
                    part.parent.remove(part);
                    let id = parts.indexOf(part);
                    parts.splice(id, 1);
                }
            });
        }

        return group;
    }
}