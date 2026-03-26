import { Link } from "react-router-dom";
import {
  Blocks,
  Sparkles,
  ListChecks,
  Search,
  Heart,
  Shield,
  Leaf,
  MapPin,
  Star,
  Calendar,
  BellRing,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav-left">
          <Blocks size={24} color="#FF6B6B" />
          <span className="landing-logo-text">ToyShare</span>
        </div>
        <div className="landing-nav-center">
          <a href="#how-it-works">How It Works</a>
          <a href="#features">Features</a>
          <a href="#testimonials">Testimonials</a>
        </div>
        <div className="landing-nav-right">
          <Link to="/login" className="nav-link">Log In</Link>
          <Link to="/register" className="btn-primary-sm">Sign Up Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">
          <Sparkles size={16} />
          <span>Sharing Joy, One Toy at a Time</span>
        </div>
        <h1>Give Toys a Second Life.<br />Share the Fun.</h1>
        <p className="hero-sub">
          Connect with local families to share, borrow, and discover toys your
          kids will love — sustainably and for free.
        </p>
        <div className="hero-btns">
          <Link to="/register" className="btn-primary">Get Started Free</Link>
          <a href="#how-it-works" className="btn-secondary">Learn More</a>
        </div>
        <div className="hero-stats">
          <span><strong>5,000+</strong> Families</span>
          <span className="dot">·</span>
          <span><strong>12,000+</strong> Toys Shared</span>
          <span className="dot">·</span>
          <span><strong>98%</strong> Satisfaction</span>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section">
        <span className="section-badge green">How It Works</span>
        <h2>Share & Borrow in 3 Simple Steps</h2>
        <div className="steps-grid">
          {[
            { num: "1", title: "List Your Toys", desc: "Add toys you'd like to share with photos, age range, and condition.", color: "#FF6B6B" },
            { num: "2", title: "Browse & Borrow", desc: "Find toys nearby, check availability, and borrow with one click.", color: "#6366F1" },
            { num: "3", title: "Share the Joy", desc: "Return when done, leave a review, and keep the cycle going.", color: "#22C55E" },
          ].map((step) => (
            <div className="step-card" key={step.num}>
              <div className="step-num" style={{ backgroundColor: step.color }}>{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section gray">
        <span className="section-badge indigo">Features</span>
        <h2>Everything You Need to Share</h2>
        <div className="features-grid">
          {[
            { icon: Shield, title: "Trusted Community", desc: "Verified profiles and ratings ensure safe sharing.", bg: "#EEF2FF", color: "#6366F1" },
            { icon: Leaf, title: "Eco-Friendly", desc: "Reduce waste by sharing instead of buying new.", bg: "#F0FDF4", color: "#22C55E" },
            { icon: MapPin, title: "Nearby Sharing", desc: "Find families in your neighborhood to share with.", bg: "#FFF0F0", color: "#FF6B6B" },
            { icon: Star, title: "Rating & Reviews", desc: "Rate your experience and help others find great sharers.", bg: "#FFFBEB", color: "#FCD34D" },
            { icon: Calendar, title: "Flexible Borrowing", desc: "Set custom borrow periods and extend when needed.", bg: "#FFF0F0", color: "#FF6B6B" },
            { icon: BellRing, title: "Smart Notifications", desc: "Get reminded about return dates and new toys nearby.", bg: "#F0FDF4", color: "#22C55E" },
          ].map(({ icon: Icon, title, desc, bg, color }) => (
            <div className="feature-card" key={title}>
              <div className="feature-icon" style={{ backgroundColor: bg }}>
                <Icon size={22} color={color} />
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="section">
        <span className="section-badge green">💬 Testimonials</span>
        <h2>Loved by Families Everywhere</h2>
        <p className="section-sub">See what parents are saying about ToyShare</p>
        <div className="testimonials-grid">
          {[
            { quote: "ToyShare has been amazing for our family. My kids love trying new toys, and I love that we're not adding to the landfill!", name: "Sarah Anderson", role: "Mother of 2, Hanoi", color: "#FF6B6B" },
            { quote: "Such a brilliant concept! We've saved so much money and our apartment isn't overflowing with toys anymore.", name: "Mai Nguyen", role: "Parent, Ho Chi Minh City", color: "#6366F1" },
            { quote: "The rating system gives me confidence in who I'm sharing with. Highly recommend to every parent!", name: "David Tran", role: "Father of 3, Da Nang", color: "#22C55E" },
          ].map((t) => (
            <div className="testimonial-card" key={t.name}>
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"{t.quote}"</p>
              <div className="testimonial-author">
                <div className="avatar" style={{ backgroundColor: t.color }}>
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Banner */}
      <section className="stats-banner">
        <div><strong>5,000+</strong><span>Happy Families</span></div>
        <div><strong>12,000+</strong><span>Toys Shared</span></div>
        <div><strong>25,000+</strong><span>Borrows Completed</span></div>
        <div><strong>98%</strong><span>Satisfaction Rate</span></div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to Start Sharing?</h2>
        <p>Join thousands of families already sharing the joy. It's free to get started — no credit card required.</p>
        <div className="cta-btns">
          <Link to="/register" className="btn-primary">Create Free Account</Link>
          <a href="#how-it-works" className="btn-secondary">Learn More</a>
        </div>
        <small>✨ Free forever for personal use</small>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <Blocks size={24} color="#FF6B6B" />
              <span>ToyShare</span>
            </div>
            <p>Making toy sharing easy, safe, and fun for families everywhere.</p>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#testimonials">Testimonials</a>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 ToyShare. All rights reserved.</span>
          <div className="footer-social">
            <a href="#">Facebook</a>
            <a href="#">Twitter</a>
            <a href="#">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
