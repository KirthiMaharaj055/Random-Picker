import React, { useState } from 'react'
import type { Team } from '../pages/RandomPicker'

export default function NameInput({ onAdd, teams }: { onAdd: (name: string, teamId?: string) => void; teams?: Team[] }) {
  const [value, setValue] = useState('')
  const [teamId, setTeamId] = useState<string | undefined>(undefined)

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const name = value.trim()
    if (!name) return
    onAdd(name, teamId)
    setValue('')
    setTeamId(undefined)
  }

  return (
    <form onSubmit={submit} className="name-input" aria-label="Add participant">
      <input aria-label="participant name" placeholder="Enter participant name..." value={value} onChange={(e) => setValue(e.target.value)} />
      {teams && teams.length > 0 && (
        <select value={teamId ?? ''} onChange={(e) => setTeamId(e.target.value || undefined)}>
          <option value="">No team</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      )}
      <button type="submit" className="add">Add</button>
    </form>
  )
}
