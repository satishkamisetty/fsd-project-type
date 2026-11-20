import React, { useState } from 'react';

export const AboutContact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'general', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: 'general', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <>
      <section className="section bg-light" style={{ padding: '4rem 0 3rem' }}>
        <div className="container text-center">
          <span className="section-tag">About & Support</span>
          <h1 className="section-title">Connect with ZenZone</h1>
          <p className="section-subtitle">
            Discover our founding story and holistic wellness philosophy, or reach out to our team for questions and feedback.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="section">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center', gap: '4rem', marginBottom: '5rem' }}>
            <div>
              <span className="badge badge-sage" style={{ marginBottom: '1rem' }}>The Mission</span>
              <h2 style={{ marginBottom: '1.25rem' }}>Democratizing Mindful Movement for Beginners</h2>
              <p style={{ marginBottom: '1.2rem' }}>
                Modern life often forces people into perpetual high-stress alert states. ZenZone was born out of a simple conviction: wellness should never feel intimidating, expensive, or overly complex.
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                Whether taking your first conscious deep breath in a 4-second box cycle, mastering spinal alignment in Mountain Pose, or dedicating 5 quiet minutes to morning meditation, ZenZone offers a distraction-free, aesthetically serene companion for your personal journey.
              </p>
              <div className="hero-stats" style={{ paddingTop: '1.5rem' }}>
                <div className="stat-item">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Accessible</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">Zero</span>
                  <span className="stat-label">Distractions</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">Daily</span>
                  <span className="stat-label">Mindfulness</span>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--color-sage-soft)', borderRadius: 'var(--radius-lg)', padding: '3rem', border: '1px solid var(--color-border)', textAlign: 'center' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🌿</div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--color-forest)' }}>The ZenZone Philosophy</h3>
              <p style={{ fontStyle: 'italic', color: 'var(--color-charcoal)', lineHeight: 1.8 }}>
                "Yoga does not just change the way we see things, it transforms the person who sees. When breath and awareness unite, balance follows naturally."
              </p>
              <div style={{ marginTop: '1.5rem', fontWeight: 600, color: 'var(--color-forest)' }}>– Mindful Living Principles</div>
            </div>
          </div>

          {/* Contact & FAQ Grid */}
          <div className="grid grid-2" style={{ gap: '3.5rem', alignItems: 'flex-start' }}>
            <div className="contact-form">
              <h3 style={{ marginBottom: '0.5rem' }}>Send Us a Message</h3>
              <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>Fill out this form and our support team will reply within 24 hours.</p>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Maya Sharma" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="maya@example.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Inquiry Type</label>
                  <select 
                    className="form-control"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option value="general">General Inquiry</option>
                    <option value="yoga">Yoga Pose Guidance</option>
                    <option value="meditation">Meditation & Timer Question</option>
                    <option value="feedback">Website Feedback</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Your Message *</label>
                  <textarea 
                    className="form-control" 
                    placeholder="Share your mindful journey or ask a question..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required 
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Send Message
                </button>
              </form>

              {submitted && (
                <div style={{ background: '#e1efe2', color: '#2e693b', padding: '1rem', borderRadius: 'var(--radius-sm)', marginTop: '1rem', fontSize: '0.95rem', border: '1px solid #b5d8b8' }}>
                  ✓ Thank you! Your message has been received. Have a peaceful day!
                </div>
              )}
            </div>

            <div>
              <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', padding: '2.2rem', boxShadow: 'var(--shadow-sm)', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.25rem' }}>Contact Information</h3>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '1.5rem' }}>📧</div>
                  <div>
                    <strong style={{ color: 'var(--color-forest)' }}>Email Support</strong>
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>support@zenzone-wellness.org</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '1.5rem' }}>📍</div>
                  <div>
                    <strong style={{ color: 'var(--color-forest)' }}>Location</strong>
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>ZenZone Mindful Lab, Peace Avenue</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem' }}>🕒</div>
                  <div>
                    <strong style={{ color: 'var(--color-forest)' }}>Operating Hours</strong>
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>Monday – Friday: 06:00 AM – 08:00 PM (IST)</p>
                  </div>
                </div>
              </div>

              <h3 style={{ marginBottom: '1rem' }}>Frequently Asked Questions</h3>
              <div>
                <div style={{ background: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', overflow: 'hidden' }}>
                  <button 
                    onClick={() => toggleFaq(0)}
                    style={{ width: '100%', padding: '1.25rem 1.5rem', background: 'none', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontSize: '1rem', fontWeight: 600, color: 'var(--color-charcoal)', textAlign: 'left' }}
                  >
                    Is ZenZone suitable for complete beginners?
                    <span>{openFaq === 0 ? '▲' : '▼'}</span>
                  </button>
                  {openFaq === 0 && (
                    <div style={{ padding: '0 1.5rem 1.25rem', color: 'var(--color-charcoal-light)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      Yes! Every pose includes difficulty tags (Beginner, Intermediate), duration recommendations, and gentle step-by-step alignment cues.
                    </div>
                  )}
                </div>

                <div style={{ background: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', overflow: 'hidden' }}>
                  <button 
                    onClick={() => toggleFaq(1)}
                    style={{ width: '100%', padding: '1.25rem 1.5rem', background: 'none', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontSize: '1rem', fontWeight: 600, color: 'var(--color-charcoal)', textAlign: 'left' }}
                  >
                    How often should I practice Box Breathing?
                    <span>{openFaq === 1 ? '▲' : '▼'}</span>
                  </button>
                  {openFaq === 1 && (
                    <div style={{ padding: '0 1.5rem 1.25rem', color: 'var(--color-charcoal-light)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      Practicing 4 to 8 cycles (2 to 3 minutes) once or twice daily, or whenever you encounter acute stress, helps regulate your nervous system effectively.
                    </div>
                  )}
                </div>

                <div style={{ background: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', overflow: 'hidden' }}>
                  <button 
                    onClick={() => toggleFaq(2)}
                    style={{ width: '100%', padding: '1.25rem 1.5rem', background: 'none', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontSize: '1rem', fontWeight: 600, color: 'var(--color-charcoal)', textAlign: 'left' }}
                  >
                    Does the meditation timer work offline?
                    <span>{openFaq === 2 ? '▲' : '▼'}</span>
                  </button>
                  {openFaq === 2 && (
                    <div style={{ padding: '0 1.5rem 1.25rem', color: 'var(--color-charcoal-light)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      Yes! Both the timer and session log use standard browser Web APIs and LocalStorage, meaning full functionality even without internet access.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
