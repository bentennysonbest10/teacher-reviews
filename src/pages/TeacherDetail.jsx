import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {[1,2,3,4,5].map(star => (
        <button key={star} type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 32, padding: 0, lineHeight: 1,
            color: (hovered || value) >= star ? '#c9a84c' : '#2a3550',
            transition: 'color 0.15s, transform 0.15s',
            transform: (hovered || value) >= star ? 'scale(1.15)' : 'scale(1)'
          }}
        >★</button>
      ))}
    </div>
  )
}

function TeacherDetail() {
  const { teacherId } = useParams()
  const navigate = useNavigate()
  const [teacher, setTeacher] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedAssignment, setSelectedAssignment] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchData() {
      const { data: teacherData } = await supabase
        .from('teachers').select('*').eq('id', teacherId).single()
      setTeacher(teacherData)

      const { data: assignData } = await supabase
        .from('teacher_assignments')
        .select(`id, avg_rating, subjects(name), classes(name), sections(name)`)
        .eq('teacher_id', teacherId).eq('is_active', true)
      setAssignments(assignData || [])

      const { data: reviewData } = await supabase
        .from('reviews')
        .select(`id, rating, comment, created_at,
          teacher_assignments(subjects(name), classes(name), sections(name))`)
        .eq('teacher_id', teacherId).eq('is_visible', true)
        .order('created_at', { ascending: false })
      setReviews(reviewData || [])
      setLoading(false)
    }
    fetchData()
  }, [teacherId])

  async function handleSubmit() {
    setError('')
    if (!selectedAssignment) return setError('Please select a subject.')
    if (rating === 0) return setError('Please select a star rating.')
    if (comment.trim().length < 10) return setError('Please write at least 10 characters.')
    setSubmitting(true)
    const { error: err } = await supabase.from('reviews').insert({
      teacher_id: teacherId,
      assignment_id: parseInt(selectedAssignment),
      rating, comment: comment.trim(),
    })
    if (err) {
      setError('Something went wrong. Try again.')
    } else {
      setSubmitted(true)
      const { data: reviewData } = await supabase
        .from('reviews')
        .select(`id, rating, comment, created_at,
          teacher_assignments(subjects(name), classes(name), sections(name))`)
        .eq('teacher_id', teacherId).eq('is_visible', true)
        .order('created_at', { ascending: false })
      setReviews(reviewData || [])
    }
    setSubmitting(false)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0e1a' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #c9a84c', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  const inputStyle = {
    width: '100%', background: '#0a0e1a',
    border: '1px solid #1e2a4a', borderRadius: 10,
    padding: '12px 16px', color: '#e8e8f0',
    fontFamily: 'DM Sans', fontSize: 15,
    outline: 'none', transition: 'border-color 0.2s'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a' }}>
      {/* Hero header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f1629, #1a2340)',
        borderBottom: '1px solid #1e2a4a',
        padding: '36px 24px'
      }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <button onClick={() => navigate(-1)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#c9a84c', fontFamily: 'DM Sans', fontSize: 14,
            padding: 0, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6
          }}>← Back</button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <div style={{
              width: 88, height: 88, borderRadius: '50%',
              border: '3px solid #c9a84c', overflow: 'hidden',
              background: '#1e2a4a', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {teacher?.photo_url ? (
                <img src={teacher.photo_url} alt={teacher.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 30, color: '#c9a84c' }}>
                  {teacher?.name?.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h1 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 28, color: '#fff', margin: '0 0 6px' }}>
                {teacher?.name}
              </h1>
              {teacher?.bio && <p style={{ color: '#8892a4', fontFamily: 'DM Sans', margin: '0 0 10px', fontSize: 14 }}>{teacher.bio}</p>}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#c9a84c', fontSize: 22 }}>★</span>
                <span style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 20, color: '#e8e8f0' }}>
                  {teacher?.avg_rating > 0 ? teacher.avg_rating : 'No ratings yet'}
                </span>
                <span style={{ color: '#3a4460', fontSize: 13 }}>· {reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: 40 }}>

        {/* Subjects */}
        <div>
          <h2 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 18, color: '#e8e8f0', margin: '0 0 16px' }}>Teaches</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {assignments.map(a => (
              <div key={a.id} style={{
                background: '#111827', border: '1px solid #1e2a4a',
                borderRadius: 12, padding: '12px 18px'
              }}>
                <p style={{ fontFamily: 'Sora', fontWeight: 600, color: '#c9a84c', margin: '0 0 2px', fontSize: 14 }}>{a.subjects.name}</p>
                <p style={{ color: '#4a5568', fontSize: 12, fontFamily: 'DM Sans', margin: 0 }}>
                  {a.classes.name} · Section {a.sections.name}
                  {a.avg_rating > 0 && <span style={{ color: '#c9a84c' }}> · ★ {a.avg_rating}</span>}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Review form */}
        <div style={{
          background: '#111827', border: '1px solid #1e2a4a',
          borderRadius: 20, padding: '32px'
        }}>
          <h2 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 20, color: '#e8e8f0', margin: '0 0 24px' }}>
            Leave a Review
          </h2>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <p style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 20, color: '#c9a84c', margin: '0 0 8px' }}>Review submitted!</p>
              <p style={{ color: '#4a5568', fontFamily: 'DM Sans', marginBottom: 20 }}>Thank you for your feedback.</p>
              <button onClick={() => { setSubmitted(false); setRating(0); setComment(''); setSelectedAssignment('') }}
                style={{
                  background: 'none', border: '1px solid #c9a84c44',
                  borderRadius: 8, padding: '8px 20px',
                  color: '#c9a84c', fontFamily: 'DM Sans', cursor: 'pointer', fontSize: 14
                }}>
                Submit another
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'DM Sans', fontSize: 13, color: '#8892a4', marginBottom: 8 }}>Subject</label>
                <select value={selectedAssignment} onChange={e => setSelectedAssignment(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  onFocus={e => e.target.style.borderColor = '#c9a84c'}
                  onBlur={e => e.target.style.borderColor = '#1e2a4a'}
                >
                  <option value="">— Select a subject —</option>
                  {assignments.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.subjects.name} ({a.classes.name} · Section {a.sections.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'DM Sans', fontSize: 13, color: '#8892a4', marginBottom: 8 }}>Rating</label>
                <StarPicker value={rating} onChange={setRating} />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'DM Sans', fontSize: 13, color: '#8892a4', marginBottom: 8 }}>Your Review</label>
                <textarea value={comment} onChange={e => setComment(e.target.value)}
                  rows={4} placeholder="Share your honest experience..."
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => e.target.style.borderColor = '#c9a84c'}
                  onBlur={e => e.target.style.borderColor = '#1e2a4a'}
                />
              </div>

              {error && <p style={{ color: '#e24b4a', fontFamily: 'DM Sans', fontSize: 13, margin: 0 }}>{error}</p>}

              <button onClick={handleSubmit} disabled={submitting}
                style={{
                  background: submitting ? '#1e2a4a' : '#c9a84c',
                  border: 'none', borderRadius: 12,
                  padding: '15px', width: '100%',
                  fontFamily: 'Sora', fontWeight: 700, fontSize: 15,
                  color: submitting ? '#4a5568' : '#0a0e1a',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}>
                {submitting ? 'Submitting...' : 'Submit Review →'}
              </button>
            </div>
          )}
        </div>

        {/* Reviews list */}
        <div>
          <h2 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 18, color: '#e8e8f0', margin: '0 0 20px' }}>
            Reviews <span style={{ color: '#3a4460', fontWeight: 400, fontSize: 15 }}>({reviews.length})</span>
          </h2>

          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#3a4460' }}>
              <p style={{ fontSize: 40, marginBottom: 8 }}>💬</p>
              <p style={{ fontFamily: 'Sora', fontSize: 16 }}>No reviews yet. Be the first!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {reviews.map(r => (
                <div key={r.id} style={{
                  background: '#111827', border: '1px solid #1e2a4a',
                  borderRadius: 16, padding: '20px 24px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <span style={{ color: '#c9a84c', fontSize: 18 }}>{'★'.repeat(r.rating)}</span>
                      <span style={{ color: '#2a3550', fontSize: 18 }}>{'★'.repeat(5 - r.rating)}</span>
                      <span style={{ color: '#4a5568', fontSize: 13, fontFamily: 'DM Sans', marginLeft: 8 }}>{r.rating}/5</span>
                    </div>
                    <span style={{ color: '#3a4460', fontSize: 12, fontFamily: 'DM Sans' }}>
                      {new Date(r.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  {r.teacher_assignments && (
                    <div style={{
                      display: 'inline-block', background: '#1e2a4a',
                      borderRadius: 100, padding: '2px 12px',
                      fontSize: 11, color: '#c9a84c',
                      fontFamily: 'DM Sans', marginBottom: 10
                    }}>
                      {r.teacher_assignments.subjects?.name} · {r.teacher_assignments.classes?.name} Section {r.teacher_assignments.sections?.name}
                    </div>
                  )}
                  <p style={{ color: '#8892a4', fontFamily: 'DM Sans', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                    {r.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TeacherDetail