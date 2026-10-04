"use client"

import React, { useEffect, useRef } from "react"
import { ArrowRight, Mic, ChevronRight } from "lucide-react"

const STEPS = [
  { num: "1", title: "Add your resume" },
  { num: "2", title: "Pick a role" },
  { num: "3", title: "Start the interview" },
]

const LINE_COUNT = 60
const SEGMENT_COUNT = 80
const FADE_ALPHA = 0.1 // same as the original: each frame is painted over at 10%
const PAGE_RGB = [31, 30, 29] // warm-page (#1F1E1D)

// Why the old version left a pale haze: canvas colours are whole numbers, so the
// 10% fade stops a few shades short of its target and the last of each line never
// clears. Here we measure where the fade really stops in this browser and choose a
// fade colour that makes it stop exactly on the page colour. The whole canvas then
// settles on one uniform colour, so there is no lighter patch left behind.
const calibrateFade = () => {
  try {
    const probe = document.createElement("canvas")
    probe.width = 1
    probe.height = 1
    const p = probe.getContext("2d", { willReadFrequently: true })

    const settle = (target) => {
      p.fillStyle = "rgb(255, 255, 255)"
      p.fillRect(0, 0, 1, 1)
      p.fillStyle = `rgba(${target[0]}, ${target[1]}, ${target[2]}, ${FADE_ALPHA})`
      for (let i = 0; i < 150; i++) p.fillRect(0, 0, 1, 1)
      const d = p.getImageData(0, 0, 1, 1).data
      return [d[0], d[1], d[2]]
    }

    const fade = [0, 0, 0]
    const rest = [0, 0, 0]
    const best = [Infinity, Infinity, Infinity]

    // Channels fade independently, so pick the best offset for each one
    for (let offset = 0; offset <= 12; offset++) {
      const target = PAGE_RGB.map((c) => Math.max(0, c - offset))
      const result = settle(target)
      for (let ch = 0; ch < 3; ch++) {
        const miss = Math.abs(result[ch] - PAGE_RGB[ch])
        if (miss < best[ch]) {
          best[ch] = miss
          fade[ch] = target[ch]
          rest[ch] = result[ch]
        }
      }
    }
    return { fade, rest }
  } catch {
    return { fade: PAGE_RGB.map((c) => c - 4), rest: PAGE_RGB }
  }
}

// ── Waveform canvas (sized to its container, not the window) ────────────────
const WaveformCanvas = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    if (!canvas || !host) return

    const ctx = canvas.getContext("2d", { alpha: false })
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const { fade, rest } = calibrateFade()
    const fadeStyle = `rgba(${fade[0]}, ${fade[1]}, ${fade[2]}, ${FADE_ALPHA})`
    const restStyle = `rgb(${rest[0]}, ${rest[1]}, ${rest[2]})`

    let w = 0
    let h = 0
    let time = 0
    let rafId = 0
    let visible = true
    const mouse = { x: 0, y: 0 }

    // The original wave maths, unchanged
    const drawLines = () => {
      const cy = h * 0.5

      for (let i = 0; i < LINE_COUNT; i++) {
        const progress = i / LINE_COUNT
        const intensity = Math.sin(progress * Math.PI)

        // Blend from deep terracotta (orange-500) to soft terracotta (orange-200)
        const r = Math.round(198 + (232 - 198) * progress)
        const g = Math.round(97 + (165 - 97) * progress)
        const b = Math.round(63 + (138 - 63) * progress)

        ctx.beginPath()
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${intensity * 0.5})`
        ctx.lineWidth = 1.5

        for (let j = 0; j <= SEGMENT_COUNT; j++) {
          const x = (j / SEGMENT_COUNT) * w

          const distToMouse = Math.hypot(x - mouse.x, cy - mouse.y)
          const mouseEffect = Math.max(0, 1 - distToMouse / 400)

          const noise = Math.sin(j * 0.1 + time + i * 0.2) * 20
          const spike = Math.cos(j * 0.2 + time + i * 0.1) * Math.sin(j * 0.05 + time) * 50
          const y = cy + noise + spike * (1 + mouseEffect * 2)

          if (j === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }
    }

    let frameCount = 0

    const draw = () => {
      frameCount++

      // Normal fade/reverb.
      let currentFadeAlpha = FADE_ALPHA

      // Every ~4 seconds, gently increase the fade strength
      // for a short period to remove accumulated haze.
      const cleanupCycle = 240
      const cleanupDuration = 60

      const cyclePosition = frameCount % cleanupCycle

      if (cyclePosition < cleanupDuration) {
        // Smooth 0 → 1 → 0 curve.
        // This avoids any sudden visual change.
        const progress = cyclePosition / cleanupDuration
        const smooth = Math.sin(progress * Math.PI)

        // Normal = 0.10
        // Maximum cleanup = 0.22
        currentFadeAlpha = FADE_ALPHA + smooth * 0.12
      }

      ctx.fillStyle = `rgba(${fade[0]}, ${fade[1]}, ${fade[2]}, ${currentFadeAlpha})`
      ctx.fillRect(0, 0, w, h)

      drawLines()
      time += 0.02
    }

    const loop = () => {
      if (visible) draw()
      rafId = requestAnimationFrame(loop)
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = host.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = restStyle
      ctx.fillRect(0, 0, w, h)
      if (mouse.x === 0 && mouse.y === 0) {
        mouse.x = w / 2
        mouse.y = h / 2
      }
      if (reduceMotion) drawLines() // a single still frame
    }

    const onMouseMove = (e) => {
      const rect = host.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(host)

    // Pause drawing while the hero is scrolled out of view
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
      },
      { threshold: 0 }
    )
    visibilityObserver.observe(host)

    if (!reduceMotion) {
      window.addEventListener("mousemove", onMouseMove)
      rafId = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("mousemove", onMouseMove)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full" />
}

// ── Hero ────────────────────────────────────────────────────────────────────
const reveal = (i) => ({ animationDelay: `${0.15 + i * 0.15}s`, animationFillMode: "both" })

const HeroSection = ({ targetId = "quick-start", className = "" }) => {
  const scrollToTarget = () => {
    const el = document.getElementById(targetId)
    if (!el) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" })
  }

  return (
    <section
      className={`relative isolate w-full min-h-[100dvh] snap-start flex items-center justify-center overflow-hidden bg-warm-page text-warm-text ${className}`}
    >
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <WaveformCanvas />
      </div>

      {/* Soft dark pool behind the text so it stays readable over the lines */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 42% at 50% 50%, rgba(31,30,29,0.78), rgba(31,30,29,0) 100%)",
        }}
      />

      {/* Fade into the page so the input section below joins without a seam */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-warm-page via-warm-page/30 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-48 z-10 pointer-events-none bg-gradient-to-t from-warm-page to-transparent"
      />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-6 py-28 max-w-4xl">
        <div
          style={reveal(0)}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-400/10 border border-orange-400/25 mb-7 backdrop-blur-sm animate-fade-in motion-reduce:animate-none"
        >
          <Mic className="h-4 w-4 text-orange-300" />
          <span className="font-sans text-sm font-medium text-warm-text">
            AI-powered interview practice
          </span>
        </div>

        <h1
          style={reveal(1)}
          className="font-display text-[clamp(3.25rem,10vw,7.5rem)] font-semibold leading-[1.05] pb-1 tracking-[-0.04em] mb-6 bg-clip-text text-transparent bg-gradient-to-b from-warm-text to-warm-muted animate-slide-up motion-reduce:animate-none"
        >
          Interview Agent
        </h1>

        <p
          style={reveal(2)}
          className="font-sans max-w-2xl text-[17px] sm:text-xl text-warm-muted leading-relaxed mb-10 animate-slide-up motion-reduce:animate-none"
        >
          Upload your resume, add the role you want, and practise with an interviewer that
          responds to your answers and gives you{" "}
          <span className="text-orange-300 font-semibold">instant feedback</span>.
        </p>

        <div style={reveal(3)} className="animate-slide-up motion-reduce:animate-none">
          <button
            type="button"
            onClick={scrollToTarget}
            className="group inline-flex items-center gap-2 h-[52px] px-8 rounded-[12px] bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-semibold text-base shadow-lg shadow-orange-500/20 transition-all duration-200 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-warm-page cursor-pointer"
          >
            Get started
            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* 3-step guide */}
        <div
          style={reveal(4)}
          className="hidden md:flex items-center justify-center gap-4 mt-14 animate-fade-in motion-reduce:animate-none"
        >
          {STEPS.map((step, idx) => (
            <React.Fragment key={step.num}>
              {idx > 0 && <ChevronRight className="w-4 h-4 text-warm-placeholder shrink-0" />}
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full border border-orange-400/30 bg-orange-400/10 flex items-center justify-center font-mono text-[12px] font-semibold text-orange-300">
                  {step.num}
                </span>
                <span className="font-sans text-[14px] text-warm-muted whitespace-nowrap">
                  {step.title}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSection