function stayOnGround(obj, dy) {   
    app.rayStart.copy(obj.position);
    app.rayStart.y += 5;
    app.raycaster.set(app.rayStart, app.rayDirect);
	var intersects = app.raycaster.intersectObject(app.obj3d.ground); 
	if (intersects.length > 0) {
		let y = intersects[0].point.y;        
		obj.position.y = y + dy;
	}
}


function addSnakeBody(obj) {    
    let body = THREE.SkeletonUtils.clone(obj.body);
    obj.head.add(body);  
	body.mesh = body.getObjectByName('Body');

    body.mesh.skeleton.bones[0].rotation.set(0,0,0);
    body.mesh.skeleton.bones[2].rotation.set(0,0,0);
    body.mesh.skeleton.bones[0].position.y = 0.5;
    body.mesh.skeleton.bones[2].position.y = 0.48;

    obj.tail.mesh.skeleton.bones[0].position.y = -0.5;
    obj.tail.mesh.skeleton.bones[2].position.y = -0.5;

    gsap.to(obj.tail.mesh.skeleton.bones[0].position, 0.25, {y:0.5, ease:'sine.out'});
    gsap.to(obj.tail.mesh.skeleton.bones[2].position, 0.25, {y:0.48, ease:'sine.out'});

    body.mesh.skeleton.bones[1].add(obj.tail.mesh.skeleton.bones[0]);
	body.mesh.skeleton.bones[1].add(obj.tail.mesh.skeleton.bones[2]);

    let lastBone = obj.bones[ obj.bones.length-3 ]; 
    lastBone.add(body.mesh.skeleton.bones[0]);
	lastBone.add(body.mesh.skeleton.bones[2]);

    obj.bones.splice(obj.bones.length-2, 0, body.mesh.skeleton.bones[0], body.mesh.skeleton.bones[1]);	
    
    addSnakePhysPart(obj);
    addSnakePhysPart(obj);   
}


function addSnakePhysPart(obj) {
    let id = obj.parts.length-1;
    let lastPart = obj.parts[id];

    let part = new THREE.Object3D();
    part.name = 'body';
	part.position.copy( lastPart.position );
    part.position.x -= Math.sin(lastPart.rotation.y) * 0.5;
    part.position.z -= Math.cos(lastPart.rotation.y) * 0.5;
    part.rotation.y = lastPart.rotation.y;

	app.obj3d.main.add(part);
	app.phys.add(part, {shape:'circle', radius:0.24, drag:0.05, mass:0.01, debug:false});
	obj.parts.push(part);
	app.phys.joint(lastPart, part, 0.5);
}


function eatFruit(obj) {
    playSound('sEatFruit');
    obj.head.mesh.anim.set('eat');
}


function startFood( num = 30 ) {
    for (let i=0; i < num; i++) {
		gsap.delayedCall(Math.random()*0.75, addRandomFood);
	}
}


function addRandomFood(pos) {
    let food = app.foodModels[ app.foodId ].clone();//getRandomItem( app.foodModels ).clone();
    food.isDown = false;
    food.name = 'fruit';
    food.visible = true;

    app.foodId++;
    if ( app.foodId === app.foodModels.length )
    app.foodId = 0;

    app.obj3d.main.add(food);
    app.foods.push(food);    

    stayOnGround(food, 0);

    if (!pos) {
        let randomAngle = 2 * Math.PI * Math.random();
        let radius = 20 * Math.sqrt( Math.random() );

        let x = radius * Math.sin( randomAngle );
        let z = radius * Math.cos( randomAngle ); 
        
        food.position.set(x, 0, z);  
        
        gsap.from(food.position, 0.7, {y:'+=10', ease:'quad.in', onComplete:()=>{
            food.isDown = true;
        }});
    } else {
        food.position.copy(pos);
        food.isDown = true;
    }        

    app.phys.add(food, {shape:'circle', radius:0.4, debug:false});
    gsap.to(food.position, 1, {y:'+=0.2', delay:0.7, repeat:-1, yoyo:true, ease:'sine.inOut'});
    gsap.to(food.rotation, 3, {y:-2*Math.PI, repeat:-1, ease:'none'});

    food.eat = () => {
        gsap.killTweensOf(food.position);
        gsap.killTweensOf(food.rotation);
        food.phys.destroy();

        let id = app.foods.indexOf(food);
        app.foods.splice(id, 1);
    };
}


function failGame() {
    gsap.to(app.obj2d.helper, 0.25, { alpha: 0 });
    app.camera3d.angle = 0;
    app.stateGame = 'fail';
    app.obj2d.joystick.stop();
    app.obj2d.joystick.stopMovement();
    app.obj2d.failScreen.show();
    app.obj2d.leaderBoard.hide();
    appEndGame();
}


function winGame() {
    appEndGame();
    app.stateGame = 'win';
    app.obj2d.joystick.stop();
    app.obj2d.winScreen.show();
    app.obj2d.leaderBoard.hide();
}


function movement() {
    let maxAngle = 0.08;
    let t = 0.1;
    let da = this.toAngle - this.rotation.y;
    if (Math.abs(da) > Math.PI) this.toAngle = 2*Math.PI + this.toAngle;

    da = (this.toAngle - this.rotation.y)/4;
    if (da > maxAngle) da = maxAngle;
    if (da < -maxAngle) da = -maxAngle;

    this.rotation.y += da;
        
    //this.rotation.y = this.rotation.y * (1 - t) + this.toAngle * t;
    this.position.x += this.speed * Math.sin(this.rotation.y);
    this.position.z += this.speed * Math.cos(this.rotation.y);
}


function enemyAI() {
    app.enemies.forEach(enemy => {
        if (enemy.target && enemy.target.isDown && enemy.target.visible) {
            let dx = enemy.target.position.x - enemy.position.x;
            let dz = enemy.target.position.z - enemy.position.z;
            enemy.toAngle = Math.atan2(dx, dz);            
        } else {
            enemy.target = getRandomItem(app.foods);            
        }

        enemy.movement();
    });
}


function clearFruit() {
    for (let fruit of app.foods) {
        gsap.killTweensOf(fruit.position);
        gsap.killTweensOf(fruit.rotation);     
        fruit.phys.destroy();

        gsap.to(fruit.scale, {x:0, y:0, z:0, ease:'sine.out', onComplete:()=>{
            fruit.visible = false;
        }});
    }

    app.foods.length = 0;
}