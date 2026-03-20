import { useRef } from "react";
import "./Home.css";
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
      <div className="main-glow"></div>

      {/* --- Hero --- */}
      <section className="hero" ref={heroRef}>
        <div className="container">
          <motion.div 
            className="badge" 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
          >
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

        {/* 3D dashboard preview of application */}
        <motion.div
          className="hero-visual-container container"
          style={{ scale: dashboardScale, y: dashboardY }}
        >
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

      {/* --- rich bento grid --- */}
      <motion.section
        className="features container"
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.div className="feature-card span-2" variants={fadeUp}>
          <div className="card-text">
            <div className="icon-box">⚡</div>
            <h3>AI-Powered Feedback</h3>
            <p>Instant, personalized resume analysis using advanced language models trained on 10k+ successful hires.</p>
          </div>
          {/* visual markup inside the card */}
          <div className="card-visual-mockup big-graph"></div>
        </motion.div>

        <motion.div className="feature-card" variants={fadeUp}>
          <div className="card-text">
            <div className="icon-box">🎯</div>
            <h3>Job Matching</h3>
            <p>Real-time alignment scores against specific JD keywords.</p>
          </div>
           {/* little visual */}
          <div className="card-visual-mockup mini-bar"></div>
        </motion.div>

        <motion.div className="feature-card" variants={fadeUp}>
          <div className="card-text">
            <div className="icon-box">🛡️</div>
            <h3>ATS Proof</h3>
            <p>Ensure your PDF is readable by legacy applicant tracking systems.</p>
          </div>
        </motion.div>

        <motion.div className="feature-card span-2-right" variants={fadeUp}>
          <div className="card-text">
            <div className="icon-box">💡</div>
            <h3>Actionable Tips</h3>
            <p>No fluff. Just direct steps to improve your impact scores and bullet points.</p>
          </div>
          <div className="card-visual-mockup tips-grid"></div>
        </motion.div>
      </motion.section>

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