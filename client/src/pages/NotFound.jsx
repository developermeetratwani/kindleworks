import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Seo from '../components/Seo'

export default function NotFound() {
  return (
    <>
      <Seo
        title="Page Not Found — KindleWorks"
        description="The page you're looking for doesn't exist or has moved."
        path="/404"
        noindex
      />
      <Navbar />
      <section style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '120px 24px' }}>
        <h1>404 — Page Not Found</h1>
        <p style={{ color: 'var(--kw-body)', marginTop: 12, marginBottom: 32 }}>
          The page you're looking for doesn't exist or has moved.
        </p>
        <Link to="/" className="btn-chamfer">Back to Home</Link>
      </section>
      <Footer />
    </>
  )
}
