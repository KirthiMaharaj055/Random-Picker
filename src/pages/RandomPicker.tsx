import React, { useEffect, useState } from 'react'
import NameInput from '../components/NameInput'
import ParticipantsList from '../components/ParticipantsList'
import Results from '../components/Results'

// --- Team Assignments Card ---
function TeamAssignments({ teams, onClear }: { teams: Team[]; onClear: () => void }) {
    const totalParticipants = teams.reduce((sum, t) => sum + t.members.length, 0);
    if (teams.length === 0) return null;
    return (
        <div className="team-assignments-card">
            <div className="team-assignments-header">
                <div>
                    <div className="team-assignments-title">Team Assignments</div>
                    <div className="team-assignments-subtitle">{teams.length} teams with {totalParticipants} total participants</div>
                </div>
                <button className="btn-clear-teams" onClick={onClear}>Clear Teams</button>
            </div>
            <div className="team-grid">
                {teams.map((team, idx) => (
                    <div className="team-card" key={team.id}>
                        <div className="team-card-header">
                            <span className="team-badge">{idx + 1}</span>
                            <span className="team-name">{team.name}</span>
                        </div>
                        <div className="team-members">
                            {team.members.map((member, i) => (
                                <span className="team-member-pill" key={i}>{member}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
import { createDerangement } from '../utils/derange'
import { pickOne } from '../utils/derange'
import { burstConfetti } from '../utils/confetti'
import { Gift, Shuffle, UsersRound } from 'lucide-react'
import Confetti from "react-confetti";
import { toast } from "sonner";


export type Participant = {
    id: string
    name: string
    teamId?: string
}

export type Team = { id: string; name: string ,  members: string[];}

const STORAGE_KEY = 'random-picker:participants'
const PAIRING_KEY = 'random-picker:pairs'

export default function RandomPicker() {
    const [participants, setParticipants] = useState<Participant[]>([])
    const [pairs, setPairs] = useState<Record<string, string> | null>(null)
    const [matches, setMatches] = useState<{ giver: string; receiver: string }[]>([])
    const [teams, setTeams] = useState<Team[]>([]);
    const [numberOfTeams, setNumberOfTeams] = useState<string>("2");

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

    const [teamCount, setTeamCount] = useState<number>(0)

    useEffect(() => {
        // if teams were loaded from storage, reflect count
        setTeamCount(teams.length)
    }, [teams.length])

    const removeTeam = (id: string) => {
        // remove team and clear teamId on participants
        setTeams((t) => t.filter((x) => x.id !== id))
        setParticipants((p) => p.map((x) => (x.teamId === id ? { ...x, teamId: undefined } : x)))
    }

    const remove = (id: string) => {
        setParticipants((s) => s.filter((p) => p.id !== id))
    }

    const shuffleArray = <T,>(array: T[]): T[] => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const generateTeams = () => {
        const numTeams = parseInt(numberOfTeams);
        if (participants.length < numTeams) {
            toast.error(`You need at least ${numTeams} participants for ${numTeams} teams!`);
            return;
        }

        const shuffled = shuffleArray([...participants]);
        const newTeams: Team[] = Array.from({ length: numTeams }, (_, i) => 
            ({ id: cryptoRandomId(), name: `Team ${i + 1}`, members: []}))

        // const newTeams: Team[] = Array.from({ length: numTeams }, (_, i) => ({
        //     name: `Team ${i + 1}`,
        //     members: [],
        // }));[]

        shuffled.forEach((participant, index) => {
            newTeams[index % numTeams].members.push(participant.name);
        });

        setTeams(newTeams);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        toast.success(`${numTeams} teams created!`);
    };

    const getMaxTeams = () => {
        return Math.max(2, participants.length);
    };


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
                {/* show participants as chips inside the same card */}
                <div style={{ marginTop: 12 }}>
                    <ParticipantsList items={participants} onRemove={remove} teams={teams} onRemoveTeam={removeTeam} />
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
                    <select
                        className="h-16 w-24 text-lg rounded-lg border border-gray-300 px-3 py-2 mr-2"
                        value={numberOfTeams}
                        onChange={e => setNumberOfTeams(e.target.value)}
                        style={{ minWidth: 90 }}
                    >
                        {Array.from({ length: Math.max(1, getMaxTeams() - 1) }, (_, i) => i + 2).map((num) => (
                            <option key={num} value={num.toString()}>
                                {num} teams
                            </option>
                        ))}
                    </select>
                    <button className="btn btn-assign" onClick={generateTeams} disabled={participants.length === 0}>
                        <UsersRound className="w-5 h-5 mr-2" />
                        Assign Teams
                    </button>
                </div>
            </div>
            {/* Team Assignments Card Section */}
            <TeamAssignments teams={teams} onClear={() => setTeams([])} />
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
function setShowConfetti(arg0: boolean): void {
    // Placeholder for confetti effect
}

