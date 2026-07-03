import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function Leaderboard() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('teachers')
        .select('id, name, photo_url, bio, avg_rating')
        .eq('is_active', true)
        .order('avg_rating', { ascending: false })
      setTeachers(data || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0e1a' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #c9a84c', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  const medals = ['🥇', '🥈', '🥉']

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return '#22c55e'
    if (rating >= 3.5) return '#c9a84c'
    if (rating >= 2.5) return '#f97316'
    return '#ef4444'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f1629 0%, #1a2340 50%, #0f1629 100%)',
        borderBottom: '1px solid #1e2a4a',
        padding: '48px 24px',
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

        <button
          onClick={() => navigate('/home')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#c9a84c', fontFamily: 'DM Sans', fontSize: 14,
            display: 'flex', alignItems: 'center', gap: 6,
            margin: '0 auto 24px', padding: 0
          }}
        >
          ← Back to Home
        </button>

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
          marginBottom: 16,
          fontFamily: 'DM Sans'
        }}>
          CS Department
        </div>

        <h1 style={{
          fontFamily: 'Sora', fontWeight: 800,
          fontSize: 'clamp(28px, 5vw, 48px)',
          color: '#fff', margin: '0 0 10px'
        }}>
          Teacher <span style={{ color: '#c9a84c' }}>Leaderboard</span>
        </h1>
        <p style={{
          color: '#8892a4', fontSize: 15,
          fontFamily: 'DM Sans', margin: 0
        }}>
          Ranked by average student rating
        </p>
      </div>

      {/* Table */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px' }}>

        {/* Top 3 podium */}
        {teachers.length >= 3 && (
          <div style={{
            display: 'flex', gap: 16, marginBottom: 40,
            justifyContent: 'center', flexWrap: 'wrap'
          }}>
            {teachers.slice(0, 3).map((t, i) => (
              <div
                key={t.id}
                onClick={() => navigate(`/teacher/${t.id}`)}
                style={{
                  background: '#111827',
                  border: `1px solid ${i === 0 ? '#c9a84c' : '#1e2a4a'}`,
                  borderRadius: 20,
                  padding: '24px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  flex: 1, minWidth: 160,
                  transition: 'all 0.2s',
                  transform: i === 0 ? 'scale(1.05)' : 'scale(1)'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#c9a84c'}
                onMouseLeave={e => e.currentTarget.style.borderColor = i === 0 ? '#c9a84c' : '#1e2a4a'}
              >
                <div style={{ fontSize: 36, marginBottom: 12 }}>{medals[i]}</div>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: '#1e2a4a', border: '2px solid #c9a84c33',
                  margin: '0 auto 12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {t.photo_url ? (
                    <img src={t.photo_url} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 20, color: '#c9a84c' }}>
                      {t.name.charAt(0)}
                    </span>
                  )}
                </div>
                <p style={{
                  fontFamily: 'Sora', fontWeight: 700,
                  fontSize: 14, color: '#e8e8f0',
                  margin: '0 0 6px', lineHeight: 1.3
                }}>
                  {t.name}
                </p>
                <p style={{ color: '#4a5568', fontSize: 12, fontFamily: 'DM Sans', margin: '0 0 10px' }}>
                  {t.bio}
                </p>
                <div style={{
                  fontFamily: 'Sora', fontWeight: 800,
                  fontSize: 24, color: getRatingColor(t.avg_rating)
                }}>
                  {t.avg_rating > 0 ? t.avg_rating : '—'}
                </div>
                <div style={{ color: '#3a4460', fontSize: 11, fontFamily: 'DM Sans' }}>avg rating</div>
              </div>
            ))}
          </div>
        )}

        {/* Full rankings list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {teachers.map((t, i) => (
            <div
              key={t.id}
              onClick={() => navigate(`/teacher/${t.id}`)}
              style={{
                background: '#111827',
                border: '1px solid #1e2a4a',
                borderRadius: 14,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#c9a84c44'
                e.currentTarget.style.transform = 'translateX(4px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#1e2a4a'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              {/* Rank */}
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: i < 3 ? '#c9a84c' : '#1e2a4a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Sora', fontWeight: 700, fontSize: 14,
                color: i < 3 ? '#0a0e1a' : '#4a5568',
                flexShrink: 0
              }}>
                {i + 1}
              </div>

              {/* Avatar */}
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: '#1e2a4a', border: '2px solid #c9a84c22',
                overflow: 'hidden', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {t.photo_url ? (
                  <img src={t.photo_url} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 16, color: '#c9a84c' }}>
                    {t.name.charAt(0)}
                  </span>
                )}
              </div>

              {/* Name + bio */}
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 15, color: '#e8e8f0', margin: '0 0 2px' }}>
                  {t.name}
                </p>
                <p style={{ color: '#4a5568', fontSize: 12, fontFamily: 'DM Sans', margin: 0 }}>
                  {t.bio}
                </p>
              </div>

              {/* Rating */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{
                  fontFamily: 'Sora', fontWeight: 800, fontSize: 22,
                  color: getRatingColor(t.avg_rating)
                }}>
                  {t.avg_rating > 0 ? t.avg_rating : '—'}
                </div>
                <div style={{ color: '#3a4460', fontSize: 11, fontFamily: 'DM Sans' }}>
                  {'★'.repeat(Math.round(t.avg_rating))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Leaderboard