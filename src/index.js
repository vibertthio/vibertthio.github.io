/* eslint-disable no-undef, no-unused-vars, import/first */

import './styles.css'
import * as THREE from 'three'

// import * as dat from 'dat.gui'

const RESOLUTION = 128

// Create renderer.
const canvas = document.querySelector('#canvas')
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
})
renderer.setSize(window.innerWidth, window.innerHeight)

// Create scene.
const scene = new THREE.Scene()
// scene.background = new THREE.Color(0xffffff)

// Create camera.
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight
)
camera.position.z = -1.3
scene.add(camera)

// Create groups and objects.
const group = new THREE.Group()
scene.add(group)

let mouseX = 0
let mouseY = 0
let windowHalfX = window.innerWidth / 2
let windowHalfY = window.innerHeight / 2

import planeVert from './shaders/plane.vert'
import planeFrag from './shaders/plane.frag'

const planeGeo = new THREE.PlaneGeometry(0.5, 0.5, RESOLUTION, RESOLUTION)
const attrCount = (RESOLUTION + 1) * (RESOLUTION + 1)
const extentAttr = Array(attrCount).fill(0)
planeGeo.setAttribute('extent', new THREE.Float32BufferAttribute(extentAttr, 1))

window.planeGeo = planeGeo
const planeMat = new THREE.RawShaderMaterial({
  vertexShader: planeVert,
  fragmentShader: planeFrag,
  transparent: true,
  side: THREE.DoubleSide,
  uniforms: {
    uTime: { value: 0.0 },
    uNoiseScale: { value: 2.0 },
    uOffsetScale: { value: 0.1 },
    uValue1: { value: 0.01 },
    uValue2: { value: 1.0 },
  },
})
const planeMesh = new THREE.Mesh(planeGeo, planeMat)
group.add(planeMesh)

// const gui = new dat.GUI()
// gui
//   .add(planeMat.uniforms.uValue1, 'value')
//   .min(0)
//   .max(5)
//   .step(0.01)
//   .name('evolution')
// gui
//   .add(planeMat.uniforms.uValue2, 'value')
//   .min(0)
//   .max(5)
//   .step(0.01)
//   .name('split')

// Animation loop.
const clock = new THREE.Clock()

const tick = () => {
  const dt = clock.getDelta()

  planeMat.uniforms.uTime.value = clock.getElapsedTime()

  for (let i = 0; i < planeGeo.attributes.extent.array.length; ++i) {
    planeGeo.attributes.extent.array[i] = Math.max(
      0.0,
      planeGeo.attributes.extent.array[i] - 0.3 * dt
    )
  }
  planeGeo.attributes.extent.needsUpdate = true

  // group.rotation.x += 0.01;
  // group.rotation.y += 0.02;

  camera.position.x += (mouseX - camera.position.x) * 0.3
  camera.position.y += (-mouseY - camera.position.y) * 0.5

  camera.lookAt(scene.position)

  renderer.render(scene, camera)

  requestAnimationFrame(tick)
}
tick()

// Window resize listener.
window.addEventListener('resize', () => {
  const w = window.innerWidth
  const h = window.innerHeight

  windowHalfX = window.innerWidth / 2
  windowHalfY = window.innerHeight / 2

  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
})

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

const moveEventHandler = (e) => {
  let cX
  let cY
  let touch = false
  if (e.touches && e.touches.length > 0) {
    touch = true
    cX = e.touches[0].clientX
    cY = e.touches[0].clientY

    mouseX = ((e.touches[0].clientX - windowHalfX) / 2) * 0.005
    mouseY = ((e.touches[0].clientY - windowHalfY) / 2) * 0.005
  } else {
    cX = e.clientX
    cY = e.clientY

    mouseX = ((e.clientX - windowHalfX) / 2) * 0.005
    mouseY = ((e.clientY - windowHalfY) / 2) * 0.005
  }

  mouse.x = (cX / window.innerWidth) * 2 - 1
  mouse.y = -(cY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mouse, camera)

  const intersect = raycaster.intersectObject(planeMesh)
  if (intersect != null && intersect.length > 0) {
    const nearestHit = intersect[0]
    if (nearestHit.face != null) {
      const vert0 = nearestHit.face.a
      const vert1 = nearestHit.face.b
      const vert2 = nearestHit.face.c

      planeGeo.attributes.extent.array[vert0] = 1.0
      planeGeo.attributes.extent.array[vert1] = 1.0
      planeGeo.attributes.extent.array[vert2] = 1.0
      planeGeo.attributes.extent.needsUpdate = true
    }
  }
}
window.addEventListener('mousemove', moveEventHandler)
window.addEventListener('touchmove', moveEventHandler)
