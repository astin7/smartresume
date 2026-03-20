import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const dashboardScale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1.05]);
  const dashboardY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  const fadeUp: Variants = {
    offscreen: { opacity: 0, y: 30 },
    onscreen: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", bounce: 0.2, duration: 0.8 } 
    }
  };

  return (
    <div className="home">
      
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-icon"></div>
            <span>ResumeAI</span>
          </div>
          <div className="nav-menu">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how" className="nav-link">How It Works</a>
            <a href="#pricing" className="nav-link">Pricing</a>
          </div>
          {/* Inside Home.tsx Navbar */}
          <div className="nav-actions">
            <Link to="/signup" className="nav-btn" style={{ textDecoration: 'none' }}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <div className="main-glow"></div>

      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        <div className="container">
          <motion.div className="badge" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="badge-dot"></span> In the making.
          </motion.div>

          <h1 className="hero-title">
            Analyze Resumes <br />
            <span className="text-gradient">With Precision.</span>
          </h1>

          <p className="hero-sub">
            Stop guessing. Use industrial-grade AI to optimize your resume for high-growth tech roles. Get hired faster with data-driven insights.
          </p>

          <div className="hero-actions">
            <button className="primary-btn">Start Free Analysis</button>
            <button className="secondary-btn">View Roadmap</button>
          </div>
        </div>

        {/* 3D DASHBOARD PREVIEW */}
        <motion.div className="hero-visual-container container" style={{ scale: dashboardScale, y: dashboardY }}>
          <div className="hero-dashboard-placeholder">
            <div className="dashboard-header">
              <div className="dot red"></div>
              <div className="dot yellow"></div>
              <div className="dot green"></div>
            </div>
            <div className="placeholder-content">AI Analysis Dashboard</div>
            <div className="dashboard-glow"></div>
          </div>
        </motion.div>
      </section>

      {/* Logo Ticker */}
      <div className="logo-ticker-section">
        <p className="ticker-label">TRUSTED BY ENGINEERING TEAMS AT</p>
        <div className="logo-flex">
          <span className="logo-item">Google</span>
          <span className="logo-item">Amazon</span>
          <span className="logo-item">Tesla</span>
          <span className="logo-item">CyberMonitor</span>
          <span className="logo-item">Palantir</span>
        </div>
      </div>

      {/* Benefirts Bento Grid */}
      <motion.section className="features container" initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.1 }}>
        
        {/* Benefit 1 */}
        <motion.div className="feature-card" variants={fadeUp}>
          <div className="card-text">
            <div className="icon-box">⚡</div>
            <h3>Lightning Fast</h3>
            <p>Stop waiting for human reviews. Get a comprehensive, actionable resume critique in under 5 seconds.</p>
          </div>
          <div className="card-visual-mockup big-graph"></div>
        </motion.div>

        {/* Benefit 2 */}
        <motion.div className="feature-card" variants={fadeUp}>
          <div className="card-text">
            <div className="icon-box">🤖</div>
            <h3>Beat the Bots</h3>
            <p>Guaranteed to parse perfectly. We optimize your format for Workday, Greenhouse, and Lever ATS systems.</p>
          </div>
          <div className="card-visual-mockup mini-bar"></div>
        </motion.div>

        {/* Benefit 3 */}
        <motion.div className="feature-card" variants={fadeUp}>
          <div className="card-text">
            <div className="icon-box">🔒</div>
            <h3>Privacy First</h3>
            <p>Your career data is yours. We process your PDF securely and never use your personal information to train our models.</p>
          </div>
        </motion.div>

        {/* Benefit 4 */}
        <motion.div className="feature-card" variants={fadeUp}>
          <div className="card-text">
            <div className="icon-box">📈</div>
            <h3>Proven Outcomes</h3>
            <p>Engineered strictly for high-growth tech roles. Join ambitious engineers landing interviews at top-tier companies.</p>
          </div>
          <div className="card-visual-mockup tips-grid"></div>
        </motion.div>

      </motion.section>

      {/* Feature Deep Dive Section */}
      <section id="features" className="container">
        
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Built to beat the <br /><span className="text-gradient">algorithm.</span>
          </h2>
          <p style={{ color: '#a1a1aa', fontSize: '1.25rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
            A deep dive into the engine that powers your next career move. 
            We don't just check for spelling; we analyze your exact fit.
          </p>
        </div>

        {/* Feature 1 */}
        <motion.div className="feature-row" initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.2 }} variants={fadeUp}>
          <div className="feature-text">
            <div className="icon-box">🎯</div>
            <h2>Contextual JD Alignment</h2>
            <p>
              Generic resumes get rejected. Our dual-input engine allows you to paste the exact job description of the role you want. 
              The AI then scans your experience layer-by-layer, identifying exactly which keywords and technical skills you are missing 
              compared to the employer's requirements.
            </p>
          </div>
          <div className="feature-image">
             <div className="big-graph" style={{ width: '100%', height: '100%', borderRadius: '24px' }}></div>
          </div>
        </motion.div>

        {/* Feature 2 (Reversed) */}
        <motion.div className="feature-row reverse" initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.2 }} variants={fadeUp}>
          <div className="feature-text">
            <div className="icon-box">📊</div>
            <h2>Granular Score Reports</h2>
            <p>
              Stop guessing if your resume is "good enough." You receive a comprehensive dashboard breaking down your match percentage.
              We provide specific subscores for ATS-readability, formatting, impact metrics, and technical keyword alignment.
            </p>
          </div>
          <div className="feature-image">
             <div className="mini-bar" style={{ position: 'absolute', bottom: '2rem', right: '2rem', width: '80%' }}></div>
          </div>
        </motion.div>

        {/* Feature 3 */}
        <motion.div className="feature-row" initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.2 }} variants={fadeUp}>
          <div className="feature-text">
            <div className="icon-box">🌐</div>
            <h2>Live Internship Feed</h2>
            <p>
              Connected directly to live tech job boards and aggregators. Browse open Software Engineering, Machine Learning, and Quant roles. 
              Find a role that fits, and instantly analyze your resume against it with a single click. No copy-pasting required.
            </p>
          </div>
          <div className="feature-image">
             <div className="feed-mockup" style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '80%', height: '80%' }}></div>
          </div>
        </motion.div>

      </section>

      {/* How it works */}
      <section id="how" className="how-it-works">
        <div className="container"> 
          <div className="section-header">
            <h2>How It Works</h2>
            <p>From blank page to accepted offer in three simple steps.</p>
          </div>

          <div className="steps-container">
            {/* Step 1 */}
            <motion.div className="step-card" variants={fadeUp} initial="offscreen" whileInView="onscreen" viewport={{ once: true }}>
              <div className="step-number">01</div>
              <h3>Find a Role</h3>
              <p>Browse our live feed of tech internships or manually paste a job description from any site.</p>
            </motion.div>

            {/* Step 2 */}
            <motion.div className="step-card" variants={fadeUp} initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.2 }}>
              <div className="step-number">02</div>
              <h3>Upload & Scan</h3>
              <p>Drop in your resume PDF. Our AI reads it exactly like a corporate Applicant Tracking System (ATS) would.</p>
            </motion.div>

            {/* Step 3 */}
            <motion.div className="step-card" variants={fadeUp} initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.4 }}>
              <div className="step-number">03</div>
              <h3>Fix & Dominate</h3>
              <p>Get your alignment score and follow the exact instructions to rewrite weak bullet points before you apply.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing container">
        <div className="container"> 
          <div className="section-header">
            <h2>Ready to get hired?</h2>
            <p>Choose the plan that fits your career goals.</p>
          </div>

          <div className="pricing-grid">
            {/* Tier 1: Free */}
            <motion.div className="pricing-card" variants={fadeUp} initial="offscreen" whileInView="onscreen" viewport={{ once: true }}>
              <div className="tier-name">Free</div>
              <div className="price">$0<span>/mo</span></div>
              <ul className="tier-features">
                <li>3 AI Resume Scans / mo</li>
                <li>Basic Formatting Check</li>
                <li>Limited Job Feed Access</li>
                <li>Community Support</li>
              </ul>
              <button className="secondary-btn pricing-btn">Get Started</button>
            </motion.div>

            {/* Tier 2: Pro (The Popular One) */}
            <motion.div className="pricing-card featured" variants={fadeUp} initial="offscreen" whileInView="onscreen" viewport={{ once: true }}>
              <div className="popular-badge">Most Popular</div>
              <div className="tier-name">Pro</div>
              <div className="price">$20<span>/mo</span></div>
              <ul className="tier-features">
                <li>Unlimited AI Resume Scans</li>
                <li>Deep JD Alignment Analysis</li>
                <li>Full Live Internship Feed</li>
                <li>Priority AI Processing</li>
                <li>Bullet Point Rewriter</li>
              </ul>
              <button className="primary-btn pricing-btn">Go Pro</button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-brand">
            <h4>ResumeAI</h4>
            <p>Built for ambitious engineers.</p>
          </div>
          <div className="footer-links">
            <div className="link-col">
              <h5>Product</h5>
              <a href="#">Features</a>
              <a href="#">Pricing</a>
            </div>
            <div className="link-col">
              <h5>Company</h5>
              <a href="#">About</a>
              <a href="#">Blog</a>
            </div>
            <div className="link-col">
              <h5>Legal</h5>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          © 2024 ResumeAI Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}