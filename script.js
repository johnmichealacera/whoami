// Simple thought management system
class ThoughtManager {
    constructor() {
        this.thoughts = this.loadThoughts();
        this.init();
    }

    init() {
        this.renderThoughts();
        this.bindEvents();
    }

    bindEvents() {
        const addBtn = document.getElementById('add-thought-btn');
        addBtn.addEventListener('click', () => this.showAddModal());

        // Modal events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideAddModal();
            }
        });

        const saveBtn = document.getElementById('save-thought');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveThought());
        }

        const cancelBtn = document.getElementById('cancel-thought');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.hideAddModal());
        }
    }

    loadThoughts() {
        // Load from localStorage or return default thoughts
        const saved = localStorage.getItem('personalThoughts');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Default thoughts to get started
        return [
            {
                text: "Sometimes I wonder if we're all just pretending to know what we're doing.",
                date: new Date().toISOString()
            },
            {
                text: "I am alive and awake brothers and sisters",
                date: new Date().toISOString()
            },
            {
                text: "The most profound moments happen in silence, between words.",
                date: new Date(Date.now() - 86400000).toISOString() // yesterday
            },
            {
                text: "I think we've forgotten how to be bored. And maybe that's a problem.",
                date: new Date(Date.now() - 172800000).toISOString() // day before yesterday
            }
        ];
    }

    saveThoughts() {
        localStorage.setItem('personalThoughts', JSON.stringify(this.thoughts));
    }

    renderThoughts() {
        const container = document.getElementById('thoughts-container');
        container.innerHTML = '';

        // Sort thoughts by date (newest first)
        const sortedThoughts = [...this.thoughts].sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedThoughts.forEach(thought => {
            const thoughtElement = document.createElement('div');
            thoughtElement.className = 'thought-item';
            
            const text = document.createElement('div');
            text.textContent = thought.text;
            
            const date = document.createElement('div');
            date.className = 'thought-date';
            date.textContent = this.formatDate(new Date(thought.date));
            
            thoughtElement.appendChild(text);
            thoughtElement.appendChild(date);
            container.appendChild(thoughtElement);
        });
    }

    formatDate(date) {
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            return 'today';
        } else if (diffDays === 2) {
            return 'yesterday';
        } else if (diffDays <= 7) {
            return `${diffDays - 1} days ago`;
        } else {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
            });
        }
    }

    showAddModal() {
        // Create modal if it doesn't exist
        if (!document.querySelector('.modal')) {
            this.createModal();
        }
        
        const modal = document.querySelector('.modal');
        const textarea = document.getElementById('thought-text');
        textarea.value = '';
        modal.style.display = 'block';
        textarea.focus();
    }

    hideAddModal() {
        const modal = document.querySelector('.modal');
        modal.style.display = 'none';
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>add a thought</h3>
                <textarea id="thought-text" placeholder="What's on your mind?"></textarea>
                <div class="modal-buttons">
                    <button id="cancel-thought">cancel</button>
                    <button id="save-thought" class="primary">save</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Re-bind events for new elements
        document.getElementById('save-thought').addEventListener('click', () => this.saveThought());
        document.getElementById('cancel-thought').addEventListener('click', () => this.hideAddModal());
    }

    saveThought() {
        const textarea = document.getElementById('thought-text');
        const text = textarea.value.trim();
        
        if (text) {
            const newThought = {
                text: text,
                date: new Date().toISOString()
            };
            
            this.thoughts.push(newThought);
            this.saveThoughts();
            this.renderThoughts();
            this.hideAddModal();
        }
    }
}

// Initialize the thought manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ThoughtManager();
    
    // Local "honor" indicator for returning visitors
    const firstVisitKey = 'jm_soul_first_visit';
    const firstVisit = localStorage.getItem(firstVisitKey);
    
    if (!firstVisit) {
        localStorage.setItem(firstVisitKey, new Date().toISOString());
        // Show a gentle welcome for first-time visitors
        setTimeout(() => {
            const welcome = document.createElement('div');
            welcome.className = 'welcome-note';
            welcome.textContent = 'Welcome to this space 🌱';
            document.body.appendChild(welcome);
            
            // Fade out after 3 seconds
            setTimeout(() => {
                welcome.style.opacity = '0';
                setTimeout(() => welcome.remove(), 500);
            }, 3000);
        }, 1000);
    } else {
        // Show subtle hint for returning visitors
        setTimeout(() => {
            const returnNote = document.createElement('div');
            returnNote.className = 'return-note';
            returnNote.textContent = 'You\'ve visited this space before. —JM';
            document.body.appendChild(returnNote);
            
            // Fade out after 4 seconds
            setTimeout(() => {
                returnNote.style.opacity = '0';
                setTimeout(() => returnNote.remove(), 500);
            }, 4000);
        }, 800);
    }
});

// Simple typing effect for the title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Uncomment the lines below if you want a typing effect for the title
// document.addEventListener('DOMContentLoaded', () => {
//     const title = document.querySelector('header h1');
//     const originalText = title.textContent;
//     setTimeout(() => typeWriter(title, originalText, 150), 500);
// });
