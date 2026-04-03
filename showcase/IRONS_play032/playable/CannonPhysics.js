class CannonPhysics {
    world = new CANNON.World();
	frictionMaterial = new CANNON.Material({ friction: 0.1 });
	frictionMaterial2 = new CANNON.Material({ friction: 1 });

    #fixedTimeStep = 1/25;
	#maxSubSteps = 3; 
    #fps = 1/25;
    #links = new Map();

    constructor() {
        this.world.gravity.set(0, -0.982*4, 0);

        this.#initGround();
        this.#initCones();
        this.#initFences();
        this.#initWheels();
        this.#initBoxes();

        app.update.add( this.#update );
    }

    #initGround() {
        let groundBody = new CANNON.Body({
            mass: 0,
            position: new CANNON.Vec3(0, 0, 0),            
            material: this.frictionMaterial
        });	

        groundBody.addShape( new CANNON.Box( new CANNON.Vec3(5.5/2, 0.25, 11.9/2) ), new CANNON.Vec3(0, -0.25, -8.4) );
        groundBody.addShape( new CANNON.Box( new CANNON.Vec3(5/2, 0.25, 4.65/2) ), new CANNON.Vec3(5.2, -0.25, -12.03) );
        groundBody.addShape( new CANNON.Box( new CANNON.Vec3(4.85/2, 0.25, 38.8/2) ), new CANNON.Vec3(10, -0.25, -29) );        
        
        groundBody.addShape( new CANNON.Box( new CANNON.Vec3(0.12, 0.25, 6) ), new CANNON.Vec3(-2.86, 0, -8.5) );
        groundBody.addShape( new CANNON.Box( new CANNON.Vec3(0.12, 0.25, 3.65) ), new CANNON.Vec3(2.86, 0, -6) );

        groundBody.addShape( new CANNON.Box( new CANNON.Vec3(0.12, 0.25, 34/2) ), new CANNON.Vec3(7.46, 0, -31.36) );
        groundBody.addShape( new CANNON.Box( new CANNON.Vec3(0.12, 0.25, 39/2) ), new CANNON.Vec3(12.55, 0, -28.91) );

        groundBody.addShape( new CANNON.Box( new CANNON.Vec3(5.05, 0.25, 0.12) ), new CANNON.Vec3(2.3, 0, -14.475) );
        groundBody.addShape( new CANNON.Box( new CANNON.Vec3(4.9, 0.25, 0.12) ), new CANNON.Vec3(7.76, 0, -9.5) );

        groundBody.addShape( new CANNON.Box( new CANNON.Vec3(3, 1, 1) ), new CANNON.Vec3(0, 0, -1.47) );
        groundBody.addShape( new CANNON.Box( new CANNON.Vec3(3, 1, 1) ), new CANNON.Vec3(10, 0, -25) );

        this.world.addBody( groundBody );
    }

    #initCones() {
        for ( let index = 1; index <= 3; index++ ) {
            let coneModel = app.obj3d.world.getObjectByName('Cone0'+index);
            
            let position = new CANNON.Vec3(coneModel.position.x, coneModel.position.y, coneModel.position.z);
            let coneBody = new CANNON.Body({
                mass: 5,
                position,
                material: this.frictionMaterial2
            });	
            coneBody.addShape( new CANNON.Cylinder(0.1, 0.27, 0.83, 4), new CANNON.Vec3(0, 0.18, 0) );
            coneBody.quaternion.setFromEuler( ...coneModel.rotation.toArray() );

            this.world.addBody(coneBody);
            this.linkModelToBody(coneModel, coneBody);

            /*const geometry = new THREE.CylinderGeometry( 0.1, 0.27, 0.83, 4 ); 
            const material = new THREE.LineBasicMaterial( {color: 0xffff00} );
            const cylinder = new THREE.Line( geometry, material );
            cylinder.position.y = 0.18;
            coneModel.add(cylinder);*/
        }       
    }

    #initFences() {
        for ( let index = 1; index <= 2; index++ ) {
            let fenceModel = app.obj3d.world.getObjectByName('fence0'+index);
            
            let position = new CANNON.Vec3(fenceModel.position.x, fenceModel.position.y, fenceModel.position.z);
            let fenceBody = new CANNON.Body({
                mass: 30,
                position,
                material: this.frictionMaterial2
            });	
            fenceBody.addShape( new CANNON.Box( new CANNON.Vec3(0.2, 0.42, 0.65) ), new CANNON.Vec3(0, 0, 0) );
            fenceBody.quaternion.setFromEuler( ...fenceModel.rotation.toArray() );

            this.world.addBody(fenceBody);
            this.linkModelToBody(fenceModel, fenceBody);

            /*let geometry = new THREE.BoxGeometry( 0.2*2, 0.42*2, 0.65*2 ); 
            let material = new THREE.LineBasicMaterial( {color: 0xffff00} );
            let box = new THREE.Line( geometry, material );
            box.position.y = 0;
            fenceModel.add(box);*/
        }       
    }

    #initWheels() {
        app.obj3d.main.getObjectByName('wheel').children.forEach( wheelModel => {           
            let position = new CANNON.Vec3(wheelModel.position.x, wheelModel.position.y, wheelModel.position.z);
            let wheelBody = new CANNON.Body({
                mass: 10,
                position,
                material: this.frictionMaterial2
            });	
            wheelBody.addShape( new CANNON.Box( new CANNON.Vec3(0.3, 0.1, 0.3) ), new CANNON.Vec3(0, 0, 0) );
            wheelBody.quaternion.setFromEuler( ...wheelModel.rotation.toArray() );           

            this.world.addBody(wheelBody);
            this.linkModelToBody(wheelModel, wheelBody);

            /*let geometry = new THREE.BoxGeometry( 0.325*2, 0.2, 0.325*2 ); 
            let material = new THREE.LineBasicMaterial( {color: 0xffff00} );
            let box = new THREE.Line( geometry, material );
            box.position.y = 0;
            wheelModel.add(box);*/
        });
    }

    #initBoxes() {
        app.obj3d.main.getObjectByName('Boxes').children.forEach( boxModel => {           
            let position = new CANNON.Vec3(boxModel.position.x, boxModel.position.y, boxModel.position.z);
            let boxBody = new CANNON.Body({
                mass: 15,
                position,
                material: this.frictionMaterial2
            });	
            boxBody.addShape( new CANNON.Box( new CANNON.Vec3(0.44, 0.34, 0.44) ), new CANNON.Vec3(0, 0, 0) );
            boxBody.quaternion.setFromEuler( ...boxModel.rotation.toArray() );

            this.world.addBody(boxBody);
            this.linkModelToBody(boxModel, boxBody);

            /*let geometry = new THREE.BoxGeometry( 0.325*2, 0.2, 0.325*2 ); 
            let material = new THREE.LineBasicMaterial( {color: 0xffff00} );
            let box = new THREE.Line( geometry, material );
            box.position.y = 0;
            wheelModel.add(box);*/
        });
    }

    linkModelToBody(model, body) {
        let link = new LinkModelToBody(model, body);
        this.#links.set(body, link);
    }

    deleteLink(body) {
        this.#links.get(body).stop();
        this.#links.delete(body);
    }

    #update = () => {
        this.world.step( this.#fixedTimeStep, this.#fps, this.#maxSubSteps );		
    }
}


class LinkModelToBody {
    model; 
    body;

    constructor(model, body) {
        this.model = model;
        this.body = body;
        app.update.add(this.#update);
    }

    #update = () => {
        this.model.position.copy( this.body.position );
        this.model.quaternion.set(
            this.body.quaternion.x,
            this.body.quaternion.y,
            this.body.quaternion.z,
            this.body.quaternion.w
        )

        if (this.model.position.y < -20) {
            app.update.delete(this.#update);
            app.cannon.world.removeBody(this.body);
            app.obj3d.world.remove(this.model);
            console.log( 'remove');
        }
    }

    stop() {
        app.update.delete(this.#update);
    }
}