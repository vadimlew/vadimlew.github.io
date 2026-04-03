class Player {
    anim;
    model;
    muzzle;
    lifeBar;

    name = 'hero';
    life = 100;
	damage = 2;
	speed = 0;
	toSpeed = 0;

    constructor(model) {
        this.model = model;   
        this.muzzle = hero.getObjectByName('Bullet');
	    this.lifeBar = hero.getObjectByName('LifeBar');    
        this.#initMaterials();

        model.rotation.y = Math.PI/2;
    }

    #initMaterials() {
        this.model.traverse((obj) => {		
            obj.castShadow = true;
            obj.receiveShadow = true;
    
            obj.material = app.materials.hero;
    
            if (obj.name === 'Head') {			
                obj.material = app.materials.glass;
            }
        });
    }
}