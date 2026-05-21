// Initialize Icons
lucide.createIcons();

// Scroll Animations (Intersection Observer)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.slide-up').forEach(section => {
    observer.observe(section);
});

// Cursor Tracking Glow Effect for buttons
document.querySelectorAll('.btn, .glass-card').forEach(el => {
    el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        el.style.setProperty('--x', `${x}px`);
        el.style.setProperty('--y', `${y}px`);
    });
});

// Interactive Terminal Logic
function typeTerminal(textStr) {
    const termLine = document.getElementById('term-dynamic-line');
    const termOutput = document.getElementById('term-dynamic-output');
    const typer = document.getElementById('term-typer');
    const options = document.getElementById('term-options');
    
    // Hide options while loading
    options.classList.add('hidden');
    termLine.classList.remove('hidden');
    termOutput.classList.add('hidden');
    typer.textContent = '';
    
    let i = 0;
    const command = "./execute_module";
    
    // Glitch sound or visual cue could logically go here
    document.querySelector('.terminal-wrapper').style.borderColor = "var(--accent-red)";
    
    // Type the command first
    const typeCommand = setInterval(() => {
        if (i < command.length) {
            typer.textContent += command.charAt(i);
            i++;
        } else {
            clearInterval(typeCommand);
            // Simulate processing time
            setTimeout(() => {
                termOutput.innerHTML = textStr.replace(/\n/g, '<br><br>');
                termOutput.classList.remove('hidden');
                
                // Show options again after a delay
                setTimeout(() => {
                    options.classList.remove('hidden');
                    document.querySelector('.terminal-wrapper').style.borderColor = "#333";
                }, 800);
            }, 300);
        }
    }, 40);
}

// ARGUS Telemetry Simulation (Redesigned for Black/Red theme)
function simulateTelemetry() {
    const logOutput = document.getElementById('telemetry-log');
    if (!logOutput) return;
    const sensors = ['00A1', '00A2', '00B1', '00C9'];
    const statuses = ['NOMINAL', 'NOMINAL', 'OFFLINE', 'BREACH'];
    
    setInterval(() => {
        const sensor = sensors[Math.floor(Math.random() * sensors.length)];
        const rainfall = (Math.random() * 8).toFixed(2);
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        let color = '#f0f0f0';
        if (status === 'BREACH' || parseFloat(rainfall) > 5.0) {
            color = '#ff2a2a'; // critical red
        } else if (status === 'OFFLINE') {
            color = '#888888'; // dims
        }
        
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second: "numeric", fractionalSecondDigits: 3 });
        
        const packet = `> [${timestamp}] RECV SRC_${sensor} <br>
                        &nbsp;&nbsp;DP: <span style="color: ${color}">${rainfall}mm</span> | STS: <span style="color: ${color}">${status}</span>`;
                        
        logOutput.innerHTML = packet;
        
        // Randomly trigger a glitch on the map
        if(status === 'BREACH') {
            document.querySelector('.argus-telemetry-ui').classList.add('glitch-hover');
            setTimeout(() => {
                document.querySelector('.argus-telemetry-ui').classList.remove('glitch-hover');
            }, 500);
        }
    }, 2500);
}

// Start simulation on load
window.addEventListener('DOMContentLoaded', () => {
    simulateTelemetry();
    init3DTilt();
});

// 3D Tilt Logic for Profile Image
function init3DTilt() {
    const tiltElement = document.getElementById('tilt-element');
    const tiltWrapper = document.querySelector('.tilt-wrapper');
    
    if (tiltElement && tiltWrapper) {
        tiltWrapper.addEventListener('mousemove', (e) => {
            const rect = tiltElement.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top; // y position within the element
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -15; // Max rotation 15deg
            const rotateY = ((x - centerX) / centerX) * 15;
            
            tiltElement.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        tiltWrapper.addEventListener('mouseleave', () => {
            tiltElement.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            tiltElement.style.transition = 'transform 0.5s ease-out';
        });
        
        tiltWrapper.addEventListener('mouseenter', () => {
            tiltElement.style.transition = 'transform 0.1s ease-out';
        });
    }
}

// Modal Logic
const modal = document.getElementById('project-modal');
if (modal) {
    const modalClose = document.getElementById('modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalGallery = document.getElementById('modal-gallery');
    const modalPdfContainer = document.getElementById('modal-pdf-container');
    
    document.querySelectorAll('.clickable-card').forEach(card => {
        card.addEventListener('click', () => {
            modalTitle.textContent = card.getAttribute('data-title') || 'Project';
            modalDesc.textContent = card.getAttribute('data-desc') || '';
            
            // Clear content
            modalGallery.innerHTML = '';
            modalPdfContainer.innerHTML = '';
            modalPdfContainer.style.display = 'none';
            
            // Handle PDF
            const pdfUrl = card.getAttribute('data-pdf');
            if (pdfUrl) {
                modalPdfContainer.style.display = 'block';
                modalPdfContainer.innerHTML = `<iframe src="${pdfUrl}" width="100%" height="100%" style="border:none;"></iframe>`;
            }
            
            // Handle Images
            const images = card.getAttribute('data-images');
            if (images) {
                const imgArray = images.split(',');
                imgArray.forEach(src => {
                    if(src.trim()) {
                        const img = document.createElement('img');
                        img.src = src.trim();
                        img.onerror = () => { img.style.display = 'none'; }; // fallback if image doesn't exist
                        modalGallery.appendChild(img);
                    }
                });
            }
            
            modal.classList.add('active');
        });
    });
    
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
        // Clear iframe to stop resources
        setTimeout(() => { modalPdfContainer.innerHTML = ''; }, 300);
    });
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            setTimeout(() => { modalPdfContainer.innerHTML = ''; }, 300);
        }
    });
}
