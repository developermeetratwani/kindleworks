import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <span className="footer__copy">© 2026 KindleWorks. All rights reserved.</span>
      <div className="footer__links">
        <Link to="/estimate">Estimate</Link>
        <a href="#pricing">Pricing</a>
        <a href="#features">Features</a>
        <a href="#contact">Contact</a>
      </div>
    </footer>
  )
}
