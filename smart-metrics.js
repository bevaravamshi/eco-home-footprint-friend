
document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
    
    // Animate metric cards on hover
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Animate timeline items on scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    function animateTimelineItems() {
        timelineItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, index * 100);
            }
        });
    }
    
    // Initialize timeline animation
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    window.addEventListener('scroll', animateTimelineItems);
    animateTimelineItems(); // Run once on load
    
    // Counter animation for metric values
    function animateCounters() {
        const metricValues = document.querySelectorAll('.metric-value');
        
        metricValues.forEach(value => {
            const text = value.textContent;
            const number = parseInt(text.match(/\d+/)?.[0]);
            
            if (number && !value.dataset.animated) {
                value.dataset.animated = 'true';
                let current = 0;
                const increment = number / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= number) {
                        current = number;
                        clearInterval(timer);
                    }
                    value.textContent = text.replace(/\d+/, Math.floor(current));
                }, 30);
            }
        });
    }
    
    // Intersection Observer for metric cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                animateCounters();
            }
        });
    });
    
    // Initialize metric cards animation
    const allCards = document.querySelectorAll('.metric-card, .metric-category, .assessment-category');
    allCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Smooth scrolling for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add click effect to buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
    
    // Progress indicator for timeline
    function updateTimelineProgress() {
        const timeline = document.querySelector('.timeline-section');
        if (!timeline) return;
        
        const rect = timeline.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / rect.height));
        
        timelineItems.forEach((item, index) => {
            const itemProgress = (index + 1) / timelineItems.length;
            if (progress >= itemProgress) {
                item.classList.add('completed');
            } else {
                item.classList.remove('completed');
            }
        });
    }
    
    window.addEventListener('scroll', updateTimelineProgress);
    updateTimelineProgress();
    
    // Add keyboard navigation for tabs
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const activeTab = document.querySelector('.tab-button.active');
            const tabsArray = Array.from(tabButtons);
            const currentIndex = tabsArray.indexOf(activeTab);
            
            let newIndex;
            if (e.key === 'ArrowLeft') {
                newIndex = currentIndex > 0 ? currentIndex - 1 : tabsArray.length - 1;
            } else {
                newIndex = currentIndex < tabsArray.length - 1 ? currentIndex + 1 : 0;
            }
            
            tabsArray[newIndex].click();
        }
    });
    
    console.log('SMART Metrics Dashboard loaded successfully!');
});
