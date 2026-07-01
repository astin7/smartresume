import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const dashboardY = useTransform(scrollYProgress, [0, 0.5], [0, -40]);

  const fadeUp: Variants = {
    offscreen: { opacity: 0, y: 30 },
    onscreen: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", bounce: 0.2, duration: 0.8 } 
    }
  };

  return (
    <div className="home-clean">
      {/* Navbar */}
      <nav className="navbar-clean">
        <div className="nav-container-clean">
          {/* Branding */}
          <Link to="/" className="nav-logo-clean">SMARTRESUME</Link>

          {/* Action Button */}
          <div className="nav-actions">
            <Link to="/login" className="nav-link-subtle">Log in</Link>
            {/* Applied the new premium CTA class */}
            <Link to="/signup" className="btn-get-started">Get started free</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-clean" ref={heroRef}>
        <div className="container text-center hero-content-clean">
          <motion.h1 
            className="hero-title-clean"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Analyze Resumes <span className="highlight-pill">With Precision</span>
          </motion.h1>

          <motion.p 
            className="hero-sub-clean"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Stop guessing. Use industrial-grade AI to optimize your resume for high-growth tech roles. Get hired faster with data-driven insights.
          </motion.p>

          <motion.div 
            className="hero-actions-clean"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/signup" className="btn-get-started" style={{ padding: "14px 28px", fontSize: "1.1rem" }}>
              Get started free →
            </Link>
          </motion.div>
        </div>

        {/* Overlapping Dashboard Mockup */}
        <motion.div className="dashboard-overlap-container" style={{ y: dashboardY }}>
          <div className="dashboard-mockup-clean">
            <div className="mockup-header">
              <span className="mac-dot red"></span>
              <span className="mac-dot yellow"></span>
              <span className="mac-dot green"></span>
              <div className="mockup-title">SMARTRESUME — Dashboard</div>
            </div>
            <div className="mockup-body">
              <div className="mockup-sidebar"></div>
              <div className="mockup-main">
                <div className="mockup-card top"></div>
                <div className="mockup-grid">
                  <div className="mockup-card"></div>
                  <div className="mockup-card"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Dark Section (logos) */}
      <section className="dark-section-clean">
        <div className="container">
          <div className="logo-ticker-clean">
            <span className="logo-item">Google</span>
            <span className="logo-item">Amazon</span>
            <span className="logo-item">Tesla</span>
            <span className="logo-item">CyberMonitor</span>
            <span className="logo-item">Palantir</span>
          </div>
        </div>
      </section>

      {/* Feature Split Section */}
      <section id="features" className="split-feature-section container">
        <div className="split-content-left">
          <motion.div variants={fadeUp} initial="offscreen" whileInView="onscreen" viewport={{ once: true }}>
            <h2 className="section-title-clean">Built to beat the algorithm</h2>
            <p className="section-sub-clean">
              From contextual job matching to granular score reporting, SMARTRESUME has you covered.
            </p>

            <div className="feature-list-clean">
              <div className="feature-item-clean">
                <div className="feature-icon-clean">🎯</div>
                <div>
                  <h4>Contextual JD Alignment</h4>
                  <p>Paste the exact job description. The AI scans your experience layer-by-layer to identify missing keywords.</p>
                </div>
              </div>
              <div className="feature-item-clean">
                <div className="feature-icon-clean">📊</div>
                <div>
                  <h4>Granular Score Reports</h4>
                  <p>Specific subscores for ATS-readability, formatting, impact metrics, and technical keyword alignment.</p>
                </div>
              </div>
              <div className="feature-item-clean">
                <div className="feature-icon-clean">🌐</div>
                <div>
                  <h4>Live Internship Feed</h4>
                  <p>Browse open Software Engineering roles and instantly analyze your resume against them with a single click.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="split-content-right">
          <motion.div className="feature-image-mockup" variants={fadeUp} initial="offscreen" whileInView="onscreen" viewport={{ once: true }}>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="how-it-works-clean bg-light-gray">
        <div className="container">
          <div className="section-header-clean text-center">
            <h2 className="section-title-clean">How it works</h2>
            <p className="section-sub-clean">From blank page to accepted offer in three simple steps.</p>
          </div>

          <div className="timeline-grid-clean">
            <div className="timeline-line-clean"></div>
            
            <motion.div className="timeline-step" variants={fadeUp} initial="offscreen" whileInView="onscreen" viewport={{ once: true }}>
              <div className="step-number-clean">1</div>
              <h3>Find a Role</h3>
              <p>Browse our live feed of tech internships or manually paste a job description from any site.</p>
            </motion.div>

            <motion.div className="timeline-step" variants={fadeUp} initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.2 }}>
              <div className="step-number-clean">2</div>
              <h3>Upload & Scan</h3>
              <p>Drop in your resume PDF. Our AI reads it exactly like a corporate Applicant Tracking System (ATS) would.</p>
            </motion.div>

            <motion.div className="timeline-step" variants={fadeUp} initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.4 }}>
              <div className="step-number-clean">3</div>
              <h3>Fix & Dominate</h3>
              <p>Get your alignment score and follow the exact instructions to rewrite weak bullet points before you apply.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="pricing-section-clean container">
         <div className="section-header-clean text-center">
            <h2 className="section-title-clean">Ready to get hired?</h2>
            <p className="section-sub-clean">Choose the plan that fits your career goals.</p>
          </div>

          <div className="pricing-grid-clean">
            {/* Free */}
            <motion.div className="pricing-card-clean free-card" variants={fadeUp} initial="offscreen" whileInView="onscreen" viewport={{ once: true }}>
              <div className="tier-header-clean">
                <h4>Free</h4>
                <div className="price-clean">$0<span>/mo</span></div>
              </div>
              <ul className="tier-features-clean">
                <li>3 AI Resume Scans / mo</li>
                <li>Basic Formatting Check</li>
                <li>Limited Job Feed Access</li>
              </ul>
              <Link to="/signup" className="btn-outline-blue">Start Free</Link>
            </motion.div>

            {/* Pro */}
            <motion.div className="pricing-card-clean pro-card" variants={fadeUp} initial="offscreen" whileInView="onscreen" viewport={{ once: true, delay: 0.1 }}>
              <div className="badge">Best Value</div>
              <div className="tier-header-clean">
                <h4>Pro</h4>
                <div className="price-clean">$20<span>/mo</span></div>
              </div>
              <ul className="tier-features-clean">
                <li>Unlimited AI Resume Scans</li>
                <li>Deep JD Alignment Analysis</li>
                <li>Full Live Internship Feed</li>
                <li>Bullet Point Rewriter</li>
              </ul>
              <Link to="/signup" className="btn-solid-blue">Upgrade to Pro</Link>
            </motion.div>
          </div>
      </section>

      {/* Giant Orange CTA */}
      <section className="bottom-cta-clean">
        <div className="container text-center">
          <h2 className="cta-title">Ready to transform your career?</h2>
          <p className="cta-sub">Join ambitious engineers already using SMARTRESUME to land their dream roles. Start for free — no credit card required.</p>
          <Link to="/signup" className="btn-white-solid" style={{ display: "inline-block", textDecoration: "none" }}>
            Get started free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-clean">
        <div className="container footer-flex">
          <div className="footer-brand-clean">
            <h4 className="nav-logo-clean">SMARTRESUME</h4>
            <p>The modern career growth platform for ambitious engineers.</p>
            <p className="copyright">© 2026 SMARTRESUME. All rights reserved.</p>
          </div>
          <div className="footer-links-clean">
            <div className="link-group">
              <h5>PRODUCT</h5>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="/demo">Demo</a>
            </div>
            <div className="link-group">
              <h5>COMPANY</h5>
              <a href="/about">About</a>
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}