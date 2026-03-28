import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Home() {
  // Animations
  const fadeUp: Variants = {
    offscreen: { opacity: 0, y: 60 },
    onscreen: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  const staggerContainer: Variants = {
    offscreen: { opacity: 0 },
    onscreen: {
      opacity: 1,
      transition: { staggerChildren: 0.25, delayChildren: 0.1 }
    }
  };

  return (
    <div className="home-architectural">

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">ResumeAI</div>
          <div className="nav-menu">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how" className="nav-link">How It Works</a>
            <a href="#pricing" className="nav-link">Pricing</a>
          </div>
          <div className="nav-actions">
            <Link to="/signup" className="nav-btn-outline">Get Started ↗</Link>
          </div>
        </div>
      </nav>

      {/* HERO*/}
      <section className="section-black hero-section">
        <div className="container">
          <div className="hero-split">
            <motion.div 
              initial="offscreen"
              animate="onscreen"
              variants={fadeUp}
              className="hero-text-side"
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#a1a1aa', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '2.5rem' }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: '#e11d48', borderRadius: '50%' }}></span> 
                In the making.
              </div>

              <h1 className="hero-title">
                Analyze Resumes <br />
                <span className="text-red">With Precision.</span>
              </h1>
              <p className="hero-sub">
                A deep dive into the engine that powers your next career move. We don't just check for spelling; we analyze your exact fit.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="hero-visual-side"
            >
              <div className="clean-window">
                <div className="window-header">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <div className="window-body">
                  <div className="mock-line short"></div>
                  <div className="mock-line long"></div>
                  <div className="mock-line medium"></div>
                  <div className="mock-box">Match: 94%</div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Hero stats */}
          <motion.div 
            className="hero-stats-grid"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.5 }}
            variants={staggerContainer}
          >
            {[
              { h2: "400+", p: "Resumes Optimized" },
              { h2: "94%", p: "Interview Rate" },
              { h2: "$1M+", p: "In Salary Offers" },
              { h2: "24/7", p: "AI Availability" }
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeUp} className="stat-cell">
                <h2>{stat.h2}</h2>
                <p>{stat.p}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features (White Section) */}
      <section id="features" className="section-white">
        <div className="container">
          <motion.div 
            className="split-header"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="header-text-side">
              <h2>Built to beat<br/>the algorithm.</h2>
              <p>The engine that powers your next career move.</p>
              <Link to="/signup" className="black-btn">Get Started ↗</Link>
            </div>
            <div className="header-graphic-side">
               <div className="wireframe-graphic dark-wire"></div>
            </div>
          </motion.div>

          <motion.div 
            className="flush-grid-2x2"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {[
              { title: "Contextual JD Alignment", text: "Upload your resume and paste the exact job description. The AI scans your experience specifically against their requirements." },
              { title: "Granular Score Reports", text: "Get an overall match score plus detailed subscores for formatting, keyword optimization, and technical alignment." },
              { title: "Live Internship Feed", text: "Browse a live, auto-updating feed of open tech roles. Find a match and analyze your resume against it with one click." },
              { title: "Detail & Specificity Check", text: "Stop using vague statements. The engine flags weak bullet points and guides you to quantify your achievements." }
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeUp} className="grid-cell">
                <h3 className="cell-title"><span className="cell-num">{i+1}.</span> {feature.title}</h3>
                <p>{feature.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works (black section) */}
      <section id="how" className="section-black">
        <div className="container">
          <motion.div 
            className="flush-grid-process"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="grid-cell title-cell">
              <h2>How It<br/>Works</h2>
            </motion.div>
            
            <motion.div variants={fadeUp} className="grid-cell process-graphic-cell">
              <div className="flowchart">
                <div className="flow-node"><div className="node-icon">📄</div><span>Parse</span></div>
                <div className="flow-line"></div>
                <div className="flow-node"><div className="node-icon">⚡</div><span>Analyze</span></div>
                <div className="flow-line"></div>
                <div className="flow-node"><div className="node-icon">🎯</div><span>Align</span></div>
              </div>
            </motion.div>

            {/* Cell 1 */}
            <motion.div variants={fadeUp} className="grid-cell process-desc-cell">
              <span className="cell-num">1.</span>
              <h4>Find a Role</h4>
              <p>Browse our live feed of tech internships or manually paste a job description from any site.</p>
            </motion.div>

            {/* Cell 2 */}
            <motion.div variants={fadeUp} className="grid-cell process-desc-cell">
              <span className="cell-num">2.</span>
              <h4>Upload & Scan</h4>
              <p>Drop in your resume PDF. Our AI reads it exactly like a corporate Applicant Tracking System (ATS) would.</p>
            </motion.div>

            {/* Cell 3 */}
            <motion.div variants={fadeUp} className="grid-cell process-desc-cell">
              <span className="cell-num">3.</span>
              <h4>Fix & Dominate</h4>
              <p>Get your alignment score and follow the exact instructions to rewrite weak bullet points before you apply.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/*  Pricing header (red section) */}
      <section id="pricing" className="section-red">
        <div className="container">
          <motion.div 
            className="split-header"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="header-text-side">
              <h2>Ready to get hired?</h2>
              <p>Choose the plan that fits your career goals.</p>
              <Link to="/signup" className="outline-btn-white">Go Pro ↗</Link>
            </div>
            <div className="header-graphic-side">
               <div className="wireframe-graphic white-wire"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing cards (white section) */}
      <section className="section-white pricing-cards-section">
        <div className="container">
          <motion.div 
            className="pricing-centered-header"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="pricing-eyebrow">The ROI of You</span>
            <h2 className="pricing-catchy-title">Invest in Your <br /><span className="text-gradient-red">Next Offer.</span></h2>
            <p className="pricing-catchy-sub">Start optimizing for free. Go Pro when you're ready to completely dominate the applicant pool.</p>
          </motion.div>

          <motion.div 
            className="pricing-grid"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="pricing-card">
              <div className="tier-name">Free</div>
              <div className="price">$0<span>/mo</span></div>
              <ul className="tier-features">
                <li>3 AI Resume Scans to Try Out</li>
                <li>Basic Formatting Check</li>
                <li>Limited Job Feed Access</li>
              </ul>
              <Link to="/signup" className="outline-btn-black pricing-btn">Get Started</Link>
            </motion.div>

            <motion.div variants={fadeUp} className="pricing-card featured-card">
              <div className="popular-badge">Most Popular</div>
              <div className="tier-name">Pro</div>
              <div className="price">$19.99<span>/mo</span></div>
              <ul className="tier-features">
                <li>Unlimited AI Resume Scans</li>
                <li>Deep JD Alignment Analysis</li>
                <li>Full Live Internship Feed</li>
                <li>Bullet Point Rewriter</li>
              </ul>
              <Link to="/signup" className="primary-btn pricing-btn">Go Pro</Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-goji">
        <div className="container">
          <motion.div 
            className="footer-content"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="footer-cta-area">
              <h2 className="footer-huge-text">Give it a Shot</h2>
              <Link to="/signup" className="nav-btn-outline footer-main-btn">Get Started ↗</Link>
            </div>

            <div className="footer-divider"></div>

            <div className="footer-bottom-bar">
              <div className="footer-left">
                <div className="footer-socials">
                  <a href="#" className="social-link">LinkedIn</a>
                  <a href="#" className="social-link">X</a>
                  <a href="#" className="social-link">Instagram</a>
                </div>
              </div>
              <div className="footer-center">
                <p>© 2026 ResumeAI | <a href="#">Privacy & Terms</a></p>
              </div>
              <div className="footer-right">
                <a href="mailto:resumeai@gmail.com" className="footer-contact">resumeai@gmail.com</a>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}