/**
 * [sketch description]
 * @param  {[type]} p [description]
 */
export default function sketch(p) {
  let rotation = 0;
  let width = 800;
  let height = 500;

  p.setup = () => {
    const canvas = p.createCanvas(width, height);
    canvas.class('p5-canvas');
  };

  p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    width = props.width;
    height = props.height;
    p.setup();
  };

  p.draw = () => {
    rotation += 0.01;
    p.background(100);
    p.noStroke();
    p.push();
    p.rotateY(rotation);
    p.box(100);
    p.pop();
  };
}
