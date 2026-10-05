const W = 1440
const H = 1800

const COLORS = {
  paper: '#fbf6ec',
  ink: '#2b2724',
  muted: '#6e645a',
  accent: '#b8394a',
  soft: '#ecc4c4',
  line: 'rgba(43, 39, 36, 0.28)',
}

function fontFamilyFor(className: string) {
  const probe = document.createElement('span')
  probe.className = className
  probe.style.position = 'absolute'
  probe.style.visibility = 'hidden'
  document.body.appendChild(probe)
  const family = getComputedStyle(probe).fontFamily
  probe.remove()
  return family
}

function paperPattern(ctx: CanvasRenderingContext2D) {
  const tile = document.createElement('canvas')
  tile.width = tile.height = 256
  const t = tile.getContext('2d')!
  const img = t.createImageData(256, 256)
  for (let i = 0; i < img.data.length; i += 4) {
    const n = Math.random()
    img.data[i] = 110
    img.data[i + 1] = 80
    img.data[i + 2] = 50
    img.data[i + 3] = n * 22
  }
  t.putImageData(img, 0, 0)
  return ctx.createPattern(tile, 'repeat')!
}

function heartPath(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const s = size / 2
  ctx.beginPath()
  ctx.moveTo(x, y + s * 0.9)
  ctx.bezierCurveTo(x - s * 1.6, y - s * 0.1, x - s * 0.8, y - s * 1.3, x, y - s * 0.45)
  ctx.bezierCurveTo(x + s * 0.8, y - s * 1.3, x + s * 1.6, y - s * 0.1, x, y + s * 0.9)
  ctx.closePath()
}

function heart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color = COLORS.accent, rot = 0) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rot)
  heartPath(ctx, 0, 0, size)
  ctx.fillStyle = color
  ctx.fill()
  ctx.restore()
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else line = test
  }
  if (line) lines.push(line)
  return lines
}

function textWithHeart(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number) {
  ctx.fillText(text, x, y)
  const w = ctx.measureText(text).width
  heart(ctx, x + w + size * 0.55, y - size * 0.32, size * 0.62)
}

function setSpacing(ctx: CanvasRenderingContext2D, px: number) {
  if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${px}px`
}

export async function renderKeepsake(): Promise<Blob> {
  const serif = fontFamilyFor('font-serif')
  const hand = fontFamilyFor('font-hand')
  // A blocked or slow fallback font must not prevent saving the card.
  const fonts = Promise.allSettled([
    document.fonts.load(`500 80px ${serif}`),
    document.fonts.load(`italic 500 80px ${serif}`),
    document.fonts.load(`600 80px ${hand}`),
  ])
  await new Promise<void>((resolve) => {
    const timeout = window.setTimeout(resolve, 2500)
    void fonts.then(() => { clearTimeout(timeout); resolve() })
  })

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  ctx.textBaseline = 'alphabetic'

  ctx.fillStyle = COLORS.paper
  ctx.fillRect(0, 0, W, H)
  const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.8)
  vignette.addColorStop(0, 'rgba(255,252,245,0)')
  vignette.addColorStop(1, 'rgba(160,120,70,0.12)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = paperPattern(ctx)
  ctx.fillRect(0, 0, W, H)

  ctx.strokeStyle = 'rgba(43, 39, 36, 0.35)'
  ctx.lineWidth = 3
  ctx.strokeRect(44, 44, W - 88, H - 88)
  ctx.setLineDash([14, 10])
  ctx.lineWidth = 2
  ctx.strokeStyle = COLORS.line
  ctx.strokeRect(76, 76, W - 152, H - 152)
  ctx.setLineDash([])

  // Stamp
  ctx.save()
  ctx.translate(W - 290, 250)
  ctx.rotate((4 * Math.PI) / 180)
  ctx.fillStyle = 'rgba(236, 196, 196, 0.28)'
  ctx.fillRect(-100, -120, 200, 240)
  ctx.setLineDash([4, 8])
  ctx.lineWidth = 4
  ctx.lineCap = 'round'
  ctx.strokeStyle = COLORS.accent
  ctx.strokeRect(-100, -120, 200, 240)
  ctx.setLineDash([])
  heart(ctx, 0, -18, 82)
  ctx.fillStyle = COLORS.accent
  ctx.font = `500 26px ${serif}`
  setSpacing(ctx, 6)
  ctx.textAlign = 'center'
  ctx.fillText('PAR AVION', 3, 78)
  ctx.restore()

  // Postmark
  ctx.save()
  ctx.translate(W - 470, 300)
  ctx.rotate((-12 * Math.PI) / 180)
  ctx.strokeStyle = 'rgba(43, 39, 36, 0.32)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(0, 0, 86, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(0, 0, 70, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = 'rgba(43, 39, 36, 0.4)'
  ctx.font = `500 22px ${serif}`
  setSpacing(ctx, 4)
  ctx.textAlign = 'center'
  ctx.fillText('WITH LOVE', 2, -6)
  ctx.fillText('\u00B7 2026 \u00B7', 2, 26)
  for (let i = 0; i < 4; i++) {
    ctx.beginPath()
    const y = -36 + i * 24
    ctx.moveTo(100, y)
    for (let x = 100; x <= 280; x += 10) ctx.lineTo(x, y + Math.sin(x / 14) * 6)
    ctx.stroke()
  }
  ctx.restore()

  const left = 150
  const width = W - 300
  ctx.textAlign = 'left'

  ctx.fillStyle = COLORS.accent
  ctx.font = `500 38px ${serif}`
  setSpacing(ctx, 10)
  textWithHeart(ctx, 'MADE WHOLE, TOGETHER', left, 230, 38)
  setSpacing(ctx, 0)

  ctx.strokeStyle = COLORS.line
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(left, 280)
  ctx.lineTo(left + 320, 280)
  ctx.stroke()

  ctx.fillStyle = COLORS.ink
  ctx.font = `italic 500 134px ${serif}`
  let y = 560
  for (const line of wrap(ctx, 'I\u2019ll keep choosing us.', width)) {
    ctx.fillText(line, left, y)
    y += 140
  }

  y += 70
  ctx.font = `500 82px ${serif}`
  textWithHeart(ctx, 'Your effort and mine.', left, y, 82)
  y += 100
  ctx.font = `italic 500 82px ${serif}`
  for (const line of wrap(ctx, 'Together, we make us whole.', width)) {
    ctx.fillText(line, left, y)
    y += 96
  }

  y += 50
  ctx.setLineDash([12, 10])
  ctx.beginPath()
  ctx.moveTo(left, y)
  ctx.lineTo(W - left, y)
  ctx.stroke()
  ctx.setLineDash([])

  y += 90
  ctx.fillStyle = COLORS.muted
  ctx.font = `500 52px ${serif}`
  for (const line of wrap(
    ctx,
    'I\u2019m sorry. I\u2019ll keep listening, showing up, and putting in the effort. You matter to me.',
    width,
  )) {
    ctx.fillText(line, left, y)
    y += 68
  }

  y += 80
  ctx.save()
  ctx.translate(left, y)
  ctx.rotate((-2.5 * Math.PI) / 180)
  ctx.fillStyle = COLORS.accent
  ctx.font = `600 96px ${hand}`
  ctx.fillText('Thank you for being here.', 0, 0)
  ctx.restore()

  // Address lines + signature
  const bottom = H - 190
  ctx.strokeStyle = COLORS.line
  ctx.lineWidth = 2
  ctx.fillStyle = COLORS.muted
  ctx.font = `500 26px ${serif}`
  setSpacing(ctx, 6)
  ctx.fillText('TO: MY FAVOURITE PERSON', left, bottom - 70)
  setSpacing(ctx, 0)
  for (let i = 0; i < 2; i++) {
    ctx.beginPath()
    ctx.moveTo(left, bottom - 20 + i * 50)
    ctx.lineTo(left + 460, bottom - 20 + i * 50)
    ctx.stroke()
  }

  ctx.beginPath()
  ctx.moveTo(W - left - 420, bottom + 30)
  ctx.lineTo(W - left, bottom + 30)
  ctx.stroke()
  ctx.save()
  ctx.translate(W - left - 40, bottom)
  ctx.rotate((-3 * Math.PI) / 180)
  ctx.fillStyle = COLORS.ink
  ctx.font = `600 110px ${hand}`
  ctx.textAlign = 'right'
  ctx.fillText('\u2014 yours', 0, 0)
  ctx.restore()
  heart(ctx, W - left - 6, bottom - 40, 52, COLORS.accent, 0.2)

  heart(ctx, 128, 128, 30, COLORS.soft, -0.3)
  heart(ctx, W - 124, H - 128, 34, COLORS.soft, 0.3)
  heart(ctx, 124, H - 132, 22, COLORS.accent, -0.2)
  heart(ctx, W - 160, 470, 22, COLORS.soft, 0.25)

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not create image'))), 'image/png'),
  )
}
