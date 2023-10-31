class VerletBody {
    #oldX;
    #oldZ;

    debugModel;    

    drag;
    model;
    shape;
    isStatic;    
    isSensor;
    events;

    static EVENT_COLLIDE = 'collide';

    constructor( model, shape, drag=0.1, isStatic=false, isSensor=false ) {
        this.model = model;
        this.shape = shape;
        this.drag = drag;
        this.isStatic = isStatic;
        this.isSensor = isSensor;
       
        this.#oldX = model.position.x;
        this.#oldZ = model.position.z;

        this.events = new PIXI.utils.EventEmitter();
    }

    update() {
        if ( this.isStatic || this.isSensor ) return;
    
        let vx = this.model.position.x - this.#oldX;
        let vz = this.model.position.z - this.#oldZ;
    
        this.#oldX = this.model.position.x;
        this.#oldZ = this.model.position.z;
    
        this.model.position.x += vx * this.drag;
        this.model.position.z += vz * this.drag;
    }
}

class CircleShape {
    static id = 0;
    id = CircleShape.id;

    radius;
    radius2;

    constructor( radius ) {
        this.radius = radius;
        this.radius2 = radius * radius;
    }   
}

class RectangleShape {
    static id = 1;
    id = RectangleShape.id;

    radiusX;
    radiusZ;   
    rotation;
    
    constructor( width, heigth, rotation=0 ) {
        this.radiusX = width / 2;
        this.radiusZ = heigth / 2;
        this.rotation = rotation;
    }
}


class Ray {
    static id = 2;
    id = Ray.id;
    
    length;
    rotation;   
    thickness;

    constructor( length, rotation=0, thickness = 0 ) {        
        this.length = length;
        this.rotation = rotation;
        this.thickness = thickness;
    }
}

/*class Ray {
    static id = 2;
    id = Ray.id;

    #startPoint;
    #endPoint;
    delta = new THREE.Vector3();
    lengthSq = 0;

    constructor( startPoint, endPoint ) {
        this.#startPoint = startPoint;       
        this.#endPoint = endPoint;
        this.#calculate();
    }    

    get startPoint() {
        return this.#startPoint;
    }

    get endPoint() {
        return this.#endPoint;
    }
    
    set startPoint(value) {
        this.#startPoint = value;
        this.#calculate();
    }

    set endPoint(value) {
        this.#endPoint = value;
        this.#calculate();
    }

    #calculate() {
        this.delta.subVectors ( this.#endPoint, this.#startPoint );
        this.lengthSq = this.delta.lengthSq();
    }
}*/

class VerletPhysics {
    #isDebug = false;
    #debugColors = {
        static: 0xff0000,
        sensor: 0xffff00,
        dynamic: 0x0000ff,
    }

    bodies = [];

    constructor( {isDebug = false} ) {
        this.#isDebug = isDebug;
        app.update.add( this.#update );
    }

    addBody( body ) {
        this.bodies.push( body );

        this.#addDebugModel( body );
    }

    addModel( model, shape, isStatic=false, isSensor=false ) {
        let body = new VerletBody( model, shape );
        body.isStatic = isStatic;
        body.isSensor = isSensor;
        this.bodies.push( body );

        this.#addDebugModel( body );

        return body;
    }

    removeBody( body ) {        
        let index = this.bodies.indexOf( body );        
        if ( index != -1 ) {
           
            let body = this.bodies.splice( index, 1 )[0];
            if ( body.debugModel ) {
                app.obj3d.main.remove( body.debugModel );
            }
        }
    }

    getBodyByModel( model ) {
        for ( let body of this.bodies ) {
            if ( model == body.model ) return body;
        }

        return null;
    }

    #addDebugModel(body) {
        if ( !this.#isDebug ) return;

        if ( body.shape.id === CircleShape.id ) this.#addDebugCircle( body );
        if ( body.shape.id === RectangleShape.id ) this.#addDebugBox( body );
        if ( body.shape.id === Ray.id ) this.#addDebugRay( body );

        app.obj3d.main.add( body.debugModel );
    }

    #update = () => {        
        for (let i = 0; i < this.bodies.length; i++) {
            let body1 = this.bodies[i];

            for (let j = i+1; j < this.bodies.length; j++) {
                let body2 = this.bodies[j];

                if ( body1.isStatic && body2.isStatic ) continue;

                if ( body1.shape.id === CircleShape.id && body2.shape.id === CircleShape.id ) {
                    let isCollide = this.testCircleToCirlce( body1, body2 );
                    if ( isCollide ) this.#emitCollideEvents( body1, body2 );
                    continue;
                }

                if ( body1.shape.id === RectangleShape.id && body2.shape.id === RectangleShape.id ) {
                    let isCollide = this.testRectToRect( body1, body2 );                    
                    if ( isCollide ) this.#emitCollideEvents( body1, body2 );
                    continue;
                }

                if ( body1.shape.id === CircleShape.id && body2.shape.id === RectangleShape.id ) {
                    let isCollide;

                    if ( body2.shape.rotation == 0) isCollide = this.testCircleToRect( body1, body2 )
                    else isCollide = this.testCircleToRect2( body1, body2 );

                    if ( isCollide ) this.#emitCollideEvents( body1, body2 );
                    continue;
                }

                if ( body1.shape.id === RectangleShape.id && body2.shape.id === CircleShape.id ) {
                    let isCollide;

                    if ( body1.shape.rotation == 0) isCollide = this.testCircleToRect( body2, body1 )
                    else isCollide = this.testCircleToRect2( body2, body1 );
                
                    if ( isCollide ) this.#emitCollideEvents( body1, body2 );
                    continue;
                }

                if ( body1.shape.id === Ray.id && body2.shape.id === CircleShape.id ) {
                    let isCollide = this.testRayToCircle( body1, body2 );
                    if ( isCollide ) this.#emitCollideEvents( body1, body2 );
                    continue;
                }

                // if ( body2.shape.id === Ray.id && body1.shape.id === CircleShape.id ) {
                //     let isCollide = this.testRayToCircle( body2, body1 );
                //     if ( isCollide ) this.emitCollideEvents( body2, body1 );
                //     continue;
                // }
            }
        }

        for ( let body of this.bodies ) {
            body.update();
        }

        if ( this.#isDebug ) {
            for ( let body of this.bodies ) {
                body.debugModel.position.copy( body.model.position );
                if ( body.shape.id === Ray.id ) body.debugModel.rotation.y = body.model.rotation.y;
            }
        }
    }

    #emitCollideEvents( body1, body2 ) {
        body1.events.emit( VerletBody.EVENT_COLLIDE, body2 );
        body2.events.emit( VerletBody.EVENT_COLLIDE, body1 );
    }

    testRayToCircle( body1, body2 ) {
        let distanceX = body2.model.position.x - body1.model.position.x;
        let distanceZ = body2.model.position.z - body1.model.position.z;
        let distanceSq = distanceX**2 + distanceZ**2;
        let distance = Math.sqrt( distanceSq );

        let rayX = body1.shape.length * Math.cos( 2*Math.PI - body1.model.rotation.y + body1.shape.rotation );
        let rayZ = body1.shape.length * Math.sin( 2*Math.PI - body1.model.rotation.y + body1.shape.rotation );

        let crossProduct = rayX * distanceZ - rayZ * distanceX;
        let height = Math.abs( crossProduct / body1.shape.length );

        let dotProduct = rayX * distanceX + rayZ * distanceZ;

        let isCollide = height <= body2.shape.radius + body1.shape.thickness && dotProduct > 0 && distance < body1.shape.length + body2.shape.radius;

        if ( this.#isDebug ) {
            if ( isCollide ) {
                if ( !body2.isSensor ) body2.debugModel.material.color.setHex( 0x00ff00 );
            } else {
                if ( !body2.isSensor ) body2.debugModel.material.color.setHex( 0x0000ff );
            }
        }        

        return isCollide;
    }

    testCircleToCirlce( body1, body2 ) {
        let distanceX = body1.model.position.x - body2.model.position.x;
        let distanceZ = body1.model.position.z - body2.model.position.z;        

        let distance = Math.sqrt( distanceX**2 + distanceZ**2 );
        let delta = ( body1.shape.radius + body2.shape.radius ) - distance;

        if ( delta <= 0 ) return false;        
        
        if ( body1.isSensor || body2.isSensor ) return true;        
        
        let deltaX = delta * ( distanceX / distance );
        let deltaZ = delta * ( distanceZ / distance );

        let halfDeltaX = deltaX * 0.5;
        let halfDeltaZ = deltaZ * 0.5;

        body1.model.position.x += body1.isStatic ? 0 : ( body2.isStatic ? deltaX : halfDeltaX );
        body2.model.position.x -= body2.isStatic ? 0 : ( body1.isStatic ? deltaX : halfDeltaX );

        body1.model.position.z += body1.isStatic ? 0 : ( body2.isStatic ? deltaZ : halfDeltaZ );
        body2.model.position.z -= body2.isStatic ? 0 : ( body1.isStatic ? deltaZ : halfDeltaZ );            
        
        return true;
    }

    testRectToRect( body1, body2 ) {
        let distanceX = body1.model.position.x - body2.model.position.x;
        let distanceZ = body1.model.position.z - body2.model.position.z;

        let deltaX = ( body1.shape.radiusX + body2.shape.radiusX ) - Math.abs( distanceX );

        if ( deltaX <= 0 ) return false; 

        let deltaZ = ( body1.shape.radiusZ + body2.shape.radiusZ ) - Math.abs( distanceZ );

        if ( deltaZ <= 0 ) return false;
       
        if ( body1.isSensor || body2.isSensor ) return true;

        if ( deltaX < deltaZ ) {
            let nx = distanceX > 0 ? 1 : -1;
            deltaX *= nx;
            let halfDeltaX = deltaX * 0.5;
            body1.model.position.x += body1.isStatic ? 0 : ( body2.isStatic ? deltaX : halfDeltaX );
            body2.model.position.x -= body2.isStatic ? 0 : ( body1.isStatic ? deltaX : halfDeltaX );
        } else {
            let nz = distanceZ > 0 ? 1 : -1;
            deltaZ *= nz;    
            let halfDeltaZ = deltaZ * 0.5;                     
            body1.model.position.z += body1.isStatic ? 0 : ( body2.isStatic ? deltaZ : halfDeltaZ );
            body2.model.position.z -= body2.isStatic ? 0 : ( body1.isStatic ? deltaZ : halfDeltaZ );
        }
        
        return true;
    }

    testCircleToRect( body1, body2 ) {
        let distanceX = body1.model.position.x - body2.model.position.x;
        let distanceZ = body1.model.position.z - body2.model.position.z;

        let absDistanceX = Math.abs( distanceX );
        let absDistanceZ = Math.abs( distanceZ );

        let deltaX = ( body1.shape.radius + body2.shape.radiusX ) - absDistanceX;

        if ( deltaX <= 0 ) return false; 

        let deltaZ = ( body1.shape.radius + body2.shape.radiusZ ) - absDistanceZ;

        if ( deltaZ <= 0 ) return false;
        
        if ( body1.isSensor || body2.isSensor ) return true;
        
        if ( absDistanceX < body2.shape.radiusX || absDistanceZ < body2.shape.radiusZ ) {
            if ( deltaX < deltaZ ) {
                let nx = distanceX > 0 ? 1 : -1;
                deltaX *= nx;
                let halfDeltaX = deltaX * 0.5;
                body1.model.position.x += body1.isStatic ? 0 : ( body2.isStatic ? deltaX : halfDeltaX );
                body2.model.position.x -= body2.isStatic ? 0 : ( body1.isStatic ? deltaX : halfDeltaX );
            } else {
                let nz = distanceZ > 0 ? 1 : -1;
                deltaZ *= nz;    
                let halfDeltaZ = deltaZ * 0.5;                     
                body1.model.position.z += body1.isStatic ? 0 : ( body2.isStatic ? deltaZ : halfDeltaZ );
                body2.model.position.z -= body2.isStatic ? 0 : ( body1.isStatic ? deltaZ : halfDeltaZ );
            }

            return true;
        }

        distanceX = absDistanceX - body2.shape.radiusX;
        distanceZ = absDistanceZ - body2.shape.radiusZ;

        let distance2 = distanceX * distanceX + distanceZ * distanceZ;
        let delta2 = distance2 - body1.shape.radius2;

        if (delta2 < 0) {
            let distance = Math.sqrt( distance2 );
            let delta = distance - body1.shape.radius;

            let deltaX = distanceX / distance * delta;
            let deltaZ = distanceZ / distance * delta;

            if (body1.model.position.x > body2.model.position.x) deltaX = -deltaX;
            if (body1.model.position.z > body2.model.position.z) deltaZ = -deltaZ;

            let halfDeltaX = deltaX * 0.5;
            body1.model.position.x += body1.isStatic ? 0 : ( body2.isStatic ? deltaX : halfDeltaX );
            body2.model.position.x -= body2.isStatic ? 0 : ( body1.isStatic ? deltaX : halfDeltaX );

            let halfDeltaZ = deltaZ * 0.5;                     
            body1.model.position.z += body1.isStatic ? 0 : ( body2.isStatic ? deltaZ : halfDeltaZ );
            body2.model.position.z -= body2.isStatic ? 0 : ( body1.isStatic ? deltaZ : halfDeltaZ );
            
            return true;
        }  
        
        return false;
    }

    testCircleToRect2( body1, body2 ) {
        let dx = body1.model.position.x - body2.model.position.x;
        let dz = body1.model.position.z - body2.model.position.z;        

        let cos = Math.cos( 2*Math.PI - body2.shape.rotation );
        let sin = Math.sin( 2*Math.PI - body2.shape.rotation );

        let distanceX = dx * cos + dz * sin;
        let distanceZ = dx * sin - dz * cos;

        let absDistanceX = Math.abs( distanceX );
        let absDistanceZ = Math.abs( distanceZ );

        let deltaX = ( body1.shape.radius + body2.shape.radiusX ) - absDistanceX;

        if ( deltaX <= 0 ) return false; 

        let deltaZ = ( body1.shape.radius + body2.shape.radiusZ ) - absDistanceZ;

        if ( deltaZ <= 0 ) return false;       
        
        if ( body1.isSensor || body2.isSensor ) return true;        
        
        if ( absDistanceX < body2.shape.radiusX || absDistanceZ < body2.shape.radiusZ ) {
            if ( deltaX < deltaZ ) {
                let nx = distanceX > 0 ? 1 : -1;
                deltaX *= nx;                

                let dx = deltaX * cos;
                let dz = deltaX * sin;

                let halfDX = dx / 2;
                let halfDZ = dz / 2;

                body1.model.position.x += body1.isStatic ? 0 : ( body2.isStatic ? dx : halfDX );
                body2.model.position.x -= body2.isStatic ? 0 : ( body1.isStatic ? dx : halfDX );

                body1.model.position.z += body1.isStatic ? 0 : ( body2.isStatic ? dz : halfDZ );
                body2.model.position.z -= body2.isStatic ? 0 : ( body1.isStatic ? dz : halfDZ );
            } else {               
                let nz = distanceZ > 0 ? 1 : -1; 
                deltaZ *= nz;

                let dx = deltaZ * sin;
                let dz = -deltaZ * cos;

                let halfDX = dx / 2;
                let halfDZ = dz / 2;              

                body1.model.position.x += body1.isStatic ? 0 : ( body2.isStatic ? dx : halfDX );
                body2.model.position.x -= body2.isStatic ? 0 : ( body1.isStatic ? dx : halfDX );

                body1.model.position.z += body1.isStatic ? 0 : ( body2.isStatic ? dz : halfDZ );
                body2.model.position.z -= body2.isStatic ? 0 : ( body1.isStatic ? dz : halfDZ );
            }

            return true;
        }       

        distanceX = absDistanceX - body2.shape.radiusX;
        distanceZ = absDistanceZ - body2.shape.radiusZ;

        let distance2 = distanceX * distanceX + distanceZ * distanceZ;
        let delta2 = distance2 - body1.shape.radius2;

        if (delta2 < 0) {
            let distance = Math.sqrt( distance2 );
            let delta = distance - body1.shape.radius;

            let deltaX = distanceX / distance * delta;
            let deltaZ = distanceZ / distance * delta;

            if (body1.model.position.x > body2.model.position.x) deltaX = -deltaX;
            if (body1.model.position.z > body2.model.position.z) deltaZ = -deltaZ;

            let halfDeltaX = deltaX * 0.5;
            body1.model.position.x += body1.isStatic ? 0 : ( body2.isStatic ? deltaX : halfDeltaX );
            body2.model.position.x -= body2.isStatic ? 0 : ( body1.isStatic ? deltaX : halfDeltaX );

            let halfDeltaZ = deltaZ * 0.5;                     
            body1.model.position.z += body1.isStatic ? 0 : ( body2.isStatic ? deltaZ : halfDeltaZ );
            body2.model.position.z -= body2.isStatic ? 0 : ( body1.isStatic ? deltaZ : halfDeltaZ );
            
            return true;
        }  
        
        return false;
    }    

    #addDebugCircle( body ) {
        let bounds = new THREE.Box3().setFromObject( body.model );
        let height = Math.max(1, bounds.max.y);

        let debugColor = this.#debugColors['dynamic'];
        if ( body.isStatic ) debugColor = this.#debugColors['static'];
        if ( body.isSensor ) debugColor = this.#debugColors['sensor'];        

        let geometry = new THREE.CylinderGeometry( body.shape.radius, body.shape.radius, height, 16);
        geometry.translate(0, height / 2, 0);
        let material = new THREE.MeshBasicMaterial({ color: debugColor, wireframe:true });
        body.debugModel = new THREE.Mesh(geometry, material);     
        body.debugModel.position.copy( body.model.position );   
    }

    #addDebugBox( body ) {
        let bounds = new THREE.Box3().setFromObject( body.model );    
        let height = Math.max(1, bounds.max.y);   

        let debugColor = this.#debugColors['dynamic'];
        if ( body.isStatic ) debugColor = this.#debugColors['static'];
        if ( body.isSensor ) debugColor = this.#debugColors['sensor'];

        let geometry = new THREE.BoxGeometry( body.shape.radiusX * 2, height, body.shape.radiusZ * 2);
        geometry.translate(0, height / 2, 0);        
        let material = new THREE.MeshBasicMaterial({ color: debugColor, wireframe:true });        
        body.debugModel = new THREE.Mesh( geometry, material );        
        body.debugModel.rotation.y = body.shape.rotation;
        body.debugModel.position.copy( body.model.position );
    }

    #addDebugRay( body ) {
        let material = new THREE.LineBasicMaterial({
            color: this.#debugColors.sensor,
            linewidth: 4
        });

        let points = [];
        points.push( new THREE.Vector3( 0, 1, 0 ) );
        points.push( new THREE.Vector3( body.shape.length * Math.cos(body.shape.rotation), 1, body.shape.length * Math.sin(body.shape.rotation) ) );       

        let geometry = new THREE.BufferGeometry().setFromPoints( points );
        body.debugModel = new THREE.Line( geometry, material );
        body.debugModel.rotation.y = body.shape.rotation;
    }
}
