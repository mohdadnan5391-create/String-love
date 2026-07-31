const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const dpr = window.devicePixelRatio || 1;

function resize() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

resize();
window.addEventListener("resize", resize);

const TEXT = "I Love You Arfa babu ";

const CONFIG = {
    cols: 42,
    rows: 22,
    spacing: 18,
    gravity: 0.18,
    damping: 0.99,
    iterations: 6,
    mouseRadius: 80
};

const particles = [];
const constraints = [];

class Vec2{
    constructor(x,y){
        this.x=x;
        this.y=y;
    }

    copy(){
        return new Vec2(this.x,this.y);
    }
}

class Particle{

    constructor(x,y,char,pinned=false){

        this.x=x;
        this.y=y;

        this.oldx=x;
        this.oldy=y;

        this.char=char;
        this.pinned=pinned;
    }

    update(){

        if(this.p
           class Constraint {

    constructor(a,b,length){
        this.a=a;
        this.b=b;
        this.length=length;
    }

    solve(){

        let dx=this.b.x-this.a.x;
        let dy=this.b.y-this.a.y;

        let dist=Math.sqrt(dx*dx+dy*dy);

        if(dist===0) return;

        let diff=(dist-this.length)/dist;

        let ox=dx*0.5*diff;
        let oy=dy*0.5*diff;

        if(!this.a.pinned){
            this.a.x+=ox;
            this.a.y+=oy;
        }

        if(!this.b.pinned){
            this.b.x-=ox;
            this.b.y-=oy;
        }

    }

}

function createCloth(){

    const startX=(window.innerWidth-(CONFIG.cols-1)*CONFIG.spacing)/2;
    const startY=80;

    let index=0;

    for(let y=0;y<CONFIG.rows;y++){

        for(let x=0;x<CONFIG.cols;x++){

            const ch=TEXT[index%TEXT.length];

            const p=new Particle(
                startX+x*CONFIG.spacing,
                startY+y*CONFIG.spacing,
                ch,
                y===0
            );

            particles.push(p);

            index++;

        }

    }

    for(let y=0;y<CONFIG.rows;y++){

        for(let x=0;x<CONFIG.cols;x++){

            const id=y*CONFIG.cols+x;

            if(x<CONFIG.cols-1){

                constraints.push(
                    new Constraint(
                        particles[id],
                        particles[id+1],
                        CONFIG.spacing
                    )
                );

            }

            if(y<CONFIG.rows-1){

                constraints.push(
                    new Constraint(
                        particles[id],
                        particles[id+CONFIG.cols],
                        CONFIG.spacing
                    )
                );

            }

        }

    }

}

createCloth();
        function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "bold 18px monospace";
    ctx.fillStyle = "#fc0843";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (const p of particles) {
        ctx.fillText(p.char, p.x, p.y);
    }
}

function animate() {

    requestAnimationFrame(animate);

    for (const p of particles) {
        p.update();
    }

    for (let i = 0; i < CONFIG.iterations; i++) {
        for (const c of constraints) {
            c.solve();
        }
    }

    draw();
}

let dragging = null;

canvas.addEventListener("pointerdown", e => {

    let best = null;
    let bestDist = 25;

    for (const p of particles) {

        const dx = p.x - e.clientX;
        const dy = p.y - e.clientY;
        const d = Math.sqrt(dx * dx + dy * dy);

        if (d < bestDist) {
            best = p;
            bestDist = d;
        }
    }

    dragging = best;
});

canvas.addEventListener("pointermove", e => {

    if (!dragging) return;

    dragging.x = e.clientX;
    dragging.y = e.clientY;
});

window.addEventListener("pointerup", () => {
