document.addEventListener('DOMContentLoaded', function () {
// ============ 4D Tesseract System (moved from inline) ============
function create4DVisualization() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    // Tạo Tesseract 4D
    const tesseractContainer = document.createElement('div');
    tesseractContainer.className = 'tesseract-container';
    
    const tesseract = document.createElement('div');
    tesseract.className = 'tesseract';
    
    // 16 vertices của Tesseract (Hypercube 4D)
    const vertices = [
        // Inner cube
        [-100, -100, -100], [-100, -100, 100], [-100, 100, -100], [-100, 100, 100],
        [100, -100, -100], [100, -100, 100], [100, 100, -100], [100, 100, 100],
        // Outer cube (4D projection)
        [-60, -60, -60], [-60, -60, 60], [-60, 60, -60], [-60, 60, 60],
        [60, -60, -60], [60, -60, 60], [60, 60, -60], [60, 60, 60]
    ];
    
    // Tạo vertices
    vertices.forEach((v, i) => {
        const vertex = document.createElement('div');
        vertex.className = 'vertex';
        vertex.style.transform = `translate3d(${v[0]}px, ${v[1]}px, ${v[2]}px)`;
        vertex.style.setProperty('--index', i);
        tesseract.appendChild(vertex);
    });
    
    // Tạo edges
    const edges = [
        // Inner cube edges
        [0,1],[2,3],[4,5],[6,7],[0,2],[1,3],[4,6],[5,7],[0,4],[1,5],[2,6],[3,7],
        // Outer cube edges
        [8,9],[10,11],[12,13],[14,15],[8,10],[9,11],[12,14],[13,15],[8,12],[9,13],[10,14],[11,15],
        // 4D connection edges
        [0,8],[1,9],[2,10],[3,11],[4,12],[5,13],[6,14],[7,15]
    ];
    
    edges.forEach(edge => {
        const line = document.createElement('div');
        line.className = 'edge';
        const v1 = vertices[edge[0]];
        const v2 = vertices[edge[1]];
        const length = Math.sqrt(
            Math.pow(v2[0]-v1[0], 2) + 
            Math.pow(v2[1]-v1[1], 2) + 
            Math.pow(v2[2]-v1[2], 2)
        );
        const angle = Math.atan2(v2[1]-v1[1], v2[0]-v1[0]);
        line.style.width = length + 'px';
        line.style.transform = `translate3d(${v1[0]}px, ${v1[1]}px, ${v1[2]}px) rotate(${angle}rad)`;
        tesseract.appendChild(line);
    });
    
    tesseractContainer.appendChild(tesseract);
    container.appendChild(tesseractContainer);
    
    // Tạo Quantum Orbitals
    for (let i = 0; i < 3; i++) {
        const orbital = document.createElement('div');
        orbital.className = `quantum-orbital orbital-${i + 1}`;
        container.appendChild(orbital);
    }
    
    // Tạo particles nhỏ
    const particleCount = 25;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 2 + 0.5;
        const duration = Math.random() * 20 + 15;
        const delay = Math.random() * 5;
        
        particle.style.left = x + '%';
        particle.style.top = y + '%';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = delay + 's';
        
        container.appendChild(particle);
    }
}

create4DVisualization();

// ============ Story Data ============
const storyData = {
    "images/1.JPG": { title: "📸 Khoảnh khắc đặc biệt", message: "Những kỷ niệm đẹp cùng bạn thật là tuyệt vời! 🎄✨" },
    "images/2.JPG": { title: "💝 Yêu thương", message: "Cảm ơn vì những lúc bên cạnh tôi. Bạn thật là quý giá! 💖" },
    "images/3.JPG": { title: "🌟 Ánh sáng của bạn", message: "Bạn làm cuộc sống của tôi sáng hơn. Merry Christmas! 🎅" },
    "images/4.JPG": { title: "🎄 Mùa lễ hội", message: "Mong cùng bạn có một mùa Noel ấm áp nhất! ❄️" },
    "images/5.JPG": { title: "😊 Nụ cười", message: "Nụ cười của bạn là món quà tuyệt nhất cho tôi! 🎁" },
    "images/6.JPG": { title: "🚀 Hành trình", message: "Hãy cùng nhau viết tiếp những câu chuyện đẹp! 🌈" },
    "images/7.JPG": { title: "💫 Ước mơ", message: "Mong rằng những ước mơ của bạn sẽ thành hiện thực! ⭐" },
    "images/8.JPG": { title: "🎵 Giai điệu", message: "Bạn là bài hát yêu thích của trái tim tôi! 🎶" },
    "images/9.JPG": { title: "🌺 Sắc hoa", message: "Cuộc sống có bạn thật là rực rỡ và tươi vui! 🌸" },
    "images/10.JPG": { title: "🎊 Ăn mừng", message: "Cảm ơn vì một năm tuyệt vời cùng bạn! 🥳" }
};

// ============ Load Configuration ============
let config = {};

fetch("config.json")
    .then(res => res.json())
    .then(data => {
        config = data.gallery;
        console.log("Gallery Config Loaded:", config);
    })
    .catch(err => console.log("Using default config"));

// ============ Carousel Logic ============
let angle = 0;
let startX = 0;
let isDragging = false;
let currentImageIndex = 0;

fetch("images.json")
.then(res => res.json())
.then(images => {
    const carousel = document.getElementById("carousel");
    const total = images.length || 0;
    console.log('Loaded images.json, count =', total);

    // Fallback: if images array empty, use default list (so file:// or fetch errors won't break UI)
    const defaultImages = [
        'images/1.JPG','images/2.JPG','images/3.JPG','images/4.JPG','images/5.JPG',
        'images/6.JPG','images/7.JPG','images/8.JPG','images/9.JPG','images/10.JPG'
    ];

    const imgs = (total > 0) ? images : defaultImages;
    const gap = 360 / imgs.length;

    // Dynamic radius based on viewport so translateZ is visible on desktop and mobile
    const maxRadius = Math.min(window.innerWidth, 800) * 0.6;
    const radius = Math.max(220, Math.min(520, Math.floor(maxRadius)));

    imgs.forEach((src, i) => {
        const card = document.createElement("div");
        card.className = "card";
        card.style.transform = `rotateY(${i * gap}deg) translateZ(${radius}px)`;
        card.style.zIndex = String(1000 - i); // help stacking a bit
        
        const cardContent = document.createElement("div");
        cardContent.className = "card-content";
        
        const img = document.createElement("img");
        img.src = src;
        img.alt = `Image ${i+1}`;
        // Debug: log if an image fails to load on GH Pages (case-sensitivity / path issues)
        img.onerror = function(e) {
            console.error('Image failed to load:', src, e);
            this.style.filter = 'grayscale(100%)';
        };
        img.onload = function() {
            console.log('Image loaded:', src);
        };
        
        cardContent.appendChild(img);
        card.appendChild(cardContent);
        
        // Click để mở story
        card.addEventListener('click', () => openStory(src, storyData[src] || {}));
        
        carousel.appendChild(card);
        console.log('Appended card for', src);
    });
    console.log('Total cards in carousel:', carousel.children.length);
})
.catch(err => {
    console.error('Failed to load images.json:', err);
    // Try to still render with local defaults
    const evt = new Event('images-fallback');
    document.dispatchEvent(evt);
});

// ============ Story Modal ============
function openStory(imageSrc, story) {
    const modal = document.getElementById('storyModal');
    document.getElementById('modalImage').src = imageSrc;
    document.getElementById('modalTitle').textContent = story.title || '💝 Special Moment';
    document.getElementById('modalMessage').textContent = story.message || 'Cảm ơn vì những khoảnh khắc đẹp này! ✨';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('storyModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

document.getElementById('storyModal').addEventListener('click', (e) => {
    if (e.target.id === 'storyModal') closeModal();
});

// ============ Mouse & Touch Controls ============
const scene = document.querySelector('.scene');

// Desktop Mouse Events
document.addEventListener("mousedown", e => {
    if (e.target.closest('.card')) return;
    isDragging = true;
    startX = e.clientX;
});

document.addEventListener("mousemove", e => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    angle += deltaX * 0.1;
    startX = e.clientX;
    update();
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});

// Mobile Touch Events - bind to scene for better control
if (scene) {
    scene.addEventListener("touchstart", e => {
        if (e.target.closest('.card')) return;
        isDragging = true;
        startX = e.touches[0].clientX;
        e.preventDefault();
    }, { passive: false });

    scene.addEventListener("touchmove", e => {
        if (!isDragging) return;
        if (!e.touches || e.touches.length === 0) return;
        const deltaX = e.touches[0].clientX - startX;
        angle += deltaX * 0.1;
        startX = e.touches[0].clientX;
        update();
        e.preventDefault();
    }, { passive: false });

    scene.addEventListener("touchend", e => {
        isDragging = false;
        e.preventDefault();
    }, { passive: false });

    scene.addEventListener("touchcancel", e => {
        isDragging = false;
    }, { passive: false });
}

// ============ Auto Rotate ============
setInterval(() => {
    if (!isDragging) {
        angle -= 0.15;
        update();
    }
}, 16);

function update() {
    const carouselEl = document.getElementById("carousel");
    if (carouselEl) carouselEl.style.transform = `rotateY(${angle}deg)`;
}

// ============ Keyboard Controls ============
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});

});