// ===== GSAP & ScrollTrigger =====
gsap.registerPlugin(ScrollTrigger);

// ===== Three.js Particles =====
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create particles
const particlesCount = 1500;
const positions = new Float32Array(particlesCount * 3);
const colors = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 15;
    positions[i + 1] = (Math.random() - 0.5) * 15;
    positions[i + 2] = (Math.random() - 0.5) * 15;
    
    // Mix of accent colors
    const colorChoice = Math.random();
    if (colorChoice < 0.5) {
        colors[i] = 0.39; colors[i + 1] = 0.4; colors[i + 2] = 0.95; // Indigo
    } else if (colorChoice < 0.8) {
        colors[i] = 0.02; colors[i + 1] = 0.71; colors[i + 2] = 0.83; // Cyan
    } else {
        colors[i] = 0.06; colors[i + 1] = 0.73; colors[i + 2] = 0.51; // Green
    }
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
    size: 0.03,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

camera.position.z = 5;

// Mouse tracking for parallax
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    particles.rotation.x += 0.0003;
    particles.rotation.y += 0.0005;
    
    // Parallax
    particles.position.x += (mouseX * 0.5 - particles.position.x) * 0.02;
    particles.position.y += (mouseY * 0.5 - particles.position.y) * 0.02;
    
    renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ===== Navigation =====
const nav = document.querySelector('.nav');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
});

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ===== Cell Animations =====
const cells = document.querySelectorAll('.cell');

cells.forEach((cell, index) => {
    gsap.to(cell, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: index * 0.08,
        ease: 'power3.out'
    });
});

// ===== Scroll Animations =====
gsap.utils.toArray('.exp-item, .project-card, .skill-cell').forEach((el, i) => {
    gsap.from(el, {
        scrollTrigger: {
            trigger: el,
            start: 'top 85%',
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        delay: i * 0.05
    });
});

// ===== Stat Counter =====
const statNums = document.querySelectorAll('.stat-num');

const countUp = (el) => {
    const target = parseInt(el.dataset.target);
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;
    
    const update = () => {
        current += step;
        if (current < target) {
            el.textContent = Math.floor(current);
            requestAnimationFrame(update);
        } else {
            el.textContent = target;
        }
    };
    update();
};

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            countUp(entry.target);
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNums.forEach(stat => statObserver.observe(stat));

// ===== Typing Effect =====
const roleText = document.querySelector('.role-text');
const roles = [
    'ML pipelines',
    'data warehouses',
    'predictive models',
    'ETL systems',
    'dashboards',
    'insights from chaos'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeRole() {
    const current = roles[roleIndex];
    
    if (isDeleting) {
        roleText.textContent = current.substring(0, charIndex - 1);
        charIndex--;
    } else {
        roleText.textContent = current.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let speed = isDeleting ? 40 : 80;
    
    if (!isDeleting && charIndex === current.length) {
        speed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 400;
    }
    
    setTimeout(typeRole, speed);
}

setTimeout(typeRole, 1500);

// ===== Project Cards Hover =====
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card.querySelector('.project-visual'), {
            scale: 1.05,
            duration: 0.3
        });
    });
    
    card.addEventListener('mouseleave', () => {
        gsap.to(card.querySelector('.project-visual'), {
            scale: 1,
            duration: 0.3
        });
    });
});

// ===== Skill Item Interaction =====
document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        gsap.to(item, {
            scale: 1.05,
            duration: 0.2
        });
    });
    
    item.addEventListener('mouseleave', () => {
        gsap.to(item, {
            scale: 1,
            duration: 0.2
        });
    });
});

// ===== Tech Marquee Pause on Hover =====
const techTrack = document.querySelector('.tech-track');

document.querySelector('.cell-tech').addEventListener('mouseenter', () => {
    techTrack.style.animationPlayState = 'paused';
});

document.querySelector('.cell-tech').addEventListener('mouseleave', () => {
    techTrack.style.animationPlayState = 'running';
});

// ===== Photo Tilt Effect =====
const photoCell = document.querySelector('.cell-photo');
const photoImg = photoCell.querySelector('img');

photoCell.addEventListener('mousemove', (e) => {
    const rect = photoCell.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xPercent = (x / rect.width - 0.5) * 2;
    const yPercent = (y / rect.height - 0.5) * 2;
    
    gsap.to(photoImg, {
        rotateY: xPercent * 10,
        rotateX: -yPercent * 10,
        duration: 0.3
    });
});

photoCell.addEventListener('mouseleave', () => {
    gsap.to(photoImg, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5
    });
});

// ===== Section Headers Animation =====
gsap.utils.toArray('section h2').forEach(h2 => {
    gsap.from(h2, {
        scrollTrigger: {
            trigger: h2,
            start: 'top 80%'
        },
        opacity: 0,
        x: -30,
        duration: 0.8
    });
});

// ===== Contact Card Hover =====
document.querySelectorAll('.contact-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
        gsap.to(link, {
            x: 10,
            duration: 0.2
        });
    });
    
    link.addEventListener('mouseleave', () => {
        gsap.to(link, {
            x: 0,
            duration: 0.2
        });
    });
});


// ===== Console =====
console.log(`
%c👋 Hey there!

%cThanks for checking out my portfolio.
Built with Three.js, GSAP, and curiosity.

Let's connect:
📧 arjun22.pulugu@gmail.com
💼 linkedin.com/in/arjunpulugu
🐙 github.com/Arjunreddypulugu
`, 
'color: #6366f1; font-size: 16px; font-weight: bold;',
'color: #888; font-size: 12px;'
);
