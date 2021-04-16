window.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('#figuresForm');
    const dropdownFigure = document.querySelector('#dropdownFigure');
    const scaleFigure = document.querySelector('#scale');
    const uuidList = document.querySelector('#uuidList');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
    camera.position.z = 50;
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth/1.5, window.innerHeight/1.5);
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scene.add(light);

    let items = [];
    let scale;
    let figure;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        scale = scaleFigure.value;
        figure = dropdownFigure.value;
        addObject(figure);
    });

    function createListItem(uuid) {
        function deleteItem() {
            const deleteItem = items.find(el => el.uuid === this.getAttribute('data-uuid'));
            items = items.filter(el => el.uuid !== this.getAttribute('data-uuid'));
            this.closest('li').remove();
            scene.remove(deleteItem.getMesh());
        }
        const listItem = document.createElement('li');
        const listItemSpan = document.createElement('span');
        listItemSpan.style.color = "black";
        listItemSpan.textContent = uuid;
        const button = document.createElement('button');
        button.setAttribute('data-uuid', uuid);
        button.style.background = "red";
        button.textContent = 'X';
        button.addEventListener('click', deleteItem);
        listItem.append(listItemSpan);
        listItem.append(button);
        uuidList.append(listItem);
    }

    class Shape {
        constructor({scale, color = '0x00ff00', coords}) {
            this.scale = scale;
            this.color = color;
            this.coords = coords;
            this.mesh = null;
            this.uuid = null;
            this.material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        }
        create() {
            this.mesh = new THREE.Mesh(this.getGeometry(), this.material);
            this.mesh.position.set(...this.coords);
            this.uuid = this.mesh.uuid;
            createListItem(this.uuid);
            return this;
        }
        getMesh() {
            return this.mesh;
        }
        getGeometry() {
        }
    }

    class Cube extends Shape {
        constructor(args) {
            super(args);
        }
        getGeometry() {
            return new THREE.BoxGeometry(this.scale, this.scale, this.scale);
        }
        makeFrameAnimation() {
            this.mesh.rotation.x += 0.01;
            this.mesh.rotation.y += 0.01;
        }
    }

    class Pyramid extends Shape {
        constructor(args) {
            super(args);
        }
        getGeometry() {
            return new THREE.ConeGeometry(this.scale, this.scale * 2, 4);
        }
        makeFrameAnimation() {
            this.mesh.rotation.x += 0.01;
            this.mesh.rotation.y += 0.01;
        }
    }

    class Sphere extends Shape {
        constructor(args) {
            super(args);
        }
        getGeometry() {
            return new THREE.SphereGeometry(this.scale, this.scale, this.scale);
        }
        makeFrameAnimation() {
            this.mesh.rotation.x += 0.01;
            this.mesh.rotation.y += 0.01;
        }
    }

    function toRandomPlace() {
        const coor = () => (Math.random() * 15);
        return [coor(), coor(), coor()];
    }

    function animate() {
        requestAnimationFrame(animate);
        items.forEach(item => {
            item.makeFrameAnimation();
        });
        renderer.render(scene, camera);
    }

    animate();
    document.body.appendChild(renderer.domElement);

    function addObject(type) {
        const object = {
            'cube': () => new Cube({scale, coords: toRandomPlace()}).create(),
            'pyramid': () => new Pyramid({scale, coords: toRandomPlace()}).create(),
            'sphere': () => new Sphere({scale, coords: toRandomPlace()}).create(),
        }[type]();
        items.push(object);
        scene.add(object.getMesh());
    }
});