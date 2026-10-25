import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, useProgress } from '@react-three/drei'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../api/client'
import * as THREE from 'three'

function Loader(){
  const {progress}=useProgress()
  return <Html center><div className="px-4 py-2 rounded-lg bg-black/70">Yuklanmoqda {progress.toFixed(0)}%</div></Html>
}

function Penguin({artworks}:{artworks:any[]}){
  const ref = useRef<THREE.Group>(null!)
  const keys:any = {}
  useEffect(()=>{
    const kd=(e:any)=>{const m={ArrowUp:'w',ArrowDown:'s',ArrowLeft:'a',ArrowRight:'d'};if(m[e.key]){keys[m[e.key]]=true;e.preventDefault()}}
    const ku=(e:any)=>{const m={ArrowUp:'w',ArrowDown:'s',ArrowLeft:'a',ArrowRight:'d'};if(m[e.key])keys[m[e.key]]=false}
    addEventListener('keydown',kd); addEventListener('keyup',ku)
    return ()=>{removeEventListener('keydown',kd);removeEventListener('keyup',ku)}
  },[])
  useFrame((state,dt)=>{
    if(!ref.current) return
    let fx=(keys.d?1:0)-(keys.a?1:0), fz=(keys.w?1:0)-(keys.s?1:0)
    if(fx||fz){
      const len=Math.hypot(fx,fz); fx/=len; fz/=len
      ref.current.position.x += fx*3.2*dt
      ref.current.position.z -= fz*3.2*dt
      ref.current.rotation.y = Math.atan2(fx,-fz)
    }
  })
  return (
    <group ref={ref} position={[-16,0,5]} scale={0.9}>
      <mesh position={[0,0.9,-0.03]} scale={[0.64,0.82,0.56]}>
        <sphereGeometry args={[1,28,20]}/>
        <meshStandardMaterial color={0x1c1d22} roughness={0.7}/>
      </mesh>
      <mesh position={[0,0.85,0.17]} scale={[0.52,0.72,0.45]}>
        <sphereGeometry args={[1,28,20]}/>
        <meshStandardMaterial color={0xf5f2ea} roughness={0.95}/>
      </mesh>
      <mesh position={[0,1.78,0]}>
        <sphereGeometry args={[0.58,28,20]}/>
        <meshStandardMaterial color={0x1c1d22} roughness={0.7}/>
      </mesh>
      <mesh position={[0,1.56,0.42]} scale={[0.3,0.25,0.17]}>
        <sphereGeometry args={[1,16,12]}/>
        <meshStandardMaterial color={0xf5f2ea}/>
      </mesh>
      <mesh position={[0,1.64,0.58]} scale={[0.15,0.075,0.13]}>
        <sphereGeometry args={[1,16,12]}/>
        <meshStandardMaterial color={0xff6a1a}/>
      </mesh>
      <mesh position={[-0.24,0.07,0.22]} scale={[0.2,0.07,0.3]}>
        <sphereGeometry args={[1,16,12]}/>
        <meshStandardMaterial color={0xff7a1a}/>
      </mesh>
      <mesh position={[0.24,0.07,0.22]} scale={[0.2,0.07,0.3]}>
        <sphereGeometry args={[1,16,12]}/>
        <meshStandardMaterial color={0xff7a1a}/>
      </mesh>
    </group>
  )
}

function Frames({artworks}:{artworks:any[]}){
  const [tex,setTex]=useState<THREE.Texture[]>([])
  useEffect(()=>{
    const arr:THREE.Texture[]=[]
    artworks.slice(0,48).forEach((a,idx)=>{
      const t=new THREE.TextureLoader().load(a.image)
      t.encoding = THREE.sRGBEncoding
      arr.push(t)
    })
    setTex(arr)
    return ()=>arr.forEach(t=>t.dispose())
  },[artworks])
  const slots: any[]=[]
  let n=0
  const make=(x:number,z:number,ry:number,i:number)=>{
    const a=artworks[i]; if(!a) return
    const t=tex[i]
    const ratio=a.width/a.height
    let pw=4,ph=4/ratio; if(ratio<=4/3){ph=3; pw=3*ratio}
    slots.push(<group key={n++} position={[x,3.3,z]} rotation={[0,ry,0]}>
      <mesh>
        <boxGeometry args={[pw+.35,ph+.35,.15]}/>
        <meshStandardMaterial color={0xb8892e} metalness={0.5} roughness={0.4}/>
      </mesh>
      <mesh position={[0,0,.09]}>
        <planeGeometry args={[pw,ph]}/>
        <meshStandardMaterial map={t} roughness={0.7}/>
      </mesh>
    </group>)
  }
  const RX=[-16,0,16]
  RX.forEach((cx)=>{
    let c=0
    for(let i=0;i<4 && artworks[n];i++){ make(cx-6+i*4, -10+.08, 0, n++); c++ }
    for(let i=0;i<4 && artworks[n];i++){ make(cx-6+i*4, 10-.08, Math.PI, n++); c++ }
  })
  make(-W/2+.08,-5,Math.PI/2, n++); make(-W/2+.08,5,Math.PI/2,n++)
  return <>{slots}</>
}

const W=48,D=20,H=7

export default function MuseumViewer(){
  const {slug}=useParams()
  const {data}=useQuery({queryKey:['pubv',slug], queryFn: async()=> (await api.get(`/public/museums/${slug}/`)).data})
  const [room,setRoom]=useState(0)
  useEffect(()=>{ if(slug) api.post(`/public/museums/${slug}/visit/`) },[slug])
  const RX=[-16,0,16], names=['Rasm galereyasi','Tabiat va dinozavrlar zali','Qadimiy tarix zali']
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{position:[-16,5,12],fov:60}}>
        <color attach="background" args={[0x10131a]}/>
        <hemisphereLight args={[0xfff4e0,0x3a3a4a,0.7]}/>
        <Suspense fallback={<Loader/>}>
          <group>
            <mesh rotation={[-Math.PI/2,0,0]} position={[0,0,0]}>
              <planeGeometry args={[W,D]}/>
              <meshStandardMaterial color={0x1a1f2b}/>
            </mesh>
            <mesh rotation={[Math.PI/2,0,0]} position={[0,H,0]}>
              <planeGeometry args={[W,D]}/>
              <meshStandardMaterial color={0xeeeae0}/>
            </mesh>
            {RX.map((cx,i)=><group key={i}>
              <mesh position={[cx,-D/2,0]} rotation={[0,0,0]}>
                <planeGeometry args={[16,H]}/>
                <meshStandardMaterial color={[0xe9e2d3,0xd3e6da,0xebd9c6][i]}/>
              </mesh>
              <mesh position={[cx,D/2,0]} rotation={[0,Math.PI,0]}>
                <planeGeometry args={[16,H]}/>
                <meshStandardMaterial color={[0xe9e2d3,0xd3e6da,0xebd9c6][i]}/>
              </mesh>
            </group>)}
            <mesh position={[-W/2,3.5,0]} rotation={[0,Math.PI/2,0]}>
              <planeGeometry args={[D,H]}/>
              <meshStandardMaterial color={0xe9e2d3}/>
            </mesh>
            <mesh position={[W/2,3.5,0]} rotation={[0,-Math.PI/2,0]}>
              <planeGeometry args={[D,H]}/>
              <meshStandardMaterial color={0xebd9c6}/>
            </mesh>
            <Frames artworks={data?.artworks||[]}/>
            <Penguin artworks={data?.artworks||[]}/>
          </group>
        </Suspense>
        <directionalLight position={[10,20,10]} intensity={0.4}/>
      </Canvas>
      <div className="absolute top-3 left-3 flex gap-2">
        <div className="px-3 py-1 rounded-lg bg-black/60">📍 {names[room]}</div>
        <div className="px-3 py-1 rounded-lg bg-black/60">{data?.title}</div>
      </div>
      <div className="absolute top-3 right-3 flex gap-2">
        <Link to={`/m/${slug}`} className="px-3 py-1 rounded-lg bg-black/60">Ulashish</Link>
        <Link to="/" className="px-3 py-1 rounded-lg bg-black/60">Chiqish</Link>
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg bg-black/60 text-sm">WASD / strelkalar</div>
    </div>
  )
}
