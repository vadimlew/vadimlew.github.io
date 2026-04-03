function getWorldDrawableMaterial() {
    let size = app.mapSize;

    let mapCanvas = document.createElement('canvas');
    mapCanvas.width = size;
	mapCanvas.height = size;    

    let mapCtx = mapCanvas.getContext && mapCanvas.getContext('2d');   
	
	let mapTexture = new THREE.CanvasTexture( mapCanvas );
	mapTexture.flipY = false;		

    app.obj3d.mapCtx = mapCtx;   
    app.obj3d.mapTexture = mapTexture;   

	setInterval(()=>{
		mapTexture.needsUpdate = true;		
	}, 150);	

	return new TestMaterial({
		map: assets.textures.three.textureWorld			
	}, mapTexture);	
}

function addPaintToTexture(tx, ty, paintName) {	
	let mapCtx = app.obj3d.mapCtx;

	let pointSize = (32+32*Math.random());
	let x = tx + 5 - 10 * Math.random() - pointSize / 2;
	let y = ty + 5 - 10 * Math.random() - pointSize / 2;	

	mapCtx.drawImage( assets.textures.base[paintName], x, y, pointSize, pointSize);
}


function clearTexture() {
	let size = app.mapSize;
    app.obj3d.mapCtx.drawImage( assets.textures.base['texture_world'], 0, 0, size, size );	
    app.obj3d.normalCtx.fillStyle = "#8181fd";
	app.obj3d.normalCtx.fillRect(0, 0, size, size);		

	app.obj3d.mapTexture.needsUpdate = true;
	app.obj3d.normalTexture.needsUpdate = true;
}


function addCursor(parent, followTo) {
	let geometry = new THREE.ConeGeometry( .015, .025, 4, 1 );
	geometry.translate( 0, 0.05, 0 );
	geometry.rotateY( Math.PI/4 );
	geometry.rotateX( Math.PI/2 );
	geometry.scale(1, 0.1, 1);
	
	let material = new THREE.MeshBasicMaterial( {color: 0x990000} );
	let cone = new THREE.Mesh( geometry, material );
	cone.name = 'arrow';
	cone.position.y = 0.03;
	cone.scale.set(1.5, 1.5, 1.5);
	parent.add( cone );

	let geometry2 = new THREE.ConeGeometry( .015, .025, 4, 1 );
	geometry2.scale(1.2, 1.2, 1);
	geometry2.translate( 0, 0.046, 0 );
	geometry2.rotateY( Math.PI/4 );
	geometry2.rotateX( Math.PI/2 );	
	geometry2.scale(1., 0.1, 1);
	
	let material2 = new THREE.MeshBasicMaterial( {color: 0x000000} );
	let cone2 = new THREE.Mesh( geometry2, material2 );
	cone2.name = 'arrow';
	cone2.position.y = -0.001;
	cone2.scale.set(1.15, 1.15, 1.15);
	cone.add( cone2 );

	function follow() {
		let dx = followTo.position.x - parent.position.x;
		let dz = followTo.position.z - parent.position.z;
		let angle = Math.atan2(dx, dz);
		cone.rotation.y = angle - parent.rotation.y;
		if (!followTo.visible) {
			gsap.ticker.remove(follow);
			cone.visible = false;
		}
	}

	gsap.ticker.add(follow);
}


class BulletManager {
	pool = [];
	bullets = [];
	intersects = [];
	bulletAABB = new CANNON.AABB();
	raycaster = new THREE.Raycaster();
    rayStart = new THREE.Vector3();
    rayDirect = new THREE.Vector3(0, -1, 0);
	soundTimer = 20;
	soundHitTimer = 10;

	constructor(character, ground, enemies) {
		character.shoot = ()=>this.shoot(character);
		app.update.push( ()=>this.update(character, ground, enemies) );
		//this.precalculate(character);
		this.raycaster.far = 0.15;
	}

	precalculate(character) {
		for (let i=0; i < 50; i++) {
			let bullet = new Bullet( character );
			this.pool.push(bullet);
			this.bullets.push(bullet);
		}
	}

	shoot(character) {
		let bullet;

		if (this.pool.length > 0) {
			bullet = this.pool.shift();
		} else {
			bullet = new Bullet( character );			
			this.bullets.push(bullet);	
		}
		
		if (this.soundTimer <= 0) {
			playSound("water_"+randomInteger(1, 4));
			this.soundTimer = 20 + Math.floor(5*Math.random());
		}			

		bullet.init(character);
	}

	clear() {
		for (let bullet of this.bullets) {
			bullet.object3d.visible = false;
		}
		this.pool.length = 0;
		this.bullets.length = 0;
	}

	update(character, ground, enemies) {		
		this.soundTimer--;	
		this.soundHitTimer--;	

		for (let bullet of this.bullets) {
			if (bullet.object3d.visible) {
				bullet.update();				

				if (bullet.object3d.position.y < -0.5) {
					bullet.object3d.visible = false;
					this.pool.push(bullet);	
					continue;				
				}

				this.bulletAABB.lowerBound.copy(bullet.object3d.geometry.boundingBox.min);
				this.bulletAABB.upperBound.copy(bullet.object3d.geometry.boundingBox.max);
				this.bulletAABB.lowerBound.vadd(bullet.object3d.position, this.bulletAABB.lowerBound);
				this.bulletAABB.upperBound.vadd(bullet.object3d.position, this.bulletAABB.upperBound);

				for (let body of app.phys.platforms) {					
					if (body.aabb.overlaps(this.bulletAABB)) {
						/*if (bullet.isSplash) {
							bullet.object3d.visible = false;
							this.pool.push(bullet);
							continue;
						}*/

						this.rayStart.copy(bullet.object3d.position);
						this.rayDirect.set(bullet.vx, bullet.vy, bullet.vz);
						this.rayDirect.normalize();

						this.intersects.length = 0;						
						this.raycaster.set(this.rayStart, this.rayDirect);
						this.raycaster.intersectObject(ground, false, this.intersects);
						
						if (this.intersects.length > 0) {
							let intersect = this.intersects[0];

							if (bullet.isSplash) {
								bullet.object3d.visible = false;
								this.pool.push(bullet);
								addPaintToTexture(intersect.uv.x * app.mapSize, intersect.uv.y * app.mapSize, bullet.color);
							} else {
								bullet.isSplash = true;
								bullet.vx = 0.005-0.005*2*Math.random();
								bullet.vz = 0.005-0.005*2*Math.random();
								bullet.vy = 0.005+0.005*Math.random();
								addPaintToTexture(intersect.uv.x * app.mapSize, intersect.uv.y * app.mapSize, bullet.color);
							}							
						}
					}
				}
				
				for (let enemy of enemies) {
					enemy.body.computeAABB();
					
					if (!bullet.isSplash && enemy.visible && enemy.body.aabb.overlaps(this.bulletAABB)) {						
						bullet.object3d.visible = false;
						this.pool.push(bullet);
						enemy.life -= character.damage;
						enemy.lifeBarUI.set(enemy.life);

						if (this.soundHitTimer <= 0) {
							playSound("hitPlayer_"+randomInteger(0, 3));
							this.soundHitTimer = 5 + Math.floor(5*Math.random());
						}	

						app.obj3d.main.position.x += -.0075 + .015*Math.random();
						app.obj3d.main.position.y += -.0075 + .015*Math.random();
						app.obj3d.main.position.z += -.0075 + .015*Math.random();

						if (enemy.life <= 0) {
							enemy.die();
						}
					}
				}
			}
		}		
	}
}

class Bullet {
	object3d;
	vx; vy; vz;
	vrx; vry; vrz;
	isSplash = false;
	color;

	constructor( character ) {
		let bulletMaterial = character.bulletMaterial;
		this.object3d = app.obj3d.bullet.clone();
		this.object3d.material = bulletMaterial;
		this.color = character.paintColor;
	}

	init(character) {		
		this.isSplash = false;
		this.object3d.visible = true;		

		this.vx = 0.015 * Math.sin(character.rotation.y) + character.body.velocity.x * 0.03;
		this.vz = 0.015 * Math.cos(character.rotation.y) + character.body.velocity.z * 0.03;
		this.vy = 0.005 + 0.002;

		this.vrx = 0.1 - 0.1 * 2 * Math.random();
		this.vrz = 0.1 - 0.1 * 2 * Math.random();
		this.vry = 0.1 - 0.1 * 2 * Math.random();

		this.object3d.rotation.x = 7 * Math.random();
		this.object3d.rotation.y = 7 * Math.random();
		this.object3d.rotation.z = 7 * Math.random();

		let scale = 0.6 + 0.4 * Math.random();
		this.object3d.scale.x = scale
		this.object3d.scale.y = scale;
		this.object3d.scale.z = scale;

		character.muzzle.add(this.object3d);
		this.object3d.position.set(0, 0, 0);
		app.obj3d.main.attach(this.object3d);
	}

	update() {
		this.object3d.position.x += this.vx;
		this.object3d.position.y += this.vy 
		this.object3d.position.z += this.vz; 

		this.object3d.rotation.x += this.vrx;
		this.object3d.rotation.y += this.vry;
		this.object3d.rotation.z += this.vrz;

		this.vx *= 0.980;
		this.vy -= 0.002;
		this.vz *= 0.980;		
	}
}


function enemyAI() {
	let movePoints = [
		0.65, -0.5,
		0.2, -0.5,
		0, -0.5,
		-0.5, -0.5,
		0.6, 0,	
		-0.5, 0,
		0.65, 0.5,
		0.2, 0.5,
		0, 0.5,
		-0.5, 0.5		
	]

	for (let enemy of app.enemies) {
		if (enemy.turnTime === 0) {			
			enemy.turnTime = 10 + Math.floor(60 * Math.random());
			enemy.toSpeed = enemy.maxSpeed/2 + enemy.maxSpeed/2 * Math.random();			
			
			if ( Math.random() < 0.8 ) {				
				let idx = Math.floor(movePoints.length/4 * Math.random());
				if (enemy.position.z > 0) idx += 5;
				let newX = movePoints[idx*2];
				let newZ = movePoints[idx*2+1];
				let dx = newX - enemy.position.x;
				let dz = newZ - enemy.position.z;				
				enemy.toRotate = Math.atan2(dx, dz);
			} else {				
				let dx = app.obj3d.hero.position.x - enemy.position.x;
				let dz = app.obj3d.hero.position.z - enemy.position.z;
				enemy.toRotate = Math.atan2(dx, dz);
			}
			
		} else {
			enemy.turnTime--;
			enemy.speed += (enemy.toSpeed - enemy.speed) / 8;
		}
	}
}


function setColorForCharacter( character, colorIndex ) {
	let paintColor = app.paintColors.splice(colorIndex, 1)[0];
	let bulletColor = app.bulletColors.splice(colorIndex, 1)[0];
	let glassColor = app.glassColors.splice(colorIndex, 1)[0];
	let characterMap = app.characterTextures.splice(colorIndex, 1)[0];

	character.paintColor = paintColor;
	
	if ( typeof(bulletColor) === 'string' ) {		
		character.bulletMaterial.color = new THREE.Color(0xffffff);
		character.bulletMaterial.map = assets.textures.three[bulletColor];
	} else {
		character.bulletMaterial.color = new THREE.Color(bulletColor);
	}	
	
	character.material.map = assets.textures.three[characterMap];
	character.glassMaterial.color = new THREE.Color(glassColor);
	character.glassMaterial.emissive = new THREE.Color(glassColor);
	character.lifeBarUI.setColor( glassColor );
}