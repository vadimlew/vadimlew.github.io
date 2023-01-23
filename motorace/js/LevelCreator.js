let ground = new PIXI.Graphics();

let points = [0,0,50,0,100,0,150,0,175,-17,250,0,300,0,333,-22,400,0,452,-1,514,-22,650,74,673,74,733,46,770,32,795,24,824,13,850,0,881,-16,897,10,981,-4,992,17,1001,4,1085,61,1200,0,1274,-62,1289,0,1319,-1,1457,73,1480,50,1503,50,1552,64,1620,2,1654,21,1719,-38,1765,-12,1838,-79,1908,-80,1974,-63,2009,-43,2033,-17,2050,0,2093,21,2150,0,2180,0,2233,33,2266,11,2299,33,2330,12,2358,34,2386,12,2416,34,2445,10,2476,30,2504,9,2571,9,2582,68,2594,12,2688,-27,2735,3,2781,-11,2799,-28,2815,25,2881,67,3006,-55,3081,-39,3148,-60,3177,-27,3201,-1,3234,0,3284,0,3334,0,3384,0,3446,-45,3501,1,3573,-24,3582,0,3629,-25,3669,-25,3682,13,3690,-17,3731,-15,3743,13,3932,0,3982,0,4032,0,4077,-127];

function drawTestLevel() {
    /***for (let i=0; i<20; i++) {
        let x = i*50;
        let y = 0;
        points.push(x, y);
    }*/
    
    ground.position.set(250, 600);
    ground.lineStyle(1, 0x555555);    

    ground.moveTo(points[0], points[1]);
    createDragCircle(points[0], points[1], 0, ()=>calculateLevel());    

    for (let i=2; i < points.length; i+=2) {
        let x = points[i];
        let y = points[i+1];        
        createDragCircle(x, y, i, ()=>calculateLevel());       
    }    

    calculateLevel();    
    addDrag(ground);
    ground.scale.set(5);
    main.pixi.stage.addChild(ground);

    createButtons();
}


function createButtons() {
    let addBtn = new PIXI.Graphics();
    addBtn.beginFill(0x00aaaa, 0.5);
    addBtn.drawRoundedRect(0, 0, 100, 50, 20);
    addBtn.position.set(50, 50);

    addBtn.interactive = true;
    addBtn.on('pointerdown', ()=>{
        let lastX = points[points.length-2];
        points.push(lastX + 50, 0);
        calculateLevel();
        createDragCircle(lastX + 50, 0, points.length-2, ()=>calculateLevel());
        ground.hitArea.width += 50;

        ground.bounds.clear();
        ground.bounds.beginFill(0xffffff, 0.05);
        ground.bounds.drawRect(ground.hitArea.x, ground.hitArea.y, ground.hitArea.width, ground.hitArea.height);
    });

    main.pixi.stage.addChild(addBtn);

    let generateBtn = new PIXI.Graphics();
    generateBtn.beginFill(0x00aa00, 0.5);
    generateBtn.drawRoundedRect(0, 0, 100, 50, 20);
    generateBtn.position.set(50, 120);

    generateBtn.interactive = true;
    generateBtn.on('pointerdown', ()=>{        
        console.log(points);
        navigator.clipboard.writeText(points);
    });

    main.pixi.stage.addChild(generateBtn);
}


function calculateLevel() {
    ground.clear();
    ground.lineStyle(1, 0x999900);

    for (let i=0; i < points.length; i+=2) {
        let x1 = points[i];
        let y1 = points[i+1];

        let x2 = points[i+2];
        let y2 = points[i+3];

        let dx = x2 - x1;
        let dy = y2 - y1;
        let dd = Math.sqrt(dx*dx + dy*dy);

        let p1x = x1 + dx * 0.3;
        let p1y = y1;

        let p2x = x1 + dx * 0.6;
        let p2y = y2;

        let num = Math.ceil(dd / 5);

        for (let j=0; j<num; j++) {
            let t1 = j/num;
            let t2 = (j+1)/num;

            let bx1 = Utility.bezier3(t1, x1, p1x, p2x, x2);
            let by1 = Utility.bezier3(t1, y1, p1y, p2y, y2);

            let bx2 = Utility.bezier3(t2, x1, p1x, p2x, x2);
            let by2 = Utility.bezier3(t2, y1, p1y, p2y, y2);

            let by = Math.max(by1, by2);

            ground.moveTo(bx1, by1);
            ground.lineTo(bx2, by2);
            ground.lineTo(bx2, by + 10);
            ground.lineTo(bx1, by + 10);
            ground.lineTo(bx1, by1);
            
            let dbx = bx2 - bx1;
            let dby = by2 - by1;                
        }
    }   
}


function drawCurve() {
    ground.clear();
    ground.lineStyle(1, 0x009999);
    for (let i=0; i < points.length; i+=2) {
        let x1 = points[i];
        let y1 = points[i+1];

        let x2 = points[i+2];
        let y2 = points[i+3];

        let dx = x2 - x1;

        let p1x = x1 + dx * 0.3;
        let p1y = y1;

        let p2x = x1 + dx * 0.6;
        let p2y = y2;

        ground.moveTo(x1, y1);
        ground.bezierCurveTo(p1x, p1y, p2x, p2y, x2, y2);
    }
}


function createDragCircle(x, y, id, onDrag) {
    let isMouseDown = false;
    let mouse = new PIXI.Point();

    let circle = new PIXI.Graphics();
    circle.position.set(x, y);
    circle.lineStyle(2, 0x555555); 
    circle.drawCircle(0, 0, 2);

    circle.interactive = true;
    circle.hitArea = new PIXI.Rectangle(-5,-5,10,10);
    circle.on('pointerdown', pointerDownHandler);
    circle.on('pointerup', pointerUpHandler);
    main.pixi.stage.on('pointermove', pointerMoveHandler);
    circle.on('pointerover', pointerOverHandler);
    circle.on('pointerout', pointerOutHandler);

    function pointerDownHandler(e) {          
        mouse.x = e.x;
        mouse.y = e.y;
        isMouseDown = true;  
        e.stopImmediatePropagation();
    }

    function pointerUpHandler() {        
        isMouseDown = false;
    }

    function pointerMoveHandler(e) {
        if (isMouseDown) {
            circle.x += (e.x - mouse.x) / circle.parent.scale.x;  
            circle.y += (e.y - mouse.y) / circle.parent.scale.y;  
            mouse.x = e.x;
            mouse.y = e.y;

            points[id] = Math.round(circle.x);
            points[id+1] = Math.round(circle.y);

            onDrag();
        }        
    }

    function pointerOverHandler(e) {     
        circle.clear();  
        circle.lineStyle(2, 0x00ee00); 
        circle.drawCircle(0, 0, 2);
    }

    function pointerOutHandler(e) {   
        circle.clear();  
        circle.lineStyle(2, 0x555555); 
        circle.drawCircle(0, 0, 2);
        //isMouseDown = false;
    }

    ground.addChild(circle);
}


function addDrag(sprite) {
    let isMouseDown = false;
    let mouse = new PIXI.Point();

    sprite.interactive = true;
    sprite.hitArea = sprite.getBounds();   
    sprite.hitArea.x -= sprite.x;
    sprite.hitArea.y -= sprite.y + 100;
    sprite.hitArea.height += 200;

    let bounds = new PIXI.Graphics();
    sprite.bounds = bounds;
    bounds.beginFill(0xffffff, 0.05);
    bounds.drawRect(sprite.hitArea.x, sprite.hitArea.y, sprite.hitArea.width, sprite.hitArea.height);
    sprite.addChildAt(bounds, 0);
   
    sprite.on('pointerdown', pointerDownHandler);
    sprite.on('pointerup', pointerUpHandler);
    sprite.on('pointermove', pointerMoveHandler);
    sprite.on('wheel', wheelHandler);

    function pointerDownHandler(e) {       
        mouse.x = sprite.x - e.client.x;        
        isMouseDown = true;        
    }

    function pointerUpHandler() {        
        isMouseDown = false;
    }

    function pointerMoveHandler(e) {
        if (isMouseDown) {
            sprite.x = e.client.x + mouse.x;            
        }        
    }

    function wheelHandler(e) {        
        if (e.deltaY < 0 && sprite.scale.x < 20) {           
            let w = sprite.width;
            let ratio = (e.x - sprite.x) / sprite.width;

            sprite.scale.x *= 1.25;
            sprite.scale.y *= 1.25;

            let dx = sprite.width - w;
            sprite.x -= dx * ratio;            
        }

        if (e.deltaY > 0 && sprite.scale.x > 0.5) {           
            let w = sprite.width;
            let ratio = (e.x - sprite.x) / sprite.width;

            sprite.scale.x *= 0.75;
            sprite.scale.y *= 0.75;

            let dx = sprite.width - w;
            sprite.x -= dx * ratio;
        }        
    }
}


/*
function calculateLevel(ground, points) {
    ground.lineStyle(1, 0x999900);
    for (let i=0; i < points.length; i+=2) {
        let x1 = points[i];
        let y1 = points[i+1];

        let x2 = points[i+2];
        let y2 = points[i+3];

        let dx = x2 - x1;

        let p1x = x1 + dx * 0.3;
        let p1y = y1;

        let p2x = x1 + dx * 0.6;
        let p2y = y2;

        let d = 3;
        let len = d/2;
        let px = x1;
        let py = y1;

        for (let j=0; j<=200; j++) {
            let t = j/200;
            let x = Utility.bezier3(t, x1, p1x, p2x, x2);
            let y = Utility.bezier3(t, y1, p1y, p2y, y2);                   
            
            let dx = x - px;
            let dy = y - py;   
            let rot = Math.atan2(dy, dx);
            px = x;
            py = y;  
            len += Math.sqrt(dx*dx + dy*dy);

            ground.lineTo(x, y);

            if (len > d) {
                let rect = new PIXI.Graphics();
                rect.lineStyle(1, 0xaa0000);
                rect.drawRect(-d/2, -1, d, 2);
                rect.rotation = rot;
                rect.x = x;
                rect.y = y;
                ground.addChild(rect);                
                len -= d;
            }  
            
            if (t == 1) {
                let rect = new PIXI.Graphics();
                rect.lineStyle(1, 0xaa0000);
                rect.drawRect(-d/2, -1, d, 2);
                rect.rotation = rot;
                rect.x = x;
                rect.y = y;
                ground.addChild(rect);                
            }
        }
    }   
}
*/