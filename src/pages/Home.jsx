import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function Home() {
  const [classes, setClasses] = useState([])
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData() {
      const { data: classData } = await supabase.from('classes').select('*').order('id')
      const { data: sectionData } = await supabase.from('sections').select('*').order('id')
      setClasses(classData || [])
      setSections(sectionData || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 48, height: 48, border: '3px solid #c9a84c',
          borderTopColor: 'transparent', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
        }} />
        <p style={{ color: '#888', fontFamily: 'DM Sans' }}>Loading...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0f1629 0%, #1a2340 50%, #0f1629 100%)',
        borderBottom: '1px solid #1e2a4a',
        padding: '60px 24px 50px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 240, height: 240, borderRadius: '50%',
          border: '1px solid #c9a84c22', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: -40, left: -40,
          width: 180, height: 180, borderRadius: '50%',
          border: '1px solid #c9a84c15', pointerEvents: 'none'
        }} />

        <div style={{
          display: 'inline-block',
          background: '#c9a84c22',
          border: '1px solid #c9a84c44',
          borderRadius: 100,
          padding: '6px 18px',
          fontSize: 12,
          color: '#c9a84c',
          letterSpacing: 2,
          textTransform: 'uppercase',
          marginBottom: 20,
          fontFamily: 'DM Sans'
        }}>
          CS Department
        </div>

        <h1 style={{
          fontFamily: 'Sora',
          fontSize: 'clamp(28px, 5vw, 52px)',
          fontWeight: 800,
          color: '#ffffff',
          margin: '0 0 12px',
          lineHeight: 1.15
        }}>
          Teacher Review
          <span style={{ color: '#c9a84c', display: 'block' }}>Platform</span>
        </h1>

        <p style={{
          color: '#8892a4',
          fontSize: 16,
          maxWidth: 400,
          margin: '0 auto',
          fontFamily: 'DM Sans',
          lineHeight: 1.6
        }}>
          Anonymously rate and review your professors. Select your semester and section below.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28 }}>
        <button
          onClick={() => navigate('/leaderboard')}
          style={{
            background: '#c9a84c',
            border: 'none', borderRadius: 12,
            padding: '12px 28px',
            fontFamily: 'Sora', fontWeight: 700,
            fontSize: 14, color: '#0a0e1a',
            cursor: 'pointer', transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          🏆 View Leaderboard
        </button>
      </div>
      {/* Semesters */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px' }}>
        {classes.map((cls, i) => {
          const classSections = sections.filter(s => s.class_id === cls.id)
          return (
            <div key={cls.id} style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: '#c9a84c', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Sora', fontWeight: 700, fontSize: 13, color: '#0a0e1a'
                }}>
                  {i + 1}
                </div>
                <h2 style={{
                  fontFamily: 'Sora', fontWeight: 700,
                  fontSize: 20, color: '#e8e8f0', margin: 0
                }}>
                  {cls.name}
                </h2>
                <div style={{ flex: 1, height: 1, background: '#1e2a4a' }} />
              </div>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', paddingLeft: 44 }}>
                {classSections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => navigate(`/section/${sec.id}`)}
                    style={{
                      background: '#111827',
                      border: '1px solid #1e2a4a',
                      borderRadius: 14,
                      padding: '18px 32px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: 'Sora',
                      fontWeight: 600,
                      fontSize: 15,
                      color: '#c9a84c',
                      letterSpacing: 0.5,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#c9a84c'
                      e.currentTarget.style.color = '#0a0e1a'
                      e.currentTarget.style.borderColor = '#c9a84c'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#111827'
                      e.currentTarget.style.color = '#c9a84c'
                      e.currentTarget.style.borderColor = '#1e2a4a'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    Section {sec.name}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid #1e2a4a',
        padding: '32px 24px',
        textAlign: 'center',
        background: '#0a0e1a',
      }}>
        <p style={{
          fontFamily: 'Sora',
          fontWeight: 700,
          fontSize: 16,
          color: '#e8e8f0',
          margin: '0 0 6px',
        }}>
          Teacher Review Platform
        </p>

        <p style={{
          fontFamily: 'DM Sans',
          fontSize: 13,
          color: '#6b7280',
          margin: '0 0 16px',
        }}>
          Anonymous reviews · No login required
        </p>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: '#111827',
          border: '1px solid #1e2a4a',
          borderRadius: 9999,
          padding: '10px 18px',
        }}>
          <span style={{ fontSize: 14 }}>✉️</span>
          <a
            href="mailto:bentennysonbest10@gmail.com"
            style={{
              fontFamily: 'DM Sans',
              fontSize: 13,
              color: '#c9a84c',
              textDecoration: 'none',
            }}
          >
            bentennysonbest10@gmail.com
          </a>
        </div>

        <p style={{
          fontFamily: 'DM Sans',
          fontSize: 11,
          color: '#4b5563',
          marginTop: 16,
        }}>
          For corrections or issues, reach out via email
        </p>
      </div>

    </div>
  )
}

export default Home