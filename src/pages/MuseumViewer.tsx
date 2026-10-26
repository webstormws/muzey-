import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../api/client'
import * as THREE from 'three'

const W = 48, D = 20, H = 7

function makeTex(a: string, b: string) {
  const c = document.createElement('canvas')
  c.width = 256; c.height = 256
  const g = c.getContext('2d')!
  g.fillStyle = a; g.fillRect(0, 0, 256, 256)
  g.fillStyle = b; g.fillRect(0, 0, 128, 128); g.fillRect(128, 128, 128, 128)
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(4, 5)
  t.encoding = THREE.sRGBEncoding
  return t
}

function placeholder(i: number) {
  const c = document.createElement('canvas')
  c.width = 640; c.height = 480
  const g = c.getContext('2d')!
  const h = (i * 47) % 360
  const gr = g.createLinearGradient(0, 0, 640, 480)
  gr.addColorStop(0, `hsl(${h},70%,60%)`)
  gr.addColorStop(1, `hsl(${(h + 70) % 360},65%,35%)`)
  g.fillStyle = gr; g.fillRect(0, 0, 640, 480)
  for (let k = 0; k < 9; k++) {
    g.fillStyle = `hsla(${(h + k * 35) % 360},80%,${50 + k * 3}%,.45)`
    g.beginPath()
    g.arc(80 + ((k * 173 + i * 61) % 480), 70 + ((k * 97 + i * 53) % 340), 30 + ((k * 41) % 70), 0, 7)
    g.fill()
  }
  g.fillStyle = 'rgba(255,255,255,.9)'
  g.font = 'bold 34px sans-serif'
  g.textAlign = 'center'
  g.fillText('Rasm #' + (i + 1), 320, 445)
  return c
}

export default function MuseumViewer() {
  const { slug } = useParams()
  const { data } = useQuery({ queryKey: ['pubv', slug], queryFn: async () => (await api.get(`/public/museums/${slug}/`)).data })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [room, setRoom] = useState('Rasm galereyasi')
  const [ov, setOv] = useState<string | null>(null)

  useEffect(() => {
    if (slug) api.post(`/public/museums/${slug}/visit/`)
  }, [slug])

  useEffect(() => {
    const canvas = canvasRef.current!
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputEncoding = THREE.sRGBEncoding
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x10131a)
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100)

    const RX = [-16, 0, 16]
    const names = ['Rasm galereyasi', 'Tabiat va dinozavrlar zali', 'Qadimiy tarix zali']
    const wcol = [0xe9e2d3, 0xd3e6da, 0xebd9c6]
    const cols: any[] = []

    scene.add(new THREE.HemisphereLight(0xfff4e0, 0x3a3a4a, 0.7))
    RX.forEach(cx => {
      ;[-5, 5].forEach(z => {
        const l = new THREE.PointLight(0xffe2b0, 0.5, 20)
        l.position.set(cx, H - 0.6, z)
        scene.add(l)
        const b = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.1, 16), new THREE.MeshBasicMaterial({ color: 0xfff2cc }))
        b.position.set(cx, H - 0.05, z)
        scene.add(b)
      })
    })

    const fcol = [['#c9b79c', '#8f7e66'], ['#b8c9bd', '#6f8577'], ['#d2b48c', '#8a6a43']]
    RX.forEach((cx, i) => {
      const f = new THREE.Mesh(new THREE.PlaneGeometry(16, D), new THREE.MeshStandardMaterial({ map: makeTex(fcol[i][0], fcol[i][1]), roughness: 0.5 }))
      f.rotation.x = -Math.PI / 2
      f.position.x = cx
      scene.add(f)
    })
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ color: 0xeeeae0 }))
    ceil.rotation.x = Math.PI / 2
    ceil.position.y = H
    scene.add(ceil)

    function wall(x1: number, z1: number, x2: number, z2: number, y0: number, y1: number, col: any) {
      const len = Math.hypot(x2 - x1, z2 - z1)
      const m = new THREE.Mesh(new THREE.PlaneGeometry(len, y1 - y0), new THREE.MeshStandardMaterial({ color: col, roughness: 0.9, side: THREE.DoubleSide }))
      m.position.set((x1 + x2) / 2, (y0 + y1) / 2, (z1 + z2) / 2)
      m.rotation.y = Math.atan2(-(z2 - z1), x2 - x1)
      scene.add(m)
    }
    RX.forEach((cx, i) => { wall(cx - 8, -D / 2, cx + 8, -D / 2, 0, H, wcol[i]); wall(cx - 8, D / 2, cx + 8, D / 2, 0, H, wcol[i]) })
    wall(-W / 2, -D / 2, -W / 2, D / 2, 0, H, wcol[0]); wall(W / 2, -D / 2, W / 2, D / 2, 0, H, wcol[2])
    const bm = new THREE.MeshStandardMaterial({ color: 0x6b4a2b })
    ;[-8, 8].forEach(x => {
      wall(x, -D / 2, x, -2, 0, H, 0xe6e1d6); wall(x, 2, x, D / 2, 0, H, 0xe6e1d6); wall(x, -2, x, 2, 3.4, H, 0xe6e1d6)
      ;[-2, 2].forEach(z => { const p = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.4, 0.3), bm); p.position.set(x, 1.7, z); scene.add(p) })
      const t = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 4.3), bm); t.position.set(x, 3.4, 0); scene.add(t)
    })
    function sign(txt: string, x: number, y: number, z: number, ry: number, w: number, h: number, bg: string, fg: string) {
      const c = document.createElement('canvas'); c.width = 1024; c.height = Math.round(1024 * h / w)
      const g = c.getContext('2d')!
      const L = txt.split('|')
      g.fillStyle = bg; g.fillRect(0, 0, c.width, c.height)
      g.strokeStyle = fg; g.lineWidth = 6; g.strokeRect(8, 8, c.width - 16, c.height - 16)
      let fs = c.height / (L.length + 0.8) * 0.8
      g.font = 'bold ' + fs + 'px sans-serif'
      while (fs > 10 && Math.max(...L.map(q => g.measureText(q).width)) > c.width - 60) { fs -= 3; g.font = 'bold ' + fs + 'px sans-serif' }
      g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle'
      L.forEach((q, i) => g.fillText(q, c.width / 2, c.height * (i + 1) / (L.length + 1)))
      const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t }))
      m.position.set(x, y, z); m.rotation.y = ry; scene.add(m)
    }

    const slots: any[] = []
    const pickables: any[] = []
    function setImage(s: any, src: any, w: number, h: number, data: string) {
      const t = new THREE.Texture(src); t.encoding = THREE.sRGBEncoding; t.anisotropy = 4; t.needsUpdate = true
      if (s.plane.material.map) s.plane.material.map.dispose()
      s.plane.material.map = t; s.plane.material.needsUpdate = true
      const a = w / h; let pw = 4, ph = 4 / a
      if (a <= 4 / 3) { ph = 3; pw = 3 * a }
      s.plane.scale.set(pw, ph, 1); s.frame.scale.set(pw + 0.35, ph + 0.35, 1); s.data = data
    }
    function makeSlot(x: number, z: number, ry: number, i: number) {
      const g = new THREE.Group(); g.position.set(x, 3.3, z); g.rotation.y = ry
      const frame = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.15), new THREE.MeshStandardMaterial({ color: 0xb8892e, metalness: 0.5, roughness: 0.4 }))
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7, emissive: 0x222222 }))
      plane.position.z = 0.09
      const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 0.25), new THREE.MeshBasicMaterial({ color: 0xfff2cc }))
      lamp.position.set(0, 1.9, 0.2)
      g.add(frame, plane, lamp); scene.add(g)
      const s = { g, frame, plane, i, data: null }; (plane as any).userData.slot = s; pickables.push(plane); slots.push(s)
      const cv = placeholder(i); setImage(s, cv, cv.width, cv.height, cv.toDataURL('image/jpeg', 0.8))
    }
    let n = 0
    const S = (x: number, z: number, ry: number) => makeSlot(x, z, ry, n++)
    const artworksList = data?.artworks || []
    const count = Math.min(artworksList.length, 48)
    let placed = 0
    const positions = [
      ...[-20,-16,-12].flatMap(x => [[x,-D/2+0.08,0],[x,D/2-0.08,Math.PI]]),
      [-W/2+0.08,-5,Math.PI/2],
      [-W/2+0.08,5,Math.PI/2],
      ...[-4,4].flatMap(x => [[x,-D/2+0.08,0],[x,D/2-0.08,Math.PI]]),
      ...[12,20].flatMap(x => [[x,-D/2+0.08,0],[x,D/2-0.08,Math.PI]])
    ]
    positions.forEach(p => { if (placed < count) { S(p[0] as number, p[1] as number, p[2] as number); placed++ } })
    RX.forEach((cx, i) => sign(names[i], cx, 6.1, -D / 2 + 0.06, 0, 9, 1.1, '#1c2230', '#f5b335'))

    artworksList.forEach((a: any, idx: number) => {
      if (slots[idx]) {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => { setImage(slots[idx], img, img.naturalWidth, img.naturalHeight, img.src) }
        img.src = a.image
      }
    })

    const peng = new THREE.Group()
    const mk = (geo: any, col: number, sc?: any, o?: any) => {
      const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial(Object.assign({ color: col, roughness: 0.7 }, o || {})))
      if (sc) m.scale.set(sc[0], sc[1], sc[2])
      return m
    }
    const SP = new THREE.SphereGeometry(1, 28, 20)
    const at = (m: any, x: number, y: number, z: number) => { m.position.set(x, y, z); peng.add(m); return m }
    const BLK = 0x1c1d22, WHT = 0xf5f2ea, ORG = 0xff7a1a
    at(mk(SP, BLK, [0.64, 0.82, 0.56]), 0, 0.9, -0.03)
    at(mk(SP, WHT, [0.52, 0.72, 0.45], { roughness: 0.95 }), 0, 0.85, 0.17)
    at(mk(SP, BLK, [0.58, 0.54, 0.54]), 0, 1.78, 0)
    ;[-1, 1].forEach(sd => {
      const x = sd * 0.22
      at(mk(SP, 0x8a8d93, [0.15, 0.15, 0.06]), x, 1.84, 0.5)
      at(mk(SP, 0xffffff, [0.115, 0.115, 0.05], { emissive: 0x222222 }), x, 1.84, 0.535)
      at(mk(SP, 0x050505, [0.065, 0.065, 0.04]), x, 1.84, 0.57)
      at(mk(SP, 0xffffff, [0.02, 0.02, 0.02]), x + 0.02, 1.865, 0.605)
    })
    at(mk(SP, 0xff6a1a, [0.15, 0.075, 0.13], { roughness: 0.4 }), 0, 1.64, 0.58)
    const fg = new THREE.SphereGeometry(1, 16, 12); fg.translate(0, -0.8, 0)
    const fl = at(mk(fg, BLK, [0.08, 0.42, 0.2]), -0.55, 1.2, 0), fr = at(mk(fg, BLK, [0.08, 0.42, 0.2]), 0.55, 1.2, 0)
    const footL = at(mk(SP, ORG, [0.2, 0.07, 0.3], { roughness: 0.5 }), -0.24, 0.07, 0.22), footR = at(mk(SP, ORG, [0.2, 0.07, 0.3], { roughness: 0.5 }), 0.24, 0.07, 0.22)
    peng.scale.setScalar(0.9)
    peng.position.set(-16, 0, 5)
    scene.add(peng)

    const keys: any = {}
    const map: any = { ArrowUp: 'w', ArrowDown: 's', ArrowLeft: 'a', ArrowRight: 'd', w: 'w', a: 'a', s: 's', d: 'd', W: 'w', A: 'a', S: 's', D: 'd' }
    const kd = (e: any) => { if (map[e.key]) { keys[map[e.key]] = true; e.preventDefault() } }
    const ku = (e: any) => { if (map[e.key]) keys[map[e.key]] = false }
    addEventListener('keydown', kd); addEventListener('keyup', ku)

    let yaw = 0, pitch = 0.4, dist = 6, drag = false, moved = 0, lx = 0, ly = 0
    const pd = (e: any) => { drag = true; moved = 0; lx = e.clientX; ly = e.clientY; canvas.setPointerCapture(e.pointerId) }
    const pm = (e: any) => {
      if (!drag) return
      const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY; moved += Math.abs(dx) + Math.abs(dy)
      yaw -= dx * 0.005; pitch = Math.max(0.05, Math.min(1.2, pitch + dy * 0.004))
    }
    const pu = (e: any) => {
      drag = false
      if (moved < 6) {
        const r = canvas.getBoundingClientRect()
        const ray = new THREE.Raycaster()
        ray.setFromCamera(new THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera)
        const h = ray.intersectObjects(pickables)[0]
        if (h && (h.object as any).userData.slot?.data) setOv((h.object as any).userData.slot.data)
      }
    }
    const ww = (e: any) => { dist = Math.max(3, Math.min(12, dist + e.deltaY * 0.005)); e.preventDefault() }
    canvas.addEventListener('pointerdown', pd); canvas.addEventListener('pointermove', pm); canvas.addEventListener('pointerup', pu); canvas.addEventListener('wheel', ww, { passive: false })

    function resize() {
      const w = window.innerWidth, h = window.innerHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    addEventListener('resize', resize); resize()

    const camTarget = new THREE.Vector3()
    camera.position.set(-16, 5, 12)
    let heading = 0, t = 0, last = performance.now(), roomIdx = -1
    function loop(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05); last = now
      const ox = peng.position.x
      let fx = (keys.d ? 1 : 0) - (keys.a ? 1 : 0), fz = (keys.w ? 1 : 0) - (keys.s ? 1 : 0)
      const moving = fx || fz
      if (moving) {
        const len = Math.hypot(fx, fz); fx /= len; fz /= len
        const fwdX = -Math.sin(yaw), fwdZ = -Math.cos(yaw), rX = Math.cos(yaw), rZ = -Math.sin(yaw)
        const dx = fwdX * fz + rX * fx, dz = fwdZ * fz + rZ * fx
        peng.position.x += dx * 3.4 * dt; peng.position.z += dz * 3.4 * dt
        const target = Math.atan2(dx, dz)
        let d = target - heading; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI
        heading += d * Math.min(1, dt * 10)
        t += dt * 10
      } else { t *= 0.9 }
      ;[-8, 8].forEach(xw => { if (Math.abs(peng.position.x - xw) < 0.55 && Math.abs(peng.position.z) > 1.7) peng.position.x = xw + (ox > xw ? 1 : -1) * 0.55 })
      cols.forEach((c: any) => { const dx = peng.position.x - c.x, dz = peng.position.z - c.z, d = Math.hypot(dx, dz), mn = c.r + 0.4; if (d < mn && d > 0.001) { peng.position.x = c.x + dx / d * mn; peng.position.z = c.z + dz / d * mn } })
      peng.position.x = Math.max(-W / 2 + 1.2, Math.min(W / 2 - 1.2, peng.position.x))
      peng.position.z = Math.max(-D / 2 + 1.2, Math.min(D / 2 - 1.2, peng.position.z))
      peng.rotation.y = heading
      const s = Math.sin(t)
      peng.rotation.z = s * 0.08 * (moving ? 1 : 0)
      ;(peng.children[0] as any).position.y = 0.85 + Math.abs(Math.cos(t)) * 0.06 * (moving ? 1 : 0)
      fl.rotation.z = -0.9 + s * 0.35 * (moving ? 1 : 0.15); fr.rotation.z = 0.9 - s * 0.35 * (moving ? 1 : 0.15)
      footL.position.z = 0.22 + s * 0.18; footR.position.z = 0.22 - s * 0.18

      const cx = peng.position.x + Math.sin(yaw) * Math.cos(pitch) * dist
      const cz = peng.position.z + Math.cos(yaw) * Math.cos(pitch) * dist
      const cy = 1.3 + Math.sin(pitch) * dist
      const rr = Math.max(0, Math.min(2, Math.floor((peng.position.x + 24) / 16)))
      const nearDoor = Math.abs(peng.position.z) < 2.5 && Math.abs(Math.abs(peng.position.x) - 8) < 3
      let lo = -W / 2 + 0.5, hi = W / 2 - 0.5
      if (!nearDoor) { lo = -24 + 16 * rr + 0.6; hi = -24 + 16 * rr + 15.4 }
      camTarget.set(Math.max(lo, Math.min(hi, cx)), Math.min(H - 0.4, cy), Math.max(-D / 2 + 0.5, Math.min(D / 2 - 0.5, cz)))
      camera.position.lerp(camTarget, Math.min(1, dt * 8))
      if (roomIdx !== rr) { roomIdx = rr; setRoom(names[rr]) }
      camera.lookAt(peng.position.x, 1.3, peng.position.z)
      renderer.render(scene, camera)
      requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)

    return () => {
      removeEventListener('keydown', kd); removeEventListener('keyup', ku)
      removeEventListener('resize', resize)
      canvas.removeEventListener('pointerdown', pd); canvas.removeEventListener('pointermove', pm); canvas.removeEventListener('pointerup', pu); canvas.removeEventListener('wheel', ww)
      renderer.dispose()
    }
  }, [data])

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#10131a' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%', touchAction: 'none' }} />
      <div style={{ position: 'fixed', top: 10, left: 10, display: 'flex', gap: 8, flexWrap: 'wrap', pointerEvents: 'none', alignItems: 'center' }}>
        <Link to="/" style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(20,24,34,.82)', backdropFilter: 'blur(6px)', borderRadius: 12, padding: '6px 10px', textDecoration: 'none' }}>
          <img src="/logo.png" alt="WebStorm IT Company" style={{ height: 28 }}/>
        </Link>
        <div style={{ background: 'rgba(20,24,34,.82)', backdropFilter: 'blur(6px)', borderRadius: 12, padding: '8px 12px', fontSize: 13, color: '#f2f4f8', pointerEvents: 'auto' }}>📍 {room}</div>
        <div style={{ background: 'rgba(20,24,34,.82)', backdropFilter: 'blur(6px)', borderRadius: 12, padding: '8px 12px', fontSize: 13, color: '#f2f4f8', pointerEvents: 'auto' }}>{data?.title}</div>
        <Link to={`/m/${slug}`} style={{ background: 'rgba(20,24,34,.82)', backdropFilter: 'blur(6px)', borderRadius: 12, padding: '8px 12px', fontSize: 13, color: '#f2f4f8', textDecoration: 'none', pointerEvents: 'auto' }}>Ulashish</Link>
        <Link to="/" style={{ background: 'rgba(20,24,34,.82)', backdropFilter: 'blur(6px)', borderRadius: 12, padding: '8px 12px', fontSize: 13, color: '#f2f4f8', textDecoration: 'none', pointerEvents: 'auto' }}>Chiqish</Link>
      </div>
      <div style={{ position: 'fixed', bottom: 10, left: '50%', transform: 'translateX(-50%)', background: 'rgba(20,24,34,.82)', backdropFilter: 'blur(6px)', borderRadius: 12, padding: '8px 12px', fontSize: 13, color: '#f2f4f8' }}>WASD / strelkalar · sudrash · rasmga bosing</div>
      {ov && <div onClick={() => setOv(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, cursor: 'zoom-out' }}>
        <img src={ov} alt="" style={{ maxWidth: '100%', maxHeight: '100%', border: '8px solid #b8892e', borderRadius: 4, boxShadow: '0 10px 50px #000' }} />
      </div>}
    </div>
  )
}
