import React from 'react'

type Props = {
  onAssign: () => void
  onReset: () => void
  onExport: () => void
  disabled?: boolean
  mode?: 'pair' | 'pick'
  onModeChange?: (mode: 'pair' | 'pick') => void
}

export default function Controls({ onAssign, onReset, onExport, disabled, mode = 'pair', onModeChange }: Props) {
  return (
    <div className="controls">
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <label style={{ fontSize: 14, color: '#666' }}>Mode</label>
        <select value={mode} onChange={(e) => onModeChange?.(e.target.value as 'pair' | 'pick')}>
          <option value="pair">Pair (Secret Santa)</option>
          <option value="pick">Pick One (Winner)</option>
        </select>
      </div>
      <button onClick={onAssign} disabled={disabled}>
        {mode === 'pair' ? 'Assign' : 'Pick'}
      </button>
      <button onClick={onReset}>Reset</button>
      <button onClick={onExport}>Export</button>
    </div>
  )
}
