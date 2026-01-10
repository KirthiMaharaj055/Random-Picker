import React, { useEffect, useState } from 'react'
import NameInput from '../components/NameInput'
import ParticipantsList from '../components/ParticipantsList'
import Results from '../components/Results'
import { createDerangement } from '../utils/derange'
import { pickOne } from '../utils/derange'
import { burstConfetti } from '../utils/confetti'
import { Gift, Shuffle } from 'lucide-react'

export type Participant = {
  id: string
  name: string
  teamId?: string
}

export type Team = { id: string; name: string }

const STORAGE_KEY = 'random-picker:participants'
const PAIRING_KEY = 'random-picker:pairs'

export default function RandomPicker() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [pairs, setPairs] = useState<Record<string, string> | null>(null)
  const [matches, setMatches] = useState<{ giver: string; receiver: string }[]>([])

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) setParticipants(JSON.parse(raw))
    const p = localStorage.getItem(PAIRING_KEY)
    if (p) setPairs(JSON.parse(p))
    const t = localStorage.getItem('random-picker:teams')
    if (t) setTeams(JSON.parse(t))
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(participants))
  }, [participants])

  useEffect(() => {
    localStorage.setItem('random-picker:teams', JSON.stringify(teams))
  }, [teams])

  const add = (name: string, teamId?: string) => {
    setParticipants((s) => [...s, { id: cryptoRandomId(), name, teamId }])
  }

  const addTeam = (name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setTeams((t) => [...t, { id: cryptoRandomId(), name: trimmed }])
  }

  const [teamCount, setTeamCount] = useState<number>(0)

  useEffect(() => {
    // if teams were loaded from storage, reflect count
    setTeamCount(teams.length)
  }, [teams.length])

  const createTeams = (n: number) => {
    if (n <= 0) {
      setTeams([])
      // also clear any participant team assignments
      setParticipants((p) => p.map((x) => ({ ...x, teamId: undefined })))
      return
    }
    const newTeams: Team[] = Array.from({ length: n }, (_, i) => ({ id: cryptoRandomId(), name: `Team ${i + 1}` }))
    setTeams(newTeams)
    // don't auto-assign participants; users can pick teams when adding names
  }

  const removeTeam = (id: string) => {
    // remove team and clear teamId on participants
    setTeams((t) => t.filter((x) => x.id !== id))
    setParticipants((p) => p.map((x) => (x.teamId === id ? { ...x, teamId: undefined } : x)))
  }

  const remove = (id: string) => {
    setParticipants((s) => s.filter((p) => p.id !== id))
  }

  const assignTeams = () => {
    if (!teams || teams.length === 0) return alert('Create teams first')
    if (participants.length === 0) return alert('Add participants first')

    // simple shuffle
    const shuffled = [...participants]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    // assign round-robin across teams
    const assigned = shuffled.map((p, idx) => ({ ...p, teamId: teams[idx % teams.length].id }))

    // restore original order but with teamIds updated
    const assignedById = new Map(assigned.map((a) => [a.id, a.teamId]))
    const final = participants.map((p) => ({ ...p, teamId: assignedById.get(p.id) }))
    setParticipants(final)
    burstConfetti()
  }

  const [mode, setMode] = useState<'pair' | 'pick'>('pair')

  const assign = () => {
    if (mode === 'pick') {
      const winner = pickOne(participants)
      if (!winner) return alert('No participants')
      burstConfetti()
      // store winner id only
      setMatches([])
      setPairs({ winner: winner.id })
      localStorage.setItem(PAIRING_KEY, JSON.stringify({ winner: winner.id }))
      return
    }

    try {
      const ids = participants.map((p) => p.id)
      const result = createDerangement(ids)
      const map: Record<string, string> = {}
      const generatedMatches: { giver: string; receiver: string }[] = []
      for (let i = 0; i < participants.length; i++) {
        const giver = participants[i]
        const receiverId = ids[result[i]]
        const receiver = participants.find((p) => p.id === receiverId)
        if (!receiver) throw new Error('Receiver not found')
        map[giver.id] = receiver.id
        generatedMatches.push({ giver: giver.name, receiver: receiver.name })
      }
      setPairs(map)
      setMatches(generatedMatches)
      localStorage.setItem(PAIRING_KEY, JSON.stringify(map))
      // persist matches so the fullscreen reveal page can load them
      localStorage.setItem('random-picker:matches', JSON.stringify(generatedMatches))
      burstConfetti()
      // navigate to reveal page
      window.location.href = '/reveal'
    } catch (e) {
      alert('Could not create pairings: ' + (e as Error).message)
    }
  }

  const reset = () => {
    setPairs(null)
    setMatches([])
    localStorage.removeItem(PAIRING_KEY)
  }

  const exportPairs = () => {
    if (!matches || matches.length === 0) return alert('No pairs to export')
    const lines = matches.map((m) => `${m.giver} -> ${m.receiver}`)
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pairs.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="page">
      <div style={{ height: 28 }} />
      <div className="logo">
        <Gift className="w-12 h-12 text-primary animate-float" />
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Random Picker
        </h1>
        <Shuffle className="w-12 h-12 text-secondary animate-float" style={{ animationDelay: '0.5s' }} />
      </div>
      <div className="hero-sub">Perfect for Secret Santa, random selections, and fun games! Add participants and let fate decide.</div>

      <div className="card">
        <h3 style={{ textAlign: 'left', margin: 0 }}>Add Participants</h3>
        <p style={{ textAlign: 'left', color: 'var(--muted)', marginTop: 6 }}>Enter names of people participating in the draw</p>
        <div className="input-row">
          <NameInput onAdd={add} teams={teams} />
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
          <label style={{ color: 'var(--muted)', minWidth: 120 }}>Number of teams</label>
          <select value={teamCount} onChange={(e) => { const n = Number(e.target.value); setTeamCount(n); createTeams(n) }} style={{ padding: 10, borderRadius: 8 }}>
            <option value={0}>0 (none)</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
          </select>
        </div>
        {/* show participants as chips inside the same card */}
        <div style={{ marginTop: 12 }}>
          <ParticipantsList items={participants} onRemove={remove} teams={teams} onRemoveTeam={removeTeam} />
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
          <input id="new-team" placeholder="New team name" style={{ flex: '1 0 260px', padding: 10, borderRadius: 8, border: '1px solid #eee' }} />
          <button onClick={() => { const el = document.getElementById('new-team') as HTMLInputElement; if (el) { addTeam(el.value); el.value = '' } }} style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--teal-dark)', color: '#fff', border: 0 }}>Add Team</button>
          <button onClick={assignTeams} style={{ padding: '10px 14px', borderRadius: 10, background: 'linear-gradient(90deg,#2fc9bf,#f08a66)', color: '#fff', border: 0 }}>Assign Teams</button>
        </div>
        <div className="actions">
          <button className="btn btn-teal" onClick={() => { setMode('pair'); assign() }} disabled={participants.length < 2}>
            <Gift className="w-5 h-5 mr-2" />
            Generate Secret Santa
          </button>
          <button className="btn btn-coral" onClick={() => { setMode('pick'); assign() }} disabled={participants.length < 1}>
            <Shuffle className="w-5 h-5 mr-2" />
            Pick Random Winner
          </button>
        </div>
      </div>
      <div style={{ height: 10 }} />
      {matches.length > 0 && (
        <Results participants={participants} pairs={pairs} matches={matches} onReset={reset} />
      )}
    </div>
  )
}

function cryptoRandomId() {
  return Math.random().toString(36).slice(2, 9)
}
