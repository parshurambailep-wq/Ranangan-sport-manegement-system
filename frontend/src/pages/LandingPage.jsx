import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { motion } from 'framer-motion'
import LocomotiveScroll from 'locomotive-scroll'
import { useEffect } from 'react'

function Stadium() {
  return (
    <mesh>
      <cylinderGeometry args={[5, 5, 1, 64]} />
      <meshStandardMaterial color="#00f5a0" />
    </mesh>
  )
}

export default function LandingPage() {
  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: document.querySelector('#scroll-root'),
      smooth: true,
    })
    return () => scroll.destroy()
  }, [])

  return (
    <div id="scroll-root" className="min-h-screen bg-gradient-to-b from-black via-dark to-black text-white">
      <header className="flex items-center justify-between px-10 py-6">
        <motion.h1
          className="text-2xl font-bold tracking-wide"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Sports<span className="text-primary">Sphere</span>
        </motion.h1>
        <nav className="space-x-6 text-sm uppercase tracking-widest">
          <a href="#features" className="hover:text-primary">
            Features
          </a>
          <a href="#games" className="hover:text-primary">
            Games
          </a>
          <a href="#dashboard" className="hover:text-primary">
            Dashboards
          </a>
        </nav>
      </header>

      <main className="px-10 pb-32">
        <section className="grid gap-10 md:grid-cols-2 items-center py-16">
          <div>
            <motion.h2
              className="text-5xl md:text-6xl font-black leading-tight mb-6"
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              Manage Every <span className="text-primary">Game</span>,
              <br />
              Player & <span className="text-secondary">Moment</span>.
            </motion.h2>
            <motion.p
              className="text-gray-300 mb-8 max-w-lg"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              A full-stack sports management platform with real-time scoring, analytics, payments, and cinematic
              3D visuals.
            </motion.p>
            <motion.div className="flex gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <a
                href="/auth/register"
                className="px-6 py-3 rounded-full bg-primary text-black font-semibold shadow-lg shadow-primary/40"
              >
                Get Started
              </a>
              <a
                href="/admin"
                className="px-6 py-3 rounded-full border border-gray-600 hover:border-primary transition"
              >
                View Dashboard
              </a>
            </motion.div>
          </div>
          <motion.div
            className="h-[420px] rounded-3xl bg-black/40 border border-white/10 overflow-hidden shadow-[0_0_80px_rgba(0,245,160,0.35)]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Canvas camera={{ position: [0, 8, 12], fov: 50 }}>
              <ambientLight intensity={0.6} />
              <spotLight position={[10, 15, 10]} angle={0.3} />
              <Stadium />
              <OrbitControls enablePan={false} />
            </Canvas>
          </motion.div>
        </section>
      </main>
    </div>
  )
}

