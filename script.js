// ===== SYNTAXLAB - INTERACTIVE FEATURES =====
// Progress tracking and smooth scrolling

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. PROGRESS INDICATOR: Track how many topics are viewed
    initProgressTracker();
    
    // 2. SMOOTH SCROLL for topic clicks
    initSmoothScroll();
    
    // 3. Add hover sound effect or just animations (light)
    addCardHoverEffects();
    
    // 4. Animated counter for fun (optional)
    animateStats();
});

// Progress Tracker Function
function initProgressTracker() {
    const progressFill = document.querySelector('.progress-fill');
    if (!progressFill) return;
    
    // Get all topic sections
    const topics = document.querySelectorAll('.topic-section');
    if (topics.length === 0) return;
    
    // Use localStorage to remember which topics were viewed
    let viewedTopics = JSON.parse(localStorage.getItem('syntaxlab_viewed')) || [];
    
    // Mark topics as viewed when they come into viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const topicId = entry.target.getAttribute('data-topic-id');
                if (topicId && !viewedTopics.includes(topicId)) {
                    viewedTopics.push(topicId);
                    localStorage.setItem('syntaxlab_viewed', JSON.stringify(viewedTopics));
                    updateProgressBar(viewedTopics.length, topics.length);
                }
            }
        });
    }, { threshold: 0.5 });
    
    // Assign IDs to each topic section and observe
    topics.forEach((topic, index) => {
        const topicId = `topic_${index}`;
        topic.setAttribute('data-topic-id', topicId);
        observer.observe(topic);
        
        // If previously viewed, mark
        if (viewedTopics.includes(topicId)) {
            topic.style.borderLeft = '3px solid #667eea';
        }
    });
    
    // Initial progress update
    updateProgressBar(viewedTopics.length, topics.length);
}

function updateProgressBar(viewed, total) {
    const progressFill = document.querySelector('.progress-fill');
    const percentSpan = document.querySelector('.progress-percent');
    if (progressFill) {
        const percent = (viewed / total) * 100;
        progressFill.style.width = percent + '%';
        if (percentSpan) percentSpan.innerText = Math.round(percent) + '%';
    }
}

// Smooth scroll when clicking on sidebar topics
function initSmoothScroll() {
    const topicLinks = document.querySelectorAll('.topic-list li');
    topicLinks.forEach((item, idx) => {
        item.addEventListener('click', () => {
            const targetSection = document.querySelectorAll('.topic-section')[idx];
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Highlight effect
                targetSection.style.transition = '0.3s';
                targetSection.style.backgroundColor = 'rgba(102, 126, 234, 0.2)';
                setTimeout(() => {
                    targetSection.style.backgroundColor = 'transparent';
                }, 800);
            }
        });
    });
}

// Card hover enhanced animations
function addCardHoverEffects() {
    const cards = document.querySelectorAll('.lang-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Just a fun stat effect on home page
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length) {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.innerText = target;
                    clearInterval(timer);
                } else {
                    stat.innerText = Math.floor(current);
                }
            }, 30);
        });
    }
}

// Optional: Clear progress button (if exists)
function resetProgress() {
    if(confirm('Reset learning progress for this language?')) {
        localStorage.removeItem('syntaxlab_viewed');
        location.reload();
    }
}