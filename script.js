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
