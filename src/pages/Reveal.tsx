import React, { useEffect, useState } from 'react'
import './styles.css'
import { burstConfetti } from '../utils/confetti'
import { Eye, Gift } from 'lucide-react';

type Match = { giver: string; receiver: string }

export default function RevealPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [index, setIndex] = useState<number | null>(null)
  const [showing, setShowing] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('random-picker:matches')
    if (raw) setMatches(JSON.parse(raw))
  }, [])

  useEffect(() => {
    if (showing) {
      burstConfetti(200)
      // play a short reveal tone using WebAudio (small, no external file)
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.type = 'sine'
        o.frequency.value = 660
        g.gain.value = 0.001
        o.connect(g)
        g.connect(ctx.destination)
        o.start()
        g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02)
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45)
        o.stop(ctx.currentTime + 0.5)
      } catch (e) {
        // ignore audio errors on older browsers
      }
    }
  }, [showing])

  const start = () => {
    setIndex(0)
    setShowing(false)
  }

  const reveal = () => {
    setShowing(true)
  }

  const next = () => {
    if (index === null) return
    if (index < matches.length - 1) {
      setIndex(index + 1)
      setShowing(false)
    } else {
      // finished
      window.location.href = '/'
    }
  }

  if (matches.length === 0) {
    return (
      <div className="page">
        <div className="card" style={{ marginTop: 80 }}>
          <h2>No matches found</h2>
          <p>Return to the app and generate matches first.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="reveal-fullscreen">
      <div className="reveal-inner">
        {index === null ? (
          <div className="reveal-hero">
            <Gift className="reveal-icon" />
            <h1 className="reveal-title">Ready to Reveal?</h1>
            <p className="reveal-sub">Pass the device to the first person</p>
            <button className="start-button" onClick={start}>Start Reveal</button>
          </div>
        ) : (
          <div className="reveal-step">
            <div className="giver">{matches[index].giver}</div>
            <p className="gift-emoji">🎁</p>
            <p className="gift-text">will give a gift to...</p>
            <div style={{ height: 18 }} />
            {!showing ? (
              <button className="reveal-button" onClick={reveal}>
                <Eye className="w-8 h-8 mr-3" />
                 Reveal!
                </button>
            ) : (
                    <div className="revealed">
                      <div className="receiver">{matches[index].receiver}</div>
                      <div style={{ height: 18 }} />
                      <button className="next-button" onClick={next}>
                        {index < matches.length - 1 ? 'Next Person' : 'Finish'}
                      </button>
                    </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

