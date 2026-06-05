import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function StarDisplay({ rating }) {
    return (
        <span>
            {[1, 2, 3, 4, 5].map(s => (
                <span key={s} style={{ color: s <= Math.round(rating) ? '#c9a84c' : '#2a3550', fontSize: 14 }}>★</span>
            ))}
        </span>
    )
}

function SectionPage() {
    const { sectionId } = useParams()
    const navigate = useNavigate()
    const [teachers, setTeachers] = useState([])
    const [sectionInfo, setSectionInfo] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            const { data: secData } = await supabase
                .from('sections')
                .select('*, classes(name)')
                .eq('id', sectionId)
                .single()
            setSectionInfo(secData)

            const { data: assignments } = await supabase
                .from('teacher_assignments')
                .select(`id, avg_rating, subjects(name), teachers(id, name, photo_url, bio, avg_rating)`)
                .eq('section_id', sectionId)
                .eq('is_active', true)
            setTeachers(assignments || [])
            setLoading(false)
        }
        fetchData()
    }, [sectionId])

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0e1a' }}>
            <div style={{
                width: 40, height: 40, border: '3px solid #c9a84c',
                borderTopColor: 'transparent', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
    )

    return (
        <div style={{ minHeight: '100vh', background: '#0a0e1a' }}>
            {/* Header */}
            <div style={{
                background: '#0f1629',
                borderBottom: '1px solid #1e2a4a',
                padding: '32px 24px'
            }}>
                <div style={{ maxWidth: 860, margin: '0 auto' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#c9a84c', fontFamily: 'DM Sans', fontSize: 14,
                            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20,
                            padding: 0
                        }}
                    >
                        ← Back
                    </button>
                    <h1 style={{
                        fontFamily: 'Sora', fontWeight: 800, fontSize: 32,
                        color: '#fff', margin: '0 0 6px'
                    }}>
                        {sectionInfo?.classes?.name}
                        <span style={{ color: '#c9a84c' }}> · Section {sectionInfo?.name}</span>
                    </h1>
                    <p style={{ color: '#4a5568', fontFamily: 'DM Sans', margin: 0, fontSize: 14 }}>
                        {teachers.length} teacher{teachers.length !== 1 ? 's' : ''} assigned
                    </p>
                </div>
            </div>

            {/* Teacher Cards */}
            <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px' }}>
                {teachers.length === 0 ? (
                    <div style={{ textAlign: 'center', paddingTop: 80, color: '#3a4460' }}>
                        <p style={{ fontSize: 48, marginBottom: 12 }}>📭</p>
                        <p style={{ fontFamily: 'Sora', fontSize: 18 }}>No teachers assigned yet</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {teachers.map((assignment) => (
                            <div
                                key={assignment.id}
                                onClick={() => navigate(`/teacher/${assignment.teachers.id}`)}
                                style={{
                                    background: '#111827',
                                    border: '1px solid #1e2a4a',
                                    borderRadius: 18,
                                    padding: '24px 28px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 20,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = '#c9a84c44'
                                    e.currentTarget.style.background = '#141c2e'
                                    e.currentTarget.style.transform = 'translateX(4px)'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = '#1e2a4a'
                                    e.currentTarget.style.background = '#111827'
                                    e.currentTarget.style.transform = 'translateX(0)'
                                }}
                            >
                                {/* Avatar */}
                                <div style={{
                                    width: 64, height: 64, borderRadius: '50%',
                                    overflow: 'hidden', flexShrink: 0,
                                    background: '#1e2a4a',
                                    border: '2px solid #c9a84c33',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {assignment.teachers.photo_url ? (
                                        <img src={assignment.teachers.photo_url} alt={assignment.teachers.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 22, color: '#c9a84c' }}>
                                            {assignment.teachers.name.charAt(0)}
                                        </span>
                                    )}
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1 }}>
                                    <h3 style={{
                                        fontFamily: 'Sora', fontWeight: 700, fontSize: 18,
                                        color: '#e8e8f0', margin: '0 0 4px'
                                    }}>
                                        {assignment.teachers.name}
                                    </h3>
                                    <div style={{
                                        display: 'inline-block',
                                        background: '#1e2a4a', borderRadius: 100,
                                        padding: '3px 12px', fontSize: 12,
                                        color: '#c9a84c', fontFamily: 'DM Sans', marginBottom: 6
                                    }}>
                                        {assignment.subjects.name}
                                    </div>
                                    {assignment.teachers.bio && (
                                        <p style={{ color: '#4a5568', fontSize: 13, fontFamily: 'DM Sans', margin: 0 }}>
                                            {assignment.teachers.bio}
                                        </p>
                                    )}
                                </div>

                                {/* Rating + Arrow */}
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    {assignment.teachers.avg_rating > 0 ? (
                                        <>
                                            <div style={{
                                                fontFamily: 'Sora', fontWeight: 800,
                                                fontSize: 28, color: '#c9a84c', lineHeight: 1
                                            }}>
                                                {assignment.teachers.avg_rating}
                                            </div>
                                            <StarDisplay rating={assignment.teachers.avg_rating} />
                                        </>
                                    ) : null}
                                    <div style={{ color: '#c9a84c', fontSize: 18, marginTop: 8 }}>→</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SectionPage