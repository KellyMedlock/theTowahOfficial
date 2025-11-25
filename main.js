window.addEventListener("load", () => {
    window.scrollTo(0, document.body.scrollHeight);
})

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function getScrollInfo() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const y = window.scrollY || window.pageYOffset || 0;
    return { y, max };
}

function getClimbProgress() {
    const { y, max } = getScrollInfo();
    if (max <= 0) return 1;
    return clamp(1 - y / max, 0, 1)
}

const tower = document.querySelector('.tower');
const floors = Array.from(document.querySelectorAll('.floor'));
const markersList = document.querySelector('.markers');
const fill = document.querySelector('.progressFill');
const percentEl = document.querySelector('.percentValue');
const btnTop = document.querySelector('.toTop');
const btnBottom = document.querySelector('.toBottom');

function buildMarkers() {
    markersList.innerHTML = '';
    const n = floors.length;

    floors.forEach((floor, i) => {
        const li = document.createElement('li');
        li.className = 'marker';

        const ratio = i / (n - 1 || 1);
        const pos = ratio * 100;
        li.style.setProperty('--pos', `${pos}%`);
        
        const dot = document.createElement('button');
        dot.className = 'markerDot';
        dot.type = 'button';
        dot.title = floor.dataset.label || `Level ${n - i}`;

        const label = document.createElement('span');
        label.className = 'markerLabel';
        if (i == 0) {
            label.textContent = floor.dataset.label || `Interact`;
        } else if (i == 1) {
            label.textContent = floor.dataset.label || `Watch Now`;
        } else if (i == 2) {
            label.textContent = floor.dataset.label || `Learn More`;
        } else if (i == 3) {
            label.textContent = floor.dataset.label || `Welcome`;
        }

        li.appendChild(dot);
        li.appendChild(label);

        li.addEventListener('click', () => {
            floor.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        markersList.appendChild(li);
    });
}

let io;
function setupIntersection() {
    if (io) io.disconnect();

    io = new IntersectionObserver((entries) => {
        let best = null;
        for (const e of entries) {
            if (!best || e.intersectionRatio > best.intersectionRatio) best = e;
        }
        if (best) {
            const idx = floors.indexOf(best.target);
            markersList.querySelectorAll('.marker').forEach((m, i) => {
                m.classList.toggle('active', i === idx);
            });
        }
    }, {
        root: null,
        threshold: [...Array(11)].map((_, i) => i / 10)
    });

    floors.forEach(f => io.observe(f));
}

function updateProgressUI() {
    const p = getClimbProgress();
    fill.style.height = `${p * 100}%`;
    percentEl.textContent = Math.round(p * 5000);
}

btnTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth'});
});

btnBottom.addEventListener('click', () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth'});
})

window.addEventListener('resize', () => {
    updateProgressUI();
})

let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
            updateProgressUI();
            ticking = false;
        });
    }
});

window.addEventListener('load', () => {
    buildMarkers();
    setupIntersection();

    setTimeout(() => {
        window.scrollTo(0, document.documentElement.scrollHeight);
        updateProgressUI();
    }, 0);
});

const learnMoreBtn = document.querySelector(".learnMoreBtn");
const learnMore = document.querySelector('#floor2'); 
const watchNowBtn = document.querySelector(".watchNowBtn");
const watchNow = document.querySelector('#floor3'); 

learnMoreBtn.addEventListener('click', () => {
    learnMore.scrollIntoView({ behavior: "smooth", block: "start" });
});

watchNowBtn.addEventListener('click', () => {
    watchNow.scrollIntoView({ behavior: "smooth", block: "start" });
});