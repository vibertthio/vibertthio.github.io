import { Vector } from 'p5';
/**
 * [sketch description]
 * @param  {[type]} p [description]
 */
export default function sketch(p) {
  let rotation = 0;
  let width = screen.width;
  let height = screen.height;

  const scl = 15;
  const nOfP = 1024;
  let cols;
  let rows;

  const particles = [];
  const flowField = [];
  const magOfForce = 0.5;
  const maxNOfP = 2048;

  const inc_x = 0.09;
  const inc_y = 0.09;
  const inc_z = 0.01;
  const angleVar = 2;
  let zoff = 0;


  const PI = p.PI;


  let r;
  let g;
  let b;


  p.setup = () => {
    const canvas = p.createCanvas(width, height);
    canvas.class('p5-canvas');
    cols = p.floor(width / scl);
    rows = p.floor(height / scl);
    p.background(0);
    for (let i = 0; i < nOfP; i += 1) {
      particles[i] = new Particle();
    }
  };

  p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    width = props.width;
    height = props.height;
    if (p._setupDone) {
      p.setup();
    }
  };

  p.draw = () => {
    let yoff = 0;
    for (let y = 0; y < rows; y++) {
      let xoff = 0;
      for (let x = 0; x < cols; x++) {
        xoff += inc_x;
        let r = p.noise(xoff, yoff, zoff) * 2 * PI * angleVar;
        let v = Vector.fromAngle(r).setMag(magOfForce);
        let index = x + y * cols;
        flowField[index] = v;
        // push();
        // stroke(0, 50);
        // translate( x * scl, y * scl);
        // rotate(v.heading());
        // line(0, 0, scl, 0);
        // pop();
      }
      yoff += inc_y;
    }
    zoff += inc_z;

    setColor();
    for (let i = 0; i < particles.length; i += 1) {
      particles[i].show();
      particles[i].follow(flowField);
      particles[i].update();
      particles[i].edges();
    }
  };

  p.mouseDragged = () => {
    for (let i = 0; i < maxNOfP / 200; i += 1) {
      particles.splice(0, 0, new Particle(p.mouseX, p.mouseY));
      if (particles.length > maxNOfP) {
        particles.pop();
      }
    }
  }

  function Particle(x, y) {
    if (x && y) {
      this.pos = p.createVector(x, y);
    } else {
      this.pos = p.createVector(p.random(width), p.random(height));
    }

    this.vel = p.createVector(p.random(width), p.random(height));
    this.acc = p.createVector(0, 0);
    this.maxspeed = 4;
    this.prevPos = this.pos.copy();
    this.mass = 1.5;

    this.update = function() {
      this.updatePrev();
      this.vel.add(this.acc);
      this.vel.limit(this.maxspeed);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }

    this.applyForce = function( force ) {
      // this.acc = force;
      this.acc.add(force);
    }

    this.show = function() {
      p.stroke('rgba('+ p.str(r) +','+ p.str(g) +','+ p.str(b) +',0.02)');
      // strokeWeight(3);
      // point(this.pos.x, this.pos.y);
      p.line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
      // this.updatePrev();
    }

    this.follow = function( flowField ) {
      var col = p.constrain ( p.floor ( this.pos.x / scl ), 0, cols - 1);
      var row = p.constrain ( p.floor ( this.pos.y / scl ), 0, rows - 1);
      var index = col + row * cols;
      var ff = Vector.div( flowField[index], this.mass);
      this.applyForce( ff );
    }

    this.updatePrev = function() {
      this.prevPos = this.pos.copy();
    }

    this.edges = function() {
      if ( this.pos.x > width ) {
        this.pos.x = 0;
      }
      else if ( this.pos.x < 0 ) {
        this.pos.x = width;
      }
      else if ( this.pos.y > height ) {
        this.pos.y = 0;
      }
      else if ( this.pos.y < 0 ) {
        this.pos.y = height;
      }
      else {
        //no cross monitor
        return;
      }

      this.updatePrev();
    }

  }

  function setColor() {
    // console.log("r" + str(r));
    // console.log("g" + str(g));
    // console.log("b" + str(b));
    const rate = 6.5;
    const offset = 3.7;
    const scale = 30;
    r = p.floor((p.noise(0, 100, zoff) * rate + offset) * scale);
    g = p.floor((p.noise(300, 100, zoff) * rate + offset) * scale);
    b = p.floor((p.noise(300, 500, zoff) * rate + offset) * scale);
  }

  function exit() {
    p.noLoop();
  }
}
