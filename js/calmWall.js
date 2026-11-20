/**
 * ZenZone Campus Calm Wall - Peer Solidarity Bulletin Board
 * Allows students to share short anonymous notes of encouragement during exams.
 */

class CalmWallController {
  constructor() {
    this.posts = [];
    this.initDOM();
    this.loadPosts();
  }

  initDOM() {
    this.form = document.getElementById('calmWallForm');
    this.authorInput = document.getElementById('wallAuthorInput');
    this.tagInput = document.getElementById('wallTagInput');
    this.msgInput = document.getElementById('wallMsgInput');
    this.grid = document.getElementById('calmWallGrid');

    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  async loadPosts() {
    if (!window.apiService) return;
    this.posts = await window.apiService.getCalmWall();
    this.renderPosts();
  }

  renderPosts() {
    if (!this.grid) return;

    if (!this.posts.length) {
      this.grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No solidarity messages yet. Be the first to share an encouraging note!</p>`;
      return;
    }

    this.grid.innerHTML = this.posts.map(post => {
      const d = new Date(post.createdAt || Date.now());
      const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

      return `
        <div class="calm-note-card">
          <div style="margin-bottom: 0.65rem;">
            <span class="badge badge-sage" style="font-size: 0.75rem;">${post.tag || 'Solidarity'}</span>
          </div>
          <div class="calm-note-msg">"${post.message}"</div>
          <div class="calm-note-footer">
            <span>— ${post.author || 'Anonymous'}</span>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <small>${dateStr}</small>
              <button class="like-heart-btn" onclick="window.calmWall.likePost('${post.id}')" title="Send support">
                ❤️ <span>${post.likes || 0}</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  async handleSubmit(e) {
    e.preventDefault();

    const author = this.authorInput ? this.authorInput.value.trim() : '';
    const tag = this.tagInput ? this.tagInput.value.trim() : '';
    const message = this.msgInput ? this.msgInput.value.trim() : '';

    if (!message || message.length < 3) {
      alert('Please enter a message of at least 3 characters.');
      return;
    }

    if (window.apiService) {
      const newPost = await window.apiService.postCalmNote({
        author: author || 'Anonymous Student',
        tag: tag || 'Encouragement',
        message
      });

      if (newPost) {
        if (this.msgInput) this.msgInput.value = '';
        this.loadPosts();
      }
    }
  }

  async likePost(id) {
    if (window.apiService) {
      const updated = await window.apiService.likeCalmNote(id);
      if (updated) {
        const item = this.posts.find(p => p.id === id);
        if (item) item.likes = updated.likes;
        this.renderPosts();
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.calmWall = new CalmWallController();
});
