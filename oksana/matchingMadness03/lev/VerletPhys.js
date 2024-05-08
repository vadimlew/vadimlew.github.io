function initVerletPhys() {
    let bodies = [];

    app.phys = {
        add: addVerletPhys        
    }

    app.update.push(updateVerletPhys);

    function updateVerletPhys() {        
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
            },
            contact: function(obj2, dx, dz) {
                this.onContact(obj2);

                if (this.isStatic || this.isSensor) return;
                if(obj2.phys.isSensor) return;
    
                let ratio = obj2.phys.isStatic? 1 : obj2.phys.mass / (obj2.phys.mass + this.mass);
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

    function addDebugCircle(obj, radius) {
        let geometry = new THREE.CylinderGeometry(radius, radius, 1, 16);
        let material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe:true});
        let cylinder = new THREE.Mesh(geometry, material);
        obj.add(cylinder);
    }

    function addDebugBox(obj, aabb) {
        let geometry = new THREE.BoxGeometry(aabb[0]*2, 1, aabb[1]*2);
        let material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe:true});        
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
            let cos = dx/dd;
            let sin = dz/dd;
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
                let nx = dx/dd * diff;
                let nz = dz/dd * diff;
                if (body1.position.x > body2.position.x) nx = -nx;
                if (body1.position.z > body2.position.z) nz = -nz;                
                body1.phys.contact(body2, nx, nz);
                body2.phys.contact(body1, nx, nz);
            }
        }        
    }
}