// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 80;
var h = 80;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 7, Math.floor( minWindowSize / w ) );
var pixelRatio = window.devicePixelRatio || 1;
zoom *= pixelRatio;
var canvasWidth = canvas.width = w * zoom;
var canvasHeight = canvas.height = h * zoom;
// set canvas screen size
if ( pixelRatio > 1 ) {
  canvas.style.width = canvasWidth / pixelRatio + 'px';
  canvas.style.height = canvasHeight / pixelRatio + 'px';
}

var isRotating = true;

// colors
var pink = '#F8B';
var blush = '#F5A';
var black = '#333';
var shoe = '#D03';
var red = '#E10';
var yellow = '#FD0';

var camera = new Shape({
  rendering: false,
});

// -- illustration shapes --- //

var body = new Shape({
  lineWidth: 22,
  translate: { y: 11 },
  rotate: { x: -0.3, z: 0.1 },
  addTo: camera,
  color: pink,
});

var face = new Shape({
  rendering: false,
  translate: { z: -10.5 },
  addTo: body,
});

[ -1, 1 ].forEach( function( xSide ) {
  var eyeGroup = new Group({
    addTo: face,
    translate: { x: 2.4*xSide, y: -2 },
    rotate: { x: -0.1 },
  });
  // eye
  new Ellipse({
    width: 1.4,
    height: 5.5,
    addTo: eyeGroup,
    lineWidth: 1,
    color: black,
    fill: true,
  });
  // eye highlight
  new Ellipse({
    width: 1,
    height: 2,
    addTo: eyeGroup,
    translate: { y: -1.5, z: -0.5 },
    lineWidth: 0.5,
    color: '#FFF',
    fill: true,
  });

  // cheek holder
  var cheekHolder = new Shape({
    rendering: false,
    addTo: body,
    rotate: { y: 0.6*xSide },
  });

  new Ellipse({
    width: 2.5,
    height: 1,
    translate: { y: 1, z: -10.5 },
    addTo: cheekHolder,
    color: blush,
    lineWidth: 1,
  });

});

// mouth
new Shape({
  path: [
    { x: 0, y: 0 },
    { bezier: [
      { x: 1.1, y: 0 },
      { x: 1.1, y: 0.2 },
      { x: 1.1, y: 0.5 },
    ]},
    { bezier: [
      { x: 1.1, y: 1.1 },
      { x: 0.2, y: 1.8 },
      { x: 0, y: 1.8 },
    ]},
    { bezier: [
      { x: -0.2, y: 1.8 },
      { x: -1.1, y: 1.1 },
      { x: -1.1, y: 0.5 },
    ]},
    { bezier: [
      { x: -1.1, y: 0.2 },
      { x: -1.1, y: 0 },
      { x: 0, y: 0 },
    ]},
  ],
  addTo: face,
  translate: { y: 2, z: 0.5 },
  lineWidth: 1,
  color: shoe,
  fill: true,
});

var rightArm = new Shape({
  path: [
    { y: 0 },
    { y: -7 },
  ],
  addTo: body,
  translate: { x: -6, y: -4, z: 0 },
  color: pink,
  lineWidth: 7,
});

// left arm
rightArm.copy({
  path: [
    { x: 0 },
    { x: 6 },
  ],
  translate: { x: 6, y: -2, z: 0 },
});

// right foot
var rightFoot = new Shape({
  path: [
    { x: 0, y: -2 },
    { arc: [
      { x: 2, y: -2 },
      { x: 2, y: 0 },
    ]},
    { arc: [
      { x: 2, y: 5 },
      { x: 0, y: 5 },
    ]},
    { arc: [
      { x: -2, y: 5 },
      { x: -2, y: 0 },
    ]},
    { arc: [
      { x: -2, y: -2 },
      { x: 0, y: -2 },
    ]},
  ],
  addTo: body,
  translate: { x: -1, y: 9, z: 9 },
  rotate: { z: -0.2 },
  lineWidth: 6,
  color: shoe,
  fill: true,
  closed: false,
});

rightFoot.copy({
  translate: { x: 9.5, y: 6, z: 6 },
  rotate: { z: -1.1, y: -0.8 }
});

// ----- umbrella ----- //

// umbrella rod
var umbrella = new Shape({
  path: [
    { y: 0 },
    { y: 22 },
  ],
  addTo: rightArm,
  translate: { y: -33, z: -2 },
  rotate: { y: -0.5 },
  color: yellow,
  lineWidth: 1,
});

// star
var starPath = ( function() {
  var path = [];
  var starRadiusA = 3;
  var starRadiusB = 1.7;
  for ( var i=0; i<10; i++ ) {
    var radius = i % 2 ? starRadiusA : starRadiusB;
    var angle = TAU * i/10 + TAU/4;
    var point = {
      x: Math.cos( angle ) * radius,
      y: Math.sin( angle ) * radius,
    };
    path.push( point );
  }
  return path;
})();
// star shape
var star = new Shape({
  path: starPath,
  addTo: umbrella,
  translate: { y: -4.5 },
  lineWidth: 2,
  color: yellow,
  fill: true,
});

// umbrella handle
new Shape({
  path: [
    { z: 0, y: 0 },
    { z: 0, y: 1 },
    { arc: [
      { z: 0, y: 4 },
      { z: -3, y: 4 },
    ]},
    { arc: [
      { z: -6, y: 4 },
      { z: -6, y: 1 },
    ]},
  ],
  addTo: umbrella,
  translate: { y: 23 },
  lineWidth: 2,
  color: '#37F',
  closed: false,
});

// umbrella shield panels
( function() {
  var umbPanelX = 14 * Math.sin( TAU/24 );
  var umbPanelZ = 14 * Math.cos( TAU/24 );
  for ( var i=0; i<12; i++ ) {
    var colorSide = Math.floor( i / 2 ) % 2;
    new Shape({
      path: [
        { x: 0, y: 0, z: 0 },
        { arc: [
          { x: -umbPanelX, y: 0, z: -umbPanelZ },
          { x: -umbPanelX, y: 14, z: -umbPanelZ },
        ]},
        { x: umbPanelX, y: 14, z: -umbPanelZ },
        { arc: [
          { x: umbPanelX, y: 0, z: -umbPanelZ },
          { x: 0, y: 0, z: 0 },
        ]},
      ],
      addTo: umbrella,
      rotate: { y: TAU/12 * i },
      lineWidth: 1,
      color: colorSide ? red : 'white',
      fill: true,
    });
  }
})();

// ----- floater stars ----- //

( function() {
  for ( var i=0; i < 6; i++ ) {
    var starHolder = new Shape({
      rendering: false,
      addTo: umbrella,
      translate: { y: 10 },
      rotate: { y: TAU/6 * i + TAU/24 },
    });
    star.copy({
      addTo: starHolder,
      translate: { z: 28 },
    });
  }
})();

// -- animate --- //

function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

// -- update -- //

function update() {
  camera.rotate.y += isRotating ? +TAU/150 : 0;

  camera.updateGraph();
}

// -- render -- //

function render() {
  ctx.clearRect( 0, 0, canvasWidth, canvasHeight );
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.save();
  ctx.scale( zoom, zoom );
  ctx.translate( w/2, h/2 );

  camera.renderGraph( ctx );

  ctx.restore();
}

// ----- inputs ----- //

// click drag to rotate
var dragStartAngleX, dragStartAngleY;

new Dragger({
  startElement: canvas,
  onPointerDown: function() {
    isRotating = false;
    dragStartAngleX = camera.rotate.x;
    dragStartAngleY = camera.rotate.y;
  },
  onPointerMove: function( pointer, moveX, moveY ) {
    var angleXMove = moveY / canvasWidth * TAU;
    var angleYMove = moveX / canvasWidth * TAU;
    camera.rotate.x = dragStartAngleX + angleXMove;
    camera.rotate.y = dragStartAngleY + angleYMove;
  },
});
