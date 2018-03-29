const canvas = document.getElementById("number");
const ctx = canvas.getContext("2d");
const x = 32;
const y = 32;
const radius = 30;
const startAngle = 0;
const endAngle = Math.PI * 2;
let sprite;
let mesh;
let spriteBehindObject;
const annotation = document.querySelector(".annotation");

ctx.fillStyle = "rgb(0, 0, 0)";
ctx.beginPath();
ctx.arc(x, y, radius, startAngle, endAngle);
ctx.fill();
ctx.strokeStyle = "rgb(255, 255, 255)";
ctx.lineWidth = 3;
ctx.beginPath();
ctx.arc(x, y, radius, startAngle, endAngle);
ctx.stroke();
ctx.fillStyle = "rgb(255, 255, 255)";
ctx.font = "32px sans-serif";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillText("1", x, y);
// Bis Hier Aufkleber
// Varijabli za Guito
var gui;
var API = {
  offsetX: 0,
  offsetY: 0,
  repeatX: 0.25,
  repeatY: 0.25,
  rotation: Math.PI / 4, // positive is counter-clockwise
  centerX: 0.5,
  centerY: 0.5
};

    var container;
    var camera, controls, scene, renderer;
    var lighting, ambient, keyLight, fillLight, backLight;		
init();
animate();
function init() {    
  container = document.createElement('div');
  document.body.appendChild( container );      
  /* Camera */
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.z = 3;
  /* Scene */
        scene = new THREE.Scene();
        lighting = false;
        ambient = new THREE.AmbientLight(0xffffff, 1.0);
        scene.add(ambient);
        keyLight = new THREE.DirectionalLight(0xffffff, 0.5);
        keyLight.position.set(-100, 0, 100);
        fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
        fillLight.position.set(100, 0, 100);
        backLight = new THREE.DirectionalLight(0xffffff, 0.5);
        backLight.position.set(100, 0, -100).normalize();
        ambient.intensity = 0.1;
                scene.add(keyLight);
                scene.add(fillLight);
                scene.add(backLight);  
  /* Model */
 
  
  document.getElementById("zahn").addEventListener("click", displayZahn);
  document.getElementById("kiefer").addEventListener("click", displayKiefer);
  
  function displayZahn(){
      displayKiefer().objLoader.remove(object);
      var objLoader = new THREE.OBJLoader();
      objLoader.load('model/patient-zahn.obj', function (object2) {
      object2.scale.x = 0.023;
      object2.scale.y = 0.023;					
      object2.scale.z = 0.023;
      scene.add(object2);
    });
  }

  function displayKiefer(){
      var objLoader = new THREE.OBJLoader();
      objLoader.load('model/patient-kiefer.obj', function (object) {
        object.scale.x = 0.023;
        object.scale.y = 0.023;					
        object.scale.z = 0.023;
        scene.add(object);
        alert(object);
    });
  }
  
  function removeObject(object){
      scene.remove(object);
  }
      
        /* Renderer */
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(new THREE.Color("hsl(0, 0%, 10%)"));
        container.appendChild(renderer.domElement);
  
        /* Controls */
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;
  
        /* Events */
        window.addEventListener('resize', onWindowResize, false);
        window.addEventListener('keydown', onKeyboardEvent, false);
    

      // Ab Hier Aufkleber

      const numberTexture = new THREE.CanvasTexture(
        document.querySelector("#number")
      );

      const spriteMaterial = new THREE.SpriteMaterial({
        map: numberTexture,
        alphaTest: 0.5,
        transparent: true,
        depthTest: false,
        depthWrite: false
      });

      sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.set(0.5, 0.1, 0);
      sprite.scale.set(0.15, 0.15, 1);
      scene.add(sprite);
      
      initGui();
  } 
      /* Screen Projection */
    
    function updateScreenPosition() {
      const vector = new THREE.Vector3(250, 250, 250);
      const canvas = renderer.domElement; // `renderer` is a THREE.WebGLRenderer
      const annotation = document.querySelector('.annotation');
      vector.project(camera); // `camera` is a THREE.PerspectiveCamera
      vector.x = Math.round((0.5 + vector.x / 2) * (canvas.width / window.devicePixelRatio));
      vector.y = Math.round((0.5 - vector.y / 2) * (canvas.height / window.devicePixelRatio));
      annotation.style.top = `${vector.y}px`;
      annotation.style.left = `${vector.x}px`;
      annotation.style.opacity = spriteBehindObject ? 0.25 : 1;
    }
    
    function updateAnnotationOpacity() {
      const meshDistance = camera.position.distanceTo(objLoader.position);
      const spriteDistance = camera.position.distanceTo(sprite.position);
      spriteBehindObject = spriteDistance > meshDistance;
      sprite.material.opacity = spriteBehindObject ? 0.25 : 1;
      annotation.style.opacity = spriteBehindObject ? 0.25 : 1;
    }
    
// Bis Hier Aufkleber
// Definirat Gui
function initGui() {
    gui = new dat.GUI();
    gui.add( API, 'offsetX', 0.0, 1.0 ).name( 'offset.x' );
    gui.add( API, 'offsetY', 0.0, 1.0 ).name( 'offset.y' );
    gui.add( API, 'repeatX', 0.25, 2.0 ).name( 'repeat.x' );
    gui.add( API, 'repeatY', 0.25, 2.0 ).name( 'repeat.y' );
    gui.add( API, 'rotation', - 2.0, 2.0 ).name( 'rotation' );
    gui.add( API, 'centerX', 0.0, 1.0 ).name( 'center.x' );
    gui.add( API, 'centerY', 0.0, 1.0 ).name( 'center.y' );
}

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    function onKeyboardEvent(e) {
        if (e.code === 'KeyL') {
            lighting = !lighting;
            if (lighting) {
      ambient.intensity = 1.0;
                scene.remove(keyLight);
                scene.remove(fillLight);
                scene.remove(backLight);
                
            } else {   
      ambient.intensity = 0.1;
                scene.add(keyLight);
                scene.add(fillLight);
                scene.add(backLight);
            }
        }
    }
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        render();
    }
    function render() {
        renderer.render(scene, camera);
    }
