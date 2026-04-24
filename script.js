// ===== SYNTAXLAB - LIVE PROGRESS TRACKING (RESETS PER LANGUAGE PAGE) =====

document.addEventListener('DOMContentLoaded', function() {
    initProgressTracker();
    initSmoothScroll();
    addCardHoverEffects();
});

// Progress Tracker - Unique per language page using localStorage with page identifier
function initProgressTracker() {
    const progressFill = document.querySelector('.progress-fill');
    const percentSpan = document.querySelector('.progress-percent');
    const resetBtn = document.querySelector('.reset-btn');
    
    if (!progressFill) return;
    
    // Get current page name from URL or title
    let pageKey = getPageIdentifier();
    
    // Load saved viewed topics for THIS SPECIFIC PAGE only
    let storageKey = `syntaxlab_viewed_${pageKey}`;
    let viewedTopics = JSON.parse(localStorage.getItem(storageKey)) || [];
    
    // Get all topic sections
    const topics = document.querySelectorAll('.topic-section');
    if (topics.length === 0) return;
    
    // Mark previously viewed topics with visual indicator
    topics.forEach((topic, index) => {
        const topicId = `topic_${pageKey}_${index}`;
        topic.setAttribute('data-topic-id', topicId);
        
        if (viewedTopics.includes(topicId)) {
            topic.classList.add('viewed');
        }
    });
    
    // Update progress bar initially
    updateProgressBar(viewedTopics.length, topics.length, progressFill, percentSpan);
    
    // Intersection Observer to detect when topics come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const topic = entry.target;
                const topicId = topic.getAttribute('data-topic-id');
                
                if (topicId && !viewedTopics.includes(topicId)) {
                    viewedTopics.push(topicId);
                    localStorage.setItem(storageKey, JSON.stringify(viewedTopics));
                    topic.classList.add('viewed');
                    updateProgressBar(viewedTopics.length, topics.length, progressFill, percentSpan);
                    showProgressToast(viewedTopics.length, topics.length);
                }
            }
        });
    }, { threshold: 0.6 });
    
    topics.forEach(topic => {
        observer.observe(topic);
    });
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('⚠️ Reset all progress for this language? Your viewed topics will be cleared.')) {
                localStorage.removeItem(storageKey);
                topics.forEach(topic => {
                    topic.classList.remove('viewed');
                });
                updateProgressBar(0, topics.length, progressFill, percentSpan);
                showResetMessage();
            }
        });
    }
}

function getPageIdentifier() {
    const path = window.location.pathname;
    const pageName = path.split('/').pop().replace('.html', '');
    return pageName || 'home';
}

function updateProgressBar(viewed, total, progressFill, percentSpan) {
    if (progressFill) {
        const percent = total > 0 ? (viewed / total) * 100 : 0;
        progressFill.style.width = percent + '%';
        
        if (percentSpan) {
            percentSpan.innerText = Math.round(percent) + '%';
        }
        
        if (percent === 100) {
            progressFill.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
        } else {
            progressFill.style.background = 'linear-gradient(90deg, #6366f1, #ec4899)';
        }
    }
}

function showProgressToast(viewed, total) {
    const toast = document.createElement('div');
    toast.innerHTML = `
        <div style="position: fixed; bottom: 20px; right: 20px; background: linear-gradient(135deg, #6366f1, #ec4899); 
                    color: white; padding: 12px 20px; border-radius: 12px; font-size: 0.85rem; 
                    font-weight: 500; z-index: 9999; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    animation: slideIn 0.3s ease;">
            📚 Progress: ${viewed}/${total} topics completed!
        </div>
        <style>
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        </style>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

function showResetMessage() {
    const message = document.createElement('div');
    message.innerHTML = `
        <div style="position: fixed; bottom: 20px; right: 20px; background: #1e1e2e; 
                    color: white; padding: 12px 20px; border-radius: 12px; font-size: 0.85rem; 
                    z-index: 9999; box-shadow: 0 4px 15px rgba(0,0,0,0.2); border-left: 4px solid #ef4444;">
            🔄 Progress reset to 0%! Start learning again.
        </div>
    `;
    document.body.appendChild(message);
    setTimeout(() => {
        message.style.opacity = '0';
        message.style.transition = 'opacity 0.3s';
        setTimeout(() => message.remove(), 300);
    }, 2000);
}

function initSmoothScroll() {
    const topicLinks = document.querySelectorAll('.topic-list li');
    topicLinks.forEach((item, idx) => {
        item.addEventListener('click', () => {
            const targetSection = document.querySelectorAll('.topic-section')[idx];
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                targetSection.style.transition = '0.3s';
                targetSection.style.backgroundColor = 'rgba(99, 102, 241, 0.08)';
                setTimeout(() => {
                    targetSection.style.backgroundColor = '';
                }, 800);
            }
        });
    });
}

function addCardHoverEffects() {
    const cards = document.querySelectorAll('.lang-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-12px) scale(1.02)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}