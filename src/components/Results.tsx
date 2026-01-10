import React, { useState } from 'react'
import { Participant } from '../pages/RandomPicker'
export default function Results({ participants, pairs, matches, onReset }: { participants: Participant[]; pairs: Record<string, string> | null; matches?: { giver: string; receiver: string }[]; onReset?: () => void }) {
  const winnerId = pairs?.['winner']
  const [revealed, setRevealed] = useState<string | null>(null)
  const [fullscreen, setFullscreen] = useState(false)

  const showFor = (id?: string) => {
    if (!id) return
    setRevealed((r) => (r === id ? null : id))
  }

  return (
    <div className="results card">
      <h3 style={{ textAlign: 'left' }}>Secret Santa Results</h3>
      <p style={{ textAlign: 'left', color: 'var(--muted)', marginTop: 6 }}>Reveal one at a time to keep it secret!</p>
      <div className="reveal-bar">
        <div className="reveal-progress" onClick={() => (window.location.pathname = '/reveal')}>
          <span>↗ Fullscreen Reveal Mode</span>
        </div>
        <button className="reset-small" onClick={() => onReset?.()}>Reset All</button>
      </div>

      {pairs ? (
        winnerId ? (
          <div className="winner">
            <strong>Winner:</strong>
            <span className="match"> {participants.find((p) => p.id === winnerId)?.name ?? '—'}</span>
          </div>
        ) : (
          <ul>
            {matches && matches.map((m, i) => (
              <li key={i}>
                <div className={`card-reveal ${revealed === String(i) ? 'flipped' : ''}`}>
                  <div className="front">
                    <strong>{m.giver}</strong>
                    <button onClick={() => showFor(String(i))} aria-expanded={revealed === String(i)}>
                      {revealed === String(i) ? 'Hide' : 'Reveal'}
                    </button>
                  </div>
                  <div className="back">
                    <span className="match">{m.receiver}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )
      ) : (
        <p>No pairs yet</p>
      )}

      {fullscreen && (
        <div className="overlay" role="dialog" aria-modal>
          <div className="overlay-inner">
            <button className="overlay-close" onClick={() => setFullscreen(false)}>Close</button>
            <div className="overlay-content">
              {matches && matches.map((m, i) => (
                <div key={i} className="overlay-item">
                  <div className="overlay-name">{m.giver}</div>
                  <div className="overlay-match">{m.receiver}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
