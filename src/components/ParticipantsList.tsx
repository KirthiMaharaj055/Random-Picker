import React, { useEffect, useState } from 'react'
// Import the Participant type instead of the default export
import type { Participant, Team } from '../pages/RandomPicker'
import { Trash2 } from 'lucide-react';

type Props = { items: Participant[]; onRemove: (id: string) => void; teams?: Team[]; onRemoveTeam?: (id: string) => void }

export default function ParticipantsList({ items, onRemove, teams, onRemoveTeam }: Props) {
  // local copy to manage exit animation
  const [local, setLocal] = useState(items.map((i) => ({ ...i, removing: false })))

  useEffect(() => {
    // sync additions
    setLocal(items.map((it) => ({ ...it, removing: false })))
  }, [items])

  const handleRemove = (id: string) => {
    setLocal((cur) => cur.map((c) => (c.id === id ? { ...c, removing: true } : c)))
    setTimeout(() => onRemove(id), 420)
  }

  return (
    <div aria-live="polite">
      <p style={{ textAlign: 'left', color: 'var(--muted)', marginTop: 6 }}>{local.length} participants</p>
      <div className="chips">
        {local.map((p) => (
          <div key={p.id} className={`chip ${p.removing ? 'exit' : 'enter'}`}>
            <span className="chip-name">{p.name}</span>
            {p.teamId && teams && (
              <span className="chip-team">{teams.find((t) => t.id === p.teamId)?.name}</span>
            )}
            <button className="chip-remove" onClick={() => handleRemove(p.id)} aria-label={`Remove ${p.name}`}>
                <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {teams && teams.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <strong>Teams</strong>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {teams.map((t) => (
              <div key={t.id} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span className="chip team-chip">{t.name}</span>
                <button onClick={() => onRemoveTeam?.(t.id)} style={{ border: 0, background: 'transparent', cursor: 'pointer' }} aria-label={`Remove team ${t.name}`}>
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
