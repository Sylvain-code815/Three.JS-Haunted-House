import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'
import { Sky } from 'three/addons/objects/Sky.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Params
const params = {
    ghost1Speed: 0.47,
    ghost2Speed: 0.35,
    ghost3Speed: 0.18,
    floorRepeat: 8,
    roofRepeat: 3,
    flickerEnabled: true,
    sunElevation: -0.038,
    sunAzimuth: -0.95,
}

// Textures
const textureLoader = new THREE.TextureLoader()

// Floor
const floorAlphaTexture = textureLoader.load('./floor/alpha.jpg')
const floorColorTexture = textureLoader.load('./floor/rocky_terrain_1k/rocky_terrain_diff_1k.jpg')
const floorArmTexture = textureLoader.load('./floor/rocky_terrain_1k/rocky_terrain_arm_1k.jpg')
const floorDisplacementTexture = textureLoader.load('./floor/rocky_terrain_1k/rocky_terrain_disp_1k.jpg')
const floorNormalTexture = textureLoader.load('./floor/rocky_terrain_1k/rocky_terrain_nor_gl_1k.jpg')

floorColorTexture.colorSpace = THREE.SRGBColorSpace

floorColorTexture.repeat.set(8, 8)
floorArmTexture.repeat.set(8, 8)
floorDisplacementTexture.repeat.set(8, 8)
floorNormalTexture.repeat.set(8, 8)

floorColorTexture.wrapS = THREE.RepeatWrapping
floorColorTexture.wrapT = THREE.RepeatWrapping

floorArmTexture.wrapS = THREE.RepeatWrapping
floorArmTexture.wrapT = THREE.RepeatWrapping

floorDisplacementTexture.wrapS = THREE.RepeatWrapping
floorDisplacementTexture.wrapT = THREE.RepeatWrapping

floorNormalTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping

// Wall
const wallColorTexture = textureLoader.load('./wall/marble_cliff_03_1k/marble_cliff_03_diff_1k.jpg')
const wallArmTexture = textureLoader.load('./wall/marble_cliff_03_1k/marble_cliff_03_arm_1k.jpg')
const wallNormalTexture = textureLoader.load('./wall/marble_cliff_03_1k/marble_cliff_03_nor_gl_1k.jpg')

wallColorTexture.colorSpace = THREE.SRGBColorSpace

// Roof
const roofColorTexture = textureLoader.load('./roof/grey_roof_tiles_02_1k/grey_roof_tiles_02_diff_1k.jpg')
const roofArmTexture = textureLoader.load('./roof/grey_roof_tiles_02_1k/grey_roof_tiles_02_arm_1k.jpg')
const roofNormalTexture = textureLoader.load('./roof/grey_roof_tiles_02_1k/grey_roof_tiles_02_nor_gl_1k.jpg')

roofColorTexture.colorSpace = THREE.SRGBColorSpace

roofColorTexture.repeat.set(3, 1)
roofArmTexture.repeat.set(3, 1)
roofNormalTexture.repeat.set(3, 1)

roofColorTexture.wrapS = THREE.RepeatWrapping
roofArmTexture.wrapS = THREE.RepeatWrapping
roofNormalTexture.wrapS = THREE.RepeatWrapping

// Bush
const bushColorTexture = textureLoader.load('./bush/dry_decay_leaves_1k/dry_decay_leaves_diff_1k.jpg')
const bushArmTexture = textureLoader.load('./bush/dry_decay_leaves_1k/dry_decay_leaves_arm_1k.jpg')
const bushNormalTexture = textureLoader.load('./bush/dry_decay_leaves_1k/dry_decay_leaves_nor_gl_1k.jpg')

bushColorTexture.colorSpace = THREE.SRGBColorSpace

bushColorTexture.repeat.set(2, 1)
bushArmTexture.repeat.set(2, 1)
bushNormalTexture.repeat.set(2, 1)

bushColorTexture.wrapS = THREE.RepeatWrapping
bushArmTexture.wrapS = THREE.RepeatWrapping
bushNormalTexture.wrapS = THREE.RepeatWrapping

// Graves
const graveColorTexture = textureLoader.load('./grave/slate_floor_1k/slate_floor_diff_1k.jpg')
const graveArmTexture = textureLoader.load('./grave/slate_floor_1k/slate_floor_arm_1k.jpg')
const graveNormalTexture = textureLoader.load('./grave/slate_floor_1k/slate_floor_nor_gl_1k.jpg')

graveColorTexture.colorSpace = THREE.SRGBColorSpace

graveColorTexture.repeat.set(0.3, 0.4)
graveArmTexture.repeat.set(0.3, 0.4)
graveNormalTexture.repeat.set(0.3, 0.4)

// Door
const doorColorTexture = textureLoader.load('./door/color.jpg')
const doorAlphaTexture = textureLoader.load('./door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('./door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('./door/height.jpg')
const doorNormalTexture = textureLoader.load('./door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('./door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('./door/roughness.jpg')

doorColorTexture.colorSpace = THREE.SRGBColorSpace


/**
 * Shared Materials
 */
const wallMaterial = new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallArmTexture,
    roughnessMap: wallArmTexture,
    metalnessMap: wallArmTexture,
    normalMap: wallNormalTexture,
})

const roofMaterial = new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofArmTexture,
    roughnessMap: roofArmTexture,
    metalnessMap: roofArmTexture,
    normalMap: roofNormalTexture,
})

/**
 * House
 */
// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({
        map: floorColorTexture,
        aoMap: floorArmTexture,
        roughnessMap: floorArmTexture,
        metalness: 0,
        normalMap: floorNormalTexture,
        transparent: true,
        alphaMap: floorAlphaTexture,
        displacementMap: floorDisplacementTexture,
        displacementScale: 0.3,
        displacementBias: -0.2
    })
)
floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

// House container
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    wallMaterial
)
walls.position.y += 2.5 / 2
house.add(walls)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    roofMaterial
)
roof.position.y = 2.5 + (1.5 / 2)
roof.rotation.y = Math.PI / 4
house.add(roof)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        roughnessMap: doorRoughnessTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.15,
        displacementBias: -0.04,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
    })
)
door.position.y = 1
door.position.z = 2 + 0.01
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    color: '#ccffcc',
    map: bushColorTexture,
    aoMap: bushArmTexture,
    roughnessMap: bushArmTexture,
    metalnessMap: bushArmTexture,
    normalMap: bushNormalTexture,
})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)
bush1.rotation.x = -0.75
house.add(bush1)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)
bush2.rotation.x = -0.75
house.add(bush2)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)
bush3.rotation.x = -0.75
house.add(bush3)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)
bush4.rotation.x = -0.75
house.add(bush4)

/**
 * Garage (right side of house)
 */
const garageWalls = new THREE.Mesh(
    new THREE.BoxGeometry(3, 2, 3),
    wallMaterial
)
garageWalls.position.set(3.5, 1, 0)
house.add(garageWalls)

const garageRoof = new THREE.Mesh(
    new THREE.ConeGeometry(2.5, 1, 4),
    roofMaterial
)
garageRoof.position.set(3.5, 2.5, 0)
garageRoof.rotation.y = Math.PI / 4
house.add(garageRoof)

const garageDoor = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 1.8),
    new THREE.MeshStandardMaterial({ color: '#1a1a1a' })
)
garageDoor.position.set(3.5, 0.9, 1.51)
house.add(garageDoor)

/**
 * Tool Shed (left-rear)
 */
const shedWalls = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 1.5, 1.8),
    wallMaterial
)
shedWalls.position.set(-3.5, 0.75, -2)
house.add(shedWalls)

const shedRoof = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.15, 2.2),
    roofMaterial
)
shedRoof.position.set(-3.5, 1.55, -2)
shedRoof.rotation.z = 0.1
house.add(shedRoof)

const shedDoor = new THREE.Mesh(
    new THREE.PlaneGeometry(0.8, 1.2),
    new THREE.MeshStandardMaterial({ color: '#2a1a0a' })
)
shedDoor.position.set(-3.5, 0.6, -1.09)
house.add(shedDoor)

/**
 * Outhouse (far left)
 */
const outhouseWalls = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 2, 1.2),
    wallMaterial
)
outhouseWalls.position.set(-5, 1, 2)
house.add(outhouseWalls)

const outhouseRoof = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.1, 1.5),
    roofMaterial
)
outhouseRoof.position.set(-5, 2.05, 2)
outhouseRoof.rotation.z = 0.15
house.add(outhouseRoof)

const outhouseDoor = new THREE.Mesh(
    new THREE.PlaneGeometry(0.7, 1.5),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        roughnessMap: doorRoughnessTexture,
        normalMap: doorNormalTexture,
    })
)
outhouseDoor.position.set(-5, 0.8, 2.61)
house.add(outhouseDoor)

// Moon cutout on outhouse door
const moonCrescent = new THREE.Mesh(
    new THREE.TorusGeometry(0.15, 0.05, 8, 16),
    new THREE.MeshStandardMaterial({ color: '#ffcc44', emissive: '#ffcc44', emissiveIntensity: 0.5 })
)
moonCrescent.position.set(-5, 1.6, 2.62)
house.add(moonCrescent)

/**
 * Windows (on main house)
 */
const windowGeometry = new THREE.PlaneGeometry(0.6, 0.6)
const windowMaterial = new THREE.MeshStandardMaterial({
    color: '#ffcc44',
    emissive: '#ffcc44',
    emissiveIntensity: 0.3,
})

// Window frame helper
const createWindowFrame = (x, y, z, rotationY) => {
    const windowPane = new THREE.Mesh(windowGeometry, windowMaterial)
    windowPane.position.set(x, y, z)
    windowPane.rotation.y = rotationY
    house.add(windowPane)

    const frameMaterial = new THREE.MeshStandardMaterial({ color: '#2a1a0a' })

    // Horizontal bar
    const hBar = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.04, 0.04), frameMaterial)
    hBar.position.set(x, y, z)
    hBar.rotation.y = rotationY
    house.add(hBar)

    // Vertical bar
    const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.6, 0.04), frameMaterial)
    vBar.position.set(x, y, z)
    vBar.rotation.y = rotationY
    house.add(vBar)
}

// Left wall window
createWindowFrame(-2.01, 1.5, 0, -Math.PI / 2)
// Right wall window
createWindowFrame(2.01, 1.5, 0, Math.PI / 2)
// Back wall window
createWindowFrame(0, 1.5, -2.01, Math.PI)

/**
 * Fence (perimeter)
 */
const fenceMaterial = new THREE.MeshStandardMaterial({ color: '#4a3728' })
const fencePostGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 6)
const fenceRadius = 8
const fencePostCount = 24
const fencePostPositions = []

for (let i = 0; i < fencePostCount; i++) {
    const angle = (i / fencePostCount) * Math.PI * 2
    // Skip posts for the entrance gap (around angle = PI/2, i.e. positive Z direction)
    const normalizedAngle = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
    if (normalizedAngle > Math.PI * 0.4 && normalizedAngle < Math.PI * 0.6) continue

    const x = Math.cos(angle) * fenceRadius
    const z = Math.sin(angle) * fenceRadius

    const post = new THREE.Mesh(fencePostGeometry, fenceMaterial)
    post.position.set(x, 0.5, z)
    scene.add(post)

    fencePostPositions.push({ x, z, angle })
}

// Fence rails connecting adjacent posts
const railMaterial = fenceMaterial
for (let i = 0; i < fencePostPositions.length; i++) {
    const current = fencePostPositions[i]
    const next = fencePostPositions[(i + 1) % fencePostPositions.length]

    // Check if we're at the gap
    const dx = next.x - current.x
    const dz = next.z - current.z
    const distance = Math.sqrt(dx * dx + dz * dz)

    // Skip rail if distance is too large (gap in fence)
    if (distance > 3) continue

    const midX = (current.x + next.x) / 2
    const midZ = (current.z + next.z) / 2
    const rotationY = Math.atan2(dx, dz)

    // Lower rail
    const lowerRail = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.04, distance),
        railMaterial
    )
    lowerRail.position.set(midX, 0.3, midZ)
    lowerRail.rotation.y = rotationY
    scene.add(lowerRail)

    // Upper rail
    const upperRail = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.04, distance),
        railMaterial
    )
    upperRail.position.set(midX, 0.7, midZ)
    upperRail.rotation.y = rotationY
    scene.add(upperRail)
}

/**
 * Pathway (door to fence entrance)
 */
const pathwayGeometry = new THREE.BoxGeometry(0.5, 0.02, 0.5)
const pathwayMaterial = new THREE.MeshStandardMaterial({
    map: graveColorTexture,
    aoMap: graveArmTexture,
    roughnessMap: graveArmTexture,
    metalnessMap: graveArmTexture,
    normalMap: graveNormalTexture,
})

for (let i = 0; i < 8; i++) {
    const stone = new THREE.Mesh(pathwayGeometry, pathwayMaterial)
    stone.position.set(
        (Math.random() - 0.5) * 0.3,
        0.01,
        2.5 + i * 0.75
    )
    stone.rotation.y = (Math.random() - 0.5) * 0.4
    scene.add(stone)
}

/**
 * Rocks (scattered)
 */
const rockGeometry = new THREE.IcosahedronGeometry(1, 0)
const rockMaterial = new THREE.MeshStandardMaterial({
    color: '#555555',
    map: wallColorTexture,
    aoMap: wallArmTexture,
    roughnessMap: wallArmTexture,
    normalMap: wallNormalTexture,
})

for (let i = 0; i < 10; i++) {
    const rock = new THREE.Mesh(rockGeometry, rockMaterial)
    const angle = Math.random() * Math.PI * 2
    const radius = 4 + Math.random() * 5
    const scale = 0.1 + Math.random() * 0.25

    rock.position.set(
        Math.cos(angle) * radius,
        scale * 0.3,
        Math.sin(angle) * radius
    )
    rock.scale.set(scale, scale * 0.6, scale)
    rock.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
    )
    scene.add(rock)
}

/**
 * Wood Sign (near entrance)
 */
const signMaterial = new THREE.MeshStandardMaterial({ color: '#5c3a1e' })

const signPost = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 1.2, 6),
    signMaterial
)
signPost.position.set(1.5, 0.6, 8)
scene.add(signPost)

const signBoard = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.5, 0.05),
    signMaterial
)
signBoard.position.set(1.5, 1, 8)
signBoard.rotation.y = 0.2
scene.add(signBoard)

/**
 * Graves
 */
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
    map: graveColorTexture,
    aoMap: graveArmTexture,
    roughnessMap: graveArmTexture,
    metalnessMap: graveArmTexture,
    normalMap: graveNormalTexture,
})

// Building footprints to avoid (centerX, centerZ, halfWidth, halfDepth)
const buildingFootprints = [
    { cx: 0, cz: 0, hw: 2.5, hd: 2.5 },       // Main house
    { cx: 3.5, cz: 0, hw: 2, hd: 2 },           // Garage
    { cx: -3.5, cz: -2, hw: 1.5, hd: 1.5 },     // Shed
    { cx: -5, cz: 2, hw: 1, hd: 1 },             // Outhouse
]

const isInsideBuilding = (x, z) => {
    for (const fp of buildingFootprints) {
        if (Math.abs(x - fp.cx) < fp.hw && Math.abs(z - fp.cz) < fp.hd) return true
    }
    return false
}

const graves = new THREE.Group()
scene.add(graves)

for (let i = 0; i < 30; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 4
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    // Skip if inside a building footprint
    if (isInsideBuilding(x, z)) continue

    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.x = x
    grave.position.y = Math.random() * 0.4
    grave.position.z = z
    grave.rotation.x = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4

    graves.add(grave)
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 5)
doorLight.position.set(0, 2.2, 2.5)
house.add(doorLight)

// Front fill light (subtle)
const frontLight = new THREE.PointLight('#4466aa', 3)
frontLight.position.set(0, 3, 6)
scene.add(frontLight)

// Ghosts
const ghost1 = new THREE.PointLight('#8800ff', 6)
const ghost2 = new THREE.PointLight('#ff0088', 6)
const ghost3 = new THREE.PointLight('#ff0000', 6)
scene.add(ghost1, ghost2, ghost3)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Tone mapping
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1

// Shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

directionalLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
walls.receiveShadow = true
roof.castShadow = true
floor.castShadow = true
floor.receiveShadow = true

garageWalls.castShadow = true
garageWalls.receiveShadow = true
garageRoof.castShadow = true
shedWalls.castShadow = true
shedWalls.receiveShadow = true
shedRoof.castShadow = true
outhouseWalls.castShadow = true
outhouseWalls.receiveShadow = true
outhouseRoof.castShadow = true

for (const grave of graves.children) {
    grave.castShadow = true
    grave.receiveShadow = true
}

// Shadow maps
directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.bottom = -8
directionalLight.shadow.camera.left = -8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 10

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 10

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 10

// Sky
const sky = new Sky()
sky.scale.set(100, 100, 100)
scene.add(sky)

sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)

// Fog
scene.fog = new THREE.FogExp2('#02343f', 0.08)

/**
 * GUI
 */
// Lights folder
const lightsFolder = gui.addFolder('Lights')
lightsFolder.add(ambientLight, 'intensity').min(0).max(1).step(0.01).name('Ambient Intensity')
lightsFolder.addColor(ambientLight, 'color').name('Ambient Color')
lightsFolder.add(directionalLight, 'intensity').min(0).max(3).step(0.01).name('Directional Intensity')
lightsFolder.addColor(directionalLight, 'color').name('Directional Color')
lightsFolder.add(doorLight, 'intensity').min(0).max(10).step(0.1).name('Door Light Intensity')
lightsFolder.addColor(doorLight, 'color').name('Door Light Color')
lightsFolder.add(params, 'flickerEnabled').name('Door Flicker')

// Ghosts folder
const ghostsFolder = gui.addFolder('Ghosts')
ghostsFolder.add(params, 'ghost1Speed').min(0).max(2).step(0.01).name('Ghost 1 Speed')
ghostsFolder.add(ghost1, 'intensity').min(0).max(10).step(0.1).name('Ghost 1 Intensity')
ghostsFolder.addColor(ghost1, 'color').name('Ghost 1 Color')
ghostsFolder.add(params, 'ghost2Speed').min(0).max(2).step(0.01).name('Ghost 2 Speed')
ghostsFolder.add(ghost2, 'intensity').min(0).max(10).step(0.1).name('Ghost 2 Intensity')
ghostsFolder.addColor(ghost2, 'color').name('Ghost 2 Color')
ghostsFolder.add(params, 'ghost3Speed').min(0).max(2).step(0.01).name('Ghost 3 Speed')
ghostsFolder.add(ghost3, 'intensity').min(0).max(10).step(0.1).name('Ghost 3 Intensity')
ghostsFolder.addColor(ghost3, 'color').name('Ghost 3 Color')

// Textures folder
const texturesFolder = gui.addFolder('Textures')
texturesFolder.add(params, 'floorRepeat').min(1).max(16).step(1).name('Floor Repeat').onChange((v) => {
    floorColorTexture.repeat.set(v, v)
    floorArmTexture.repeat.set(v, v)
    floorDisplacementTexture.repeat.set(v, v)
    floorNormalTexture.repeat.set(v, v)
})
texturesFolder.add(params, 'roofRepeat').min(1).max(6).step(1).name('Roof Repeat').onChange((v) => {
    roofColorTexture.repeat.set(v, 1)
    roofArmTexture.repeat.set(v, 1)
    roofNormalTexture.repeat.set(v, 1)
})
texturesFolder.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name('Floor Disp Scale')
texturesFolder.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name('Floor Disp Bias')

// Sky folder
const skyFolder = gui.addFolder('Sky')
skyFolder.add(sky.material.uniforms['turbidity'], 'value').min(0).max(20).step(0.1).name('Turbidity')
skyFolder.add(sky.material.uniforms['rayleigh'], 'value').min(0).max(4).step(0.01).name('Rayleigh')
skyFolder.add(sky.material.uniforms['mieCoefficient'], 'value').min(0).max(0.5).step(0.001).name('Mie Coefficient')
skyFolder.add(sky.material.uniforms['mieDirectionalG'], 'value').min(0).max(1).step(0.01).name('Mie Directional G')
skyFolder.add(params, 'sunElevation').min(-0.5).max(0.5).step(0.001).name('Sun Elevation').onChange(() => {
    sky.material.uniforms['sunPosition'].value.set(0.3, params.sunElevation, params.sunAzimuth)
})
skyFolder.add(params, 'sunAzimuth').min(-1).max(1).step(0.01).name('Sun Azimuth').onChange(() => {
    sky.material.uniforms['sunPosition'].value.set(0.3, params.sunElevation, params.sunAzimuth)
})
skyFolder.add(renderer, 'toneMappingExposure').min(0).max(2).step(0.01).name('Exposure')

// Fog folder
const fogFolder = gui.addFolder('Fog')
fogFolder.add(scene.fog, 'density').min(0).max(0.3).step(0.001).name('Fog Density')
fogFolder.addColor(scene.fog, 'color').name('Fog Color')

/**
 * Animate
 */
const timer = new Timer()

const tick = () => {
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    // Ghost animations
    const ghost1Angle = elapsedTime * params.ghost1Speed
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(ghost1Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 3.45)

    const ghost2Angle = -elapsedTime * params.ghost2Speed
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(ghost2Angle) * Math.sin(ghost2Angle * 2.34) * Math.sin(ghost2Angle * 3.45)

    const ghost3Angle = elapsedTime * params.ghost3Speed
    ghost3.position.x = Math.cos(ghost3Angle) * 6
    ghost3.position.z = Math.sin(ghost3Angle) * 6
    ghost3.position.y = Math.sin(ghost3Angle) * Math.sin(ghost3Angle * 2.34) * Math.sin(ghost3Angle * 3.45)

    // Door light flicker
    if (params.flickerEnabled) {
        const flickerBase = 5
        const flicker = flickerBase
            + Math.sin(elapsedTime * 10) * 0.5
            + Math.sin(elapsedTime * 23.7) * 0.3
            + Math.sin(elapsedTime * 47.1) * 0.15
            + (Math.random() - 0.5) * 0.8
        doorLight.intensity = Math.max(0.5, flicker)

        // Subtle warmth shift
        const warmth = 0.85 + Math.sin(elapsedTime * 7) * 0.15
        doorLight.color.setRGB(1, warmth * 0.49, warmth * 0.27)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
