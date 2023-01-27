js.include('unittests.CollisionManagerTest');
js.include('unittests.CollisionManager3DTest');
js.include('unittests.ShapeTest');
js.include('unittests.VerletPhysicsTest');
js.include('unittests.VerletPhysics3DTest');

function TestManager() {
	var pixi = new PIXI.Application({ width:800, height:600, antialias: true, backgroundColor: 0xeeeeee });
	document.body.appendChild(pixi.view);
	
	console.log('#####################################< Start Unit Test >#####################################');
	//CollisionManagerTest(pixi);
	//CollisionManager3DTest(pixi);
	//ShapeTest(pixi);
	//VerletPhysicsTest(pixi);	
	VerletPhysics3DTest(pixi);	
	console.log('#####################################<  End Unit Test  >#####################################');
}