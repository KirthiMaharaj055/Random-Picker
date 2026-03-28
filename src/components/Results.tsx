import React, { useState } from 'react'
import { Participant } from '../pages/RandomPicker'

type Team = { id: string; name: string }

export default function Results({ participants, pairs, matches, onReset }: { participants: Participant[]; pairs: Record<string, string> | null; matches?: { giver: string; receiver: string }[]; onReset?: () => void }) {
  const winnerId = pairs?.['winner']
  const [revealed, setRevealed] = useState<string | null>(null)
  const [fullscreen, setFullscreen] = useState(false)

  // read teams from storage so we can show nice team names when available
  let storedTeams: Team[] = []
  try {
    const raw = localStorage.getItem('random-picker:teams')
    if (raw) storedTeams = JSON.parse(raw)
  } catch (e) {
    storedTeams = []
  }

  const teamNameMap = new Map<string, string>(storedTeams.map((t) => [t.id, t.name]))

  const showFor = (id?: string) => {
    if (!id) return
    setRevealed((r) => (r === id ? null : id))
  }

  // group participants by teamId (or unassigned)
  const grouped = new Map<string, Participant[]>()
  participants.forEach((p) => {
    const key = p.teamId ?? '__unassigned'
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(p)
  })

  const hasTeams = storedTeams.length > 0 || Array.from(grouped.keys()).some((k) => k !== '__unassigned')

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

      {hasTeams && (
        <div className="teams">
          {storedTeams.map((t) => (
            <div key={t.id} className="team-card">
              <div className="team-header">{t.name}</div>
              <div className="team-members">
                {grouped.get(t.id)?.map((p) => (
                  <div key={p.id} className="chip">{p.name}</div>
                )) ?? <div className="chip muted">(no members)</div>}
              </div>
            </div>
          ))}

          {/* show unassigned */}
          {grouped.has('__unassigned') && (
            <div className="team-card">
              <div className="team-header">Unassigned</div>
              <div className="team-members">
                {grouped.get('__unassigned')!.map((p) => (
                  <div key={p.id} className="chip">{p.name}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

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
