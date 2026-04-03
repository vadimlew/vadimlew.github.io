function initVerletPhys() {
    let bodies = [];
    let joints = [];
    let restricts = [];

    app.phys = {
        add: addVerletPhys,
        update: updateVerletPhys,
        joint,
        restrict
    }

    //app.update.push(updateVerletPhys);

    function updateVerletPhys() {    
        for (let i=0; i < 5; i++) {
            joints.forEach(joint => {
                let obj1 = joint.obj1;
                let obj2 = joint.obj2;

                let dx = obj1.position.x - obj2.position.x;
                let dy = obj1.position.y - obj2.position.y;
                let dz = obj1.position.z - obj2.position.z;
                let dd = Math.sqrt(dx*dx + dy*dy + dz*dz);
                let diff = dd - joint.length;

                if ( Math.abs(diff) > 0.01 ) {
                    //let ratio;
                    let nx = dd == 0? 0 : dx/dd;
                    let ny = dd == 0? 0 : dy/dd;
                    let nz = dd == 0? 0 : dz/dd;

                    /*let sumMass = obj1.phys.mass + obj2.phys.mass;
                    if (sumMass == 0) {
                        ratio = 0.5;
                    } else {
                        ratio = obj1.phys.isStatic? 1 : obj1.phys.mass / sumMass;
                    }

                    let diff1 = diff * (1 - ratio);
                    let diff2 = diff * ratio;
                    
                    obj1.position.x -= cos * diff1;
                    obj1.position.z -= sin * diff1;*/

                    obj2.position.x += nx * diff;
                    obj2.position.y += ny * diff;
                    obj2.position.z += nz * diff;

                    obj2.rotation.y = Math.atan2(dx, dz);                    
                }
            });
        }    
        
        restricts.forEach(restrict => {
            bodies.forEach(body => {
                if (body.phys.isStatic) return;

                if (restrict.type == 'radius' && body.phys.shape == 'circle') {
                    let dd = Math.sqrt(body.position.x**2 + body.position.z**2) + body.phys.radius;
                    let diff = restrict.radius - dd;
                    if (diff < 0) {
                        let nx = body.position.x / dd;
                        let nz = body.position.z / dd;
                        body.position.x += diff * nx;
                        body.position.z += diff * nz;    
                        body.phys.onContact(restrict);                    
                    }
                }                
            })
        });

        for (let i=0; i < bodies.length; i++) {
            for (let j=i+1; j < bodies.length; j++) {
                let body1 = bodies[i];
                let body2 = bodies[j];
    
                if (body1.phys.shape == 'circle' && body2.phys.shape == 'circle') circleToCircle(body1, body2);
                if (body1.phys.shape == 'circle' && body2.phys.shape == 'aabb') circleToAABB(body1, body2);
                if (body1.phys.shape == 'aabb' && body2.phys.shape == 'circle') circleToAABB(body2, body1);                
            }            
        }	
    
        for (let body of bodies) body.phys.update();
    }

    function addVerletPhys(obj, props) {
        obj.phys = Object.assign({
            isStatic: false,
            isSensor: false,
            radius: 0,
            aabb: [0, 0],
            shape: 'circle',
            isFollow: false,
            oldPos: {
                x: obj.position.x, 
                z: obj.position.z
            },
            mass: 1,
            drag: 0.65,
            update: function() {
                if (this.isStatic || this.isSensor) return; 
    
                let vx = obj.position.x - this.oldPos.x;
                let vz = obj.position.z - this.oldPos.z;
                
                this.oldPos.x = obj.position.x;
                this.oldPos.z = obj.position.z;	
    
                obj.position.x += vx * this.drag;
                obj.position.z += vz * this.drag;

                if (this.isFollow) {
                    //obj.rotation.y = Math.atan2(vx, vz);
                    obj.toAngle = Math.atan2(vx, vz);
                }
            },
            contact: function(obj2, dx, dz) {
                this.onContact(obj2, dx, dz);

                if (this.isStatic || this.isSensor) return;               

                if(obj2.phys.isSensor) return;
                
                let ratio;
                let sumMass = obj2.phys.mass + this.mass;
                if (sumMass == 0) {
                    ratio = 0.5;
                } else {
                    ratio = obj2.phys.isStatic? 1 : obj2.phys.mass / sumMass;
                }
                
                obj.position.x += dx * ratio;
                obj.position.z += dz * ratio;                
            },
            resetVelocity: function() {
                this.oldPos.x = obj.position.x;
                this.oldPos.z = obj.position.z;
            },
            destroy: function() {
                let id = bodies.indexOf(obj);
                bodies.splice(id, 1);                
            },
            onContact: function(){}
        }, props);
    
        bodies.push(obj);

        if (props.debug) {
            if (obj.phys.shape == 'circle') addDebugCircle(obj,  obj.phys.radius);
            if (obj.phys.shape == 'aabb') addDebugBox(obj,  obj.phys.aabb);
        }
    }

    function joint(obj1, obj2, length) {
        joints.push({obj1, obj2, length});
    }

    function restrict({type = 'radius', radius = 10, name="restrict"}={}) {
        restricts.push({type, radius, name});
    }

    function addDebugCircle(obj, radius) {
        let geometry = new THREE.CylinderGeometry(radius, radius, radius, 16);
        let material = new THREE.MeshBasicMaterial({color: 0x0011ff,transparent:true, opacity: 0.5});
        let cylinder = new THREE.Mesh(geometry, material);
        obj.add(cylinder);
    }

    function addDebugBox(obj, aabb) {
        let geometry = new THREE.BoxGeometry(aabb[0]*2, 1, aabb[1]*2);
        let material = new THREE.MeshBasicMaterial({color: 0x0011ff, transparent:true, opacity: 0.5});
        let box = new THREE.Mesh(geometry, material);
        function update() {
            box.rotation.y = -obj.rotation.y;
        }
        app.update.push(update);
        obj.add(box);
    }

    function circleToCircle(body1, body2) {
        let dx = body1.position.x - body2.position.x;
        let dz = body1.position.z - body2.position.z;
        let dd = Math.sqrt(dx*dx + dz*dz);
        let diff = dd - (body1.phys.radius + body2.phys.radius);
    
        if (diff < 0) {
            let cos = dd == 0? 0 : dx/dd;
            let sin = dd == 0? 0 : dz/dd;
            dx = 0.5*diff*cos;
            dz = 0.5*diff*sin;
            body1.phys.contact(body2, -dx, -dz);
            body2.phys.contact(body1, dx, dz);
        }			
    }

    function circleToAABB(body1, body2) {
        let dx = body1.position.x - body2.position.x;
        let dz = body1.position.z - body2.position.z;

        if (Math.abs(dx) < body2.phys.aabb[0]) {
            let diffZ = Math.abs(dz) - (body1.phys.radius + body2.phys.aabb[1]);
            if (diffZ < 0) {                
                body1.phys.contact(body2, 0, dz > 0? -diffZ : diffZ);
                body2.phys.contact(body1, 0, dz > 0? diffZ : -diffZ);
            }
        } else if (Math.abs(dz) < body2.phys.aabb[1]) {
            let diffX = Math.abs(dx) - (body1.phys.radius + body2.phys.aabb[0]);
            if (diffX < 0) {                
                body1.phys.contact(body2, dx > 0? -diffX : diffX, 0);
                body2.phys.contact(body1, dx > 0? diffX : -diffX, 0);
            }
        } else {            
            dx = Math.abs(dx) - body2.phys.aabb[0];
            dz = Math.abs(dz) - body2.phys.aabb[1];
            let dd = Math.sqrt(dx*dx + dz*dz);      
            let diff = dd - body1.phys.radius;
            if (diff < 0) {
                let nx = dd == 0? 0 : dx/dd * diff;
                let nz = dd == 0? 0 : dz/dd * diff;
                if (body1.position.x > body2.position.x) nx = -nx;
                if (body1.position.z > body2.position.z) nz = -nz;                
                body1.phys.contact(body2, nx, nz);
                body2.phys.contact(body1, nx, nz);
            }
        }        
    }
}