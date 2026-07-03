import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import idleImg from '../assets/Idle.png'
import punchImg from '../assets/Punch.png'
import knockedImg from '../assets/Knocked.png'
import slapSound from '../assets/slap1.mp3'

function Gate() {
    const navigate = useNavigate()
    const [hits, setHits] = useState(0)
    const [sprite, setSprite] = useState('idle')
    const [finished, setFinished] = useState(false)
    const audioRef = useRef(null)

    const images = { idle: idleImg, punch: punchImg, knocked: knockedImg }

    function handleTap() {
        if (finished) return

        const newHits = hits + 1
        setHits(newHits)

        if (audioRef.current) {
            audioRef.current.currentTime = 0
            audioRef.current.play().catch(() => { })
        }

        if (newHits >= 15) {
            setFinished(true)
            setSprite('punch')
            setTimeout(() => {
                setSprite('knocked')
                setTimeout(() => {
                    navigate('/home')
                }, 2000)
            }, 180)
        } else {
            setSprite('punch')
            setTimeout(() => setSprite('idle'), 180)
        }
    }

    return (
        <div style={{
            minHeight: '100vh', background: '#ffffff',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '24px', textAlign: 'center'
        }}>
            <audio ref={audioRef} src={slapSound} preload="auto" />

            <div style={{
                maxWidth: 560,
                marginBottom: 48,
                background: '#1e2a4a',
                borderRadius: 20,
                padding: '32px 28px',
                boxShadow: '0 20px 20px rgba(0,0,0,0.25)',
                border: '1px solid rgba(255,255,255,0.08)'
            }}>
                <p style={{
                    fontFamily: '"Baloo 2", "Sora", sans-serif',
                    fontWeight: 800,
                    fontSize: 24,
                    color: '#f5f5fa',
                    lineHeight: 1.6,
                    margin: 0,
                    letterSpacing: 0.3
                }}>
                    🥹 To every student who showed up, clicked, and believed in us{' '}
                    <span style={{ color: '#fbbf24' }}>thank you.</span>{' '}
                    You made this wild ride worth it. But with a heavy heart, we have
                    to pull the plug on this site for now, because a rat told Faculty about this and now{' '}
                    <span style={{
                        fontWeight: 900,
                        color: '#ef4444',
                        fontFamily: '"Bangers", "Sora", sans-serif',
                        fontSize: 28,
                        letterSpacing: 1
                    }}>
                        FIA
                    </span>{' '}
                    is on our ass. 😬🚨
                    <br /><br />
                    This isn't goodbye forever, just a tactical retreat. 🫡
                    <br />
                    We'll be back with a vengeance.
                    <br /><br />
                    You can slap this rat for now. 🐀👊
                </p>
            </div>

            <div
                onClick={handleTap}
                style={{
                    cursor: finished ? 'default' : 'pointer',
                    userSelect: 'none',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 16
                }}
            >
                <img
                    src={images[sprite]}
                    alt="mouse"
                    draggable={false}
                    style={{
                        width: 220, height: 220, objectFit: 'contain',
                        transition: 'transform 0.1s ease',
                        transform: sprite === 'punch' ? 'scale(1.08)' : 'scale(1)'
                    }}
                />
            </div>
        </div>
    )
}

export default Gate