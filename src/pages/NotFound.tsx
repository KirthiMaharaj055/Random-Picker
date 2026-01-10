import React from 'react'

export default function NotFound() {
  return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24}}>
      <div style={{maxWidth: 720, textAlign: 'center'}}>
        <h1 style={{fontSize: 36, marginBottom: 8}}>Page not found</h1>
        <p style={{color: '#556', marginBottom: 20}}>Looks like the page you're looking for doesn't exist or an error occurred.</p>
        <div style={{display:'flex',gap:12,justifyContent:'center'}}>
          <button onClick={() => (window.location.pathname = '/')} style={{padding: '10px 16px', borderRadius:8, border:'0', background:'#2fc9bf', color:'#fff', fontWeight:700}}>Go home</button>
          <button onClick={() => window.location.reload()} style={{padding: '10px 16px', borderRadius:8, border:'1px solid #e6e6ef', background:'#fff'}}>Reload</button>
        </div>
      </div>
    </div>
  )
}
