export function burstConfetti(count = 24, colors = ['#38bdf8', '#fb7185', '#f97316']) {
  const root = document.createElement('div')
  root.style.position = 'fixed'
  root.style.left = '0'
  root.style.top = '0'
  root.style.width = '100%'
  root.style.height = '100%'
  root.style.pointerEvents = 'none'
  document.body.appendChild(root)

  const pieces: HTMLElement[] = []
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div')
    el.style.position = 'absolute'
    el.style.width = '10px'
    el.style.height = '14px'
    el.style.background = colors[i % colors.length]
    el.style.left = Math.random() * 100 + '%'
    el.style.top = Math.random() * 20 + '%'
    el.style.opacity = '0.95'
    el.style.transform = `translateY(0) rotate(${Math.random() * 360}deg)`
    el.style.borderRadius = '2px'
    el.style.transition = `transform 900ms cubic-bezier(.2,.9,.3,1), opacity 900ms ease-out`
    root.appendChild(el)
    pieces.push(el)
    requestAnimationFrame(() => {
      el.style.transform = `translateY(${80 + Math.random() * 40}vh) rotate(${Math.random() * 720}deg) translateX(${(Math.random() - 0.5) * 50}vw)`
      el.style.opacity = '0'
    })
  }

  setTimeout(() => {
    document.body.removeChild(root)
  }, 1200)
}
