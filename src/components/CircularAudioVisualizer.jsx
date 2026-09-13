import { useRef, useEffect, useState } from "react"

/**
 * CircularAudioVisualizer
 *
 * Props:
 *  audio        – HTMLAudioElement (AI playback audio)
 *  audioContext – optional shared AudioContext
 *  micStream    – MediaStream from getUserMedia (user mic, for white orb)
 *  colorScheme  – "orange" (AI, default) | "white" (User)
 *  idlePulse    – boolean, whether to show idle animation
 *  isSpeaking   – boolean, drives synthetic speech pulse
 */
const CircularAudioVisualizer = ({
  audio,
  audioContext,
  micStream,
  colorScheme = "orange",
  idlePulse = true,
  isSpeaking = false,
}) => {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 450, height: 450 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateDimensions = () => {
      const rect = container.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        setDimensions({
          width: Math.floor(rect.width),
          height: Math.floor(rect.height),
        })
      }
    }

    updateDimensions()
    const resizeObserver = new ResizeObserver(() => updateDimensions())
    resizeObserver.observe(container)

    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")

    const canvasWidth = dimensions.width
    const canvasHeight = dimensions.height
    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // ── Color palette ────────────────────────────────────────────────────────
    const isWhite = colorScheme === "white"
    const C = {
      orb0:  isWhite ? [210, 220, 255] : [255, 107, 53],
      orb1:  isWhite ? [180, 200, 255] : [255, 140, 0],
      orb2:  isWhite ? [140, 170, 240] : [255, 69, 0],
      ring:  isWhite ? [180, 200, 255] : [255, 107, 53],
      glow:  isWhite ? "#b4c8ff"       : "#ff6b35",
      wave:  isWhite ? [160, 190, 255] : [255, 107, 53],
      part:  isWhite ? [200, 215, 255] : [255, 107, 53],
    }
    const rgba = ([r, g, b], a) => `rgba(${r},${g},${b},${a})`

    // ── Audio context setup ──────────────────────────────────────────────────
    const currentAudioContext =
      audioContext ||
      window.__interviewAudioContext ||
      new (window.AudioContext || window.webkitAudioContext)()

    if (currentAudioContext.state === "suspended") {
      currentAudioContext.resume().catch(() => {})
    }

    const analyser = currentAudioContext.createAnalyser()
    analyser.fftSize = 512
    const dataArray = new Uint8Array(analyser.frequencyBinCount)

    let source
    let micAnalyser = null
    let micDataArray = null

    // AI audio source (HTMLAudioElement)
    if (audio && audio.tagName === "AUDIO") {
      try {
        if (!audio.__mediaElementSource) {
          audio.__mediaElementSource = currentAudioContext.createMediaElementSource(audio)
        }
        source = audio.__mediaElementSource
        source.connect(analyser)
        analyser.connect(currentAudioContext.destination)
      } catch (e) {
        analyser.connect(currentAudioContext.destination)
      }
    } else if (audioContext) {
      try {
        analyser.connect(currentAudioContext.destination)
      } catch (e) {}
    }

    // User mic stream — separate analyser, no destination connection (avoid echo)
    if (micStream) {
      try {
        micAnalyser = currentAudioContext.createAnalyser()
        micAnalyser.fftSize = 512
        micDataArray = new Uint8Array(micAnalyser.frequencyBinCount)
        const micSource = currentAudioContext.createMediaStreamSource(micStream)
        micSource.connect(micAnalyser)
        // Note: micAnalyser intentionally NOT connected to destination
      } catch (e) {
        console.warn("Could not connect mic stream to analyser:", e)
        micAnalyser = null
      }
    }

    // ── Particles ────────────────────────────────────────────────────────────
    let animationId
    let time = 0
    const particles = []

    let smoothAudioIntensity = 0
    let smoothAvg = 0
    const smoothingFactor = 0.85
    const decayFactor = 0.95

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        radius: Math.random() * 4 + 1,
        speed: Math.random() * 0.8 + 0.3,
        angle: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.6 + 0.4,
        baseOpacity: Math.random() * 0.6 + 0.4,
        frequency: Math.random() * 0.02 + 0.01,
        smoothSpeed: 1,
        smoothSize: 1,
      })
    }

    const draw = () => {
      animationId = requestAnimationFrame(draw)
      time += 0.02

      // Transparent background — let the tile's CSS background show through
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)

      // Read from the appropriate analyser
      const activeAnalyser = micAnalyser || analyser
      const activeData = micAnalyser ? micDataArray : dataArray
      activeAnalyser.getByteFrequencyData(activeData)

      const centerX = canvasWidth / 2
      const centerY = canvasHeight / 2
      const baseRadius = Math.min(canvasWidth, canvasHeight) / 3.8

      const currentAvg = activeData.reduce((a, b) => a + b, 0) / activeData.length
      let activeAvg = currentAvg
      if (isSpeaking && !micStream) {
        const simulatedSpeechPulse =
          45 + Math.sin(time * 10) * 20 + Math.cos(time * 18) * 15 + (Math.random() - 0.5) * 10
        activeAvg = Math.max(currentAvg, simulatedSpeechPulse)
      }

      const hasAudio = activeAvg > 20

      if (hasAudio) {
        smoothAvg = smoothAvg * smoothingFactor + activeAvg * (1 - smoothingFactor)
      } else {
        smoothAvg = smoothAvg * decayFactor
      }

      const audioIntensity = Math.min(smoothAvg / 50, 2)
      smoothAudioIntensity = smoothAudioIntensity * smoothingFactor + audioIntensity * (1 - smoothingFactor)

      const effectiveIntensity = smoothAudioIntensity
      const smoothIntensity = effectiveIntensity > 0.1 ? 0.3 + effectiveIntensity * 0.7 : 1

      // ── Central orb ───────────────────────────────────────────────────────
      const baseOrbPulse = 35 + Math.sin(time * 1.5) * 12
      const audioOrbPulse = 35 + Math.sin(time * 3) * 18 + effectiveIntensity * 25
      const orbRadius = baseOrbPulse + (audioOrbPulse - baseOrbPulse) * Math.min(effectiveIntensity * 2, 1)

      const orbGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, orbRadius)
      const orbIntensity = 0.9 + effectiveIntensity * 0.1

      orbGradient.addColorStop(0, rgba(C.orb0, orbIntensity))
      orbGradient.addColorStop(0.4, rgba(C.orb1, orbIntensity * 0.7))
      orbGradient.addColorStop(0.8, rgba(C.orb2, orbIntensity * 0.4))
      orbGradient.addColorStop(1, "rgba(15, 23, 42, 0)")

      ctx.beginPath()
      ctx.arc(centerX, centerY, orbRadius, 0, Math.PI * 2)
      ctx.fillStyle = orbGradient
      ctx.fill()

      // ── Rotating rings ────────────────────────────────────────────────────
      const baseRingCount = 4
      for (let ring = 0; ring < baseRingCount; ring++) {
        const ringRadius = baseRadius + ring * 40
        const baseOpacity = 0.4 - ring * 0.1
        const audioOpacity = (0.5 - ring * 0.08) * smoothIntensity
        const ringOpacity = baseOpacity + (audioOpacity - baseOpacity) * Math.min(effectiveIntensity * 2, 1)

        const baseRotationSpeed = (ring + 1) * 0.3
        const audioRotationSpeed = (ring + 1) * 0.5 + effectiveIntensity * 0.3
        const rotationSpeed = baseRotationSpeed + (audioRotationSpeed - baseRotationSpeed) * Math.min(effectiveIntensity * 2, 1)

        const basePulse = Math.sin(time * 2) * 4
        const audioPulse = Math.sin(time * 4 + ring) * effectiveIntensity * 12
        const pulseEffect = basePulse + audioPulse * Math.min(effectiveIntensity * 2, 1)

        ctx.beginPath()
        ctx.arc(centerX, centerY, ringRadius + pulseEffect, 0, Math.PI * 2)
        ctx.strokeStyle = rgba(C.ring, ringOpacity * (0.5 + Math.sin(time * 2) * 0.3))
        ctx.lineWidth = 2 + Math.min(effectiveIntensity * 2, 1)
        ctx.setLineDash([18, 28])
        ctx.lineDashOffset = time * rotationSpeed * 50
        ctx.stroke()
        ctx.setLineDash([])

        if (effectiveIntensity > 0.3) {
          ctx.shadowColor = C.glow
          ctx.shadowBlur = 10 * Math.min(effectiveIntensity, 1)
          ctx.stroke()
          ctx.shadowBlur = 0
        }
      }

      // ── Particles ─────────────────────────────────────────────────────────
      particles.forEach((particle, index) => {
        const audioEffect = effectiveIntensity > 0.1 ? activeData[index % activeData.length] / 255 : 0
        const targetSpeedMultiplier = 1 + audioEffect * 2
        particle.smoothSpeed = particle.smoothSpeed * smoothingFactor + targetSpeedMultiplier * (1 - smoothingFactor)

        const targetSizeMultiplier = 1 + audioEffect * 3
        particle.smoothSize = particle.smoothSize * smoothingFactor + targetSizeMultiplier * (1 - smoothingFactor)

        particle.x += Math.cos(particle.angle) * particle.speed * particle.smoothSpeed
        particle.y += Math.sin(particle.angle) * particle.speed * particle.smoothSpeed
        particle.angle += particle.frequency + (effectiveIntensity > 0.1 ? audioEffect * 0.05 : 0)

        if (particle.x < 0) particle.x = canvasWidth
        if (particle.x > canvasWidth) particle.x = 0
        if (particle.y < 0) particle.y = canvasHeight
        if (particle.y > canvasHeight) particle.y = 0

        const audioReactivity = effectiveIntensity > 0.1 ? audioEffect : 0
        const pulseOpacity = particle.baseOpacity * (0.5 + Math.sin(time * 2 + index) * 0.5)
        const finalOpacity = pulseOpacity + audioReactivity * 0.5 * Math.min(effectiveIntensity * 2, 1)
        const particleSize = particle.radius * particle.smoothSize

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particleSize, 0, Math.PI * 2)
        ctx.fillStyle = rgba(C.part, Math.min(1, finalOpacity))
        ctx.fill()
      })

      // ── Energy waves ──────────────────────────────────────────────────────
      for (let wave = 0; wave < 3; wave++) {
        const waveRadius = baseRadius * 1.6 + wave * 45 + Math.sin(time * 2 + wave * Math.PI) * 20
        const waveOpacity = 0.2 * (1 - wave * 0.25)

        ctx.beginPath()
        ctx.arc(centerX, centerY, waveRadius, 0, Math.PI * 2)
        ctx.strokeStyle = rgba(C.wave, waveOpacity)
        ctx.lineWidth = 1.5
        ctx.stroke()
      }
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      if (audioContext && audioContext.state !== "closed") {
        audioContext.close()
      }
    }
  }, [audio, audioContext, micStream, colorScheme, idlePulse, isSpeaking, dimensions])

  return (
    <div ref={containerRef} className="w-full h-full flex justify-center items-center overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  )
}

export default CircularAudioVisualizer