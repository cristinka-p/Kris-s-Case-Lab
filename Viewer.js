// viewer.js
let scene, camera, renderer, controls, model;
let dirLight, hemiLight;
let container = document.getElementById('viewer');

function initThree(){
  container = document.getElementById('viewer');
  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf6f7ff);

  camera = new THREE.PerspectiveCamera(45, container.clientWidth/container.clientHeight, 0.1, 1000);
  camera.position.set(0, 100, 200);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
  scene.add(hemiLight);

  dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(0, 200, 100);
  scene.add(dirLight);

  window.addEventListener('resize', onWindowResize);
  animate();
}

function animate(){
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

function onWindowResize(){
  if(!container) return;
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

// загрузка файла (STL или GLB)
document.addEventListener('DOMContentLoaded', ()=>{
  initThree();

  const fileInput = document.getElementById('fileInput');
  const colorPicker = document.getElementById('colorPicker');
  const scaleInput = document.getElementById('scaleInput');
  const scaleVal = document.getElementById('scaleVal');
  const fitBtn = document.getElementById('fitBtn');
  const exportBtn = document.getElementById('exportBtn');
  const measureBtn = document.getElementById('measureBtn');
  const bboxInfo = document.getElementById('bboxInfo');

  fileInput.addEventListener('change', async (e)=>{
    const f = e.target.files[0];
    if(!f) return;
    const name = f.name.toLowerCase();
    if(name.endsWith('.stl')){
      const reader = new FileReader();
      reader.onload = function(ev){
        const buffer = ev.target.result;
        const loader = new THREE.STLLoader();
        const geometry = loader.parse(buffer);
        const material = new THREE.MeshStandardMaterial({color: colorPicker.value, metalness:0.1, roughness:0.6});
        const mesh = new THREE.Mesh(geometry, material);
        setModel(mesh);
      };
      reader.readAsArrayBuffer(f);
    } else if(name.endsWith('.glb') || name.endsWith('.gltf')){
      const url = URL.createObjectURL(f);
      const gltfLoader = new THREE.GLTFLoader();
      gltfLoader.load(url, (g)=>{
        const obj = g.scene;
        obj.traverse(nx => { if(nx.isMesh) nx.material = new THREE.MeshStandardMaterial({color: colorPicker.value}) });
        setModel(obj);
      });
    } else {
      alert('Поддерживаются .stl и .glb/.gltf. Для STEP сначала конвертируйте в STL/GLB (см. примечание).');
    }
  });

  colorPicker.addEventListener('input', ()=>{
    if(!model) return;
    model.traverse(n => { if(n.isMesh) n.material.color.set(colorPicker.value); });
  });

  scaleInput.addEventListener('input', ()=>{
    const v = parseFloat(scaleInput.value);
    scaleVal.textContent = v.toFixed(2);
    if(model) model.scale.set(v,v,v);
  });

  fitBtn.addEventListener('click', ()=> fitToView());

  exportBtn.addEventListener('click', ()=>{
    if(!model){ alert('Нет модели для экспорта'); return; }
    // экспортируем текущую модель в STL
    const exporter = new THREE.STLExporter();
    // нужно экспортировать меш; если model — группа, создадим временную копию
    const exported = exporter.parse(model);
    const blob = new Blob([exported], {type:'application/vnd.ms-pki.stl'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'model_scaled.stl'; a.click();
    URL.revokeObjectURL(url);
  });

  measureBtn.addEventListener('click', ()=> {
    if(!model){ alert('Нет модели'); return; }
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    box.getSize(size);
    bboxInfo.innerText = `Габариты (X × Y × Z): ${size.x.toFixed(2)} × ${size.y.toFixed(2)} × ${size.z.toFixed(2)} (ед.)`;
  });

});

function setModel(obj){
  // убрать старую модель
  if(model) scene.remove(model);
  model = obj;
  // центрирование модели в (0,0,0)
  const box = new THREE.Box3().setFromObject(model);
  const center = new THREE.Vector3();
  box.getCenter(center);
  model.position.x -= center.x;
  model.position.y -= center.y;
  model.position.z -= center.z;

  // масштаб под разумные размеры
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  if(maxDim > 0){
    const scale = 100 / maxDim; // нормируем, чтобы модель стала около 100 ед.
    model.scale.set(scale, scale, scale);
  }

  scene.add(model);
  fitToView();
}

function fitToView(){
  if(!model) return;
  const box = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI/180);
  let cameraZ = Math.abs(maxDim / 2 * Math.tan(fov * 2));
  cameraZ *= 1.6; // запас
  camera.position.set(cameraZ, cameraZ, cameraZ);
  camera.lookAt(0,0,0);
  controls.update();
}
