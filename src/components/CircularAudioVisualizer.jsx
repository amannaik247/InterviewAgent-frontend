import { useRef, useEffect } from "react"

const CircularAudioVisualizer = ({ audio, audioContext, canvasWidth = 500, canvasHeight = 500, idlePulse = true }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Use provided audioContext or create a new one
    const currentAudioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)()
    const analyser = currentAudioContext.createAnalyser()
    analyser.fftSize = 512
    const dataArray = new Uint8Array(analyser.frequencyBinCount)

    let source

    // Handle different audio sources
    if (audio && audio.tagName === "AUDIO") {
      // HTML Audio Element
      source = currentAudioContext.createMediaElementSource(audio)
      source.connect(analyser)
      analyser.connect(currentAudioContext.destination)
    } else if (audioContext) {
      // Generated audio - connect analyser to the provided audio context
      try {
        // For generated audio, we need to tap into the audio context
        // We'll connect the analyser to the destination
        analyser.connect(currentAudioContext.destination)
      } catch (e) {
        console.log("Using audio context for generated audio")
      }
    }

    let animationId
    let time = 0
    const particles = []

    // Smooth transition variables
    let smoothAudioIntensity = 0
    let smoothAvg = 0
    const smoothingFactor = 0.85 // Higher = more smoothing
    const decayFactor = 0.95 // How quickly effects fade when audio stops

    // Initialize particles
    for (let i = 0; i < 80; i++) {
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

      // Create dark background with subtle gradient
      const bgGradient = ctx.createRadialGradient(
        canvasWidth / 2,
        canvasHeight / 2,
        0,
        canvasWidth / 2,
        canvasHeight / 2,
        Math.max(canvasWidth, canvasHeight) / 2,
      )
      bgGradient.addColorStop(0, "#0a0a0a")
      bgGradient.addColorStop(1, "#000000")
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)

      analyser.getByteFrequencyData(dataArray)

      const centerX = canvasWidth / 2
      const centerY = canvasHeight / 2
      const baseRadius = Math.min(canvasWidth, canvasHeight) / 4

      // Check if there's audio activity
      const currentAvg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
      const hasAudio = currentAvg > 20

      // Smooth the audio intensity for gradual transitions
      if (hasAudio) {
        smoothAvg = smoothAvg * smoothingFactor + currentAvg * (1 - smoothingFactor)
      } else {
        smoothAvg = smoothAvg * decayFactor // Gradual decay when no audio
      }

      const audioIntensity = Math.min(smoothAvg / 50, 2)
      smoothAudioIntensity = smoothAudioIntensity * smoothingFactor + audioIntensity * (1 - smoothingFactor)

      // Use smooth values for all effects
      const effectiveIntensity = smoothAudioIntensity
      const smoothIntensity = effectiveIntensity > 0.1 ? 0.3 + effectiveIntensity * 0.7 : 1

      // Central pulsing orb (smooth transition between states)
      const baseOrbPulse = 30 + Math.sin(time * 1.5) * 10
      const audioOrbPulse = 30 + Math.sin(time * 3) * 15 + effectiveIntensity * 20
      const orbRadius = baseOrbPulse + (audioOrbPulse - baseOrbPulse) * Math.min(effectiveIntensity * 2, 1)

      const orbGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, orbRadius)
      const orbIntensity = 0.9 + effectiveIntensity * 0.1

      orbGradient.addColorStop(0, `rgba(34, 211, 238, ${orbIntensity})`)
      orbGradient.addColorStop(0.4, `rgba(14, 165, 233, ${orbIntensity * 0.7})`)
      orbGradient.addColorStop(0.8, `rgba(30, 58, 138, ${orbIntensity * 0.4})`)
      orbGradient.addColorStop(1, "rgba(15, 23, 42, 0)")

      ctx.beginPath()
      ctx.arc(centerX, centerY, orbRadius, 0, Math.PI * 2)
      ctx.fillStyle = orbGradient
      ctx.fill()

      // Rotating rings (smooth transition)
      const baseRingCount = 4
      for (let ring = 0; ring < baseRingCount; ring++) {
        const ringRadius = baseRadius + ring * 35
        const baseOpacity = 0.4 - ring * 0.1
        const audioOpacity = (0.5 - ring * 0.08) * smoothIntensity
        const ringOpacity = baseOpacity + (audioOpacity - baseOpacity) * Math.min(effectiveIntensity * 2, 1)

        const baseRotationSpeed = (ring + 1) * 0.3
        const audioRotationSpeed = (ring + 1) * 0.5 + effectiveIntensity * 0.3
        const rotationSpeed =
          baseRotationSpeed + (audioRotationSpeed - baseRotationSpeed) * Math.min(effectiveIntensity * 2, 1)

        const basePulse = Math.sin(time * 2) * 3
        const audioPulse = Math.sin(time * 4 + ring) * effectiveIntensity * 10
        const pulseEffect = basePulse + audioPulse * Math.min(effectiveIntensity * 2, 1)

        ctx.beginPath()
        ctx.arc(centerX, centerY, ringRadius + pulseEffect, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(14, 165, 233, ${ringOpacity * (0.5 + Math.sin(time * 2) * 0.3)})`
        ctx.lineWidth = 2 + Math.min(effectiveIntensity * 2, 1)
        ctx.setLineDash([15, 25])
        ctx.lineDashOffset = time * rotationSpeed * 50
        ctx.stroke()
        ctx.setLineDash([])

        // Smooth glow effect
        if (effectiveIntensity > 0.3) {
          ctx.shadowColor = "#22d3ee"
          ctx.shadowBlur = 10 * Math.min(effectiveIntensity, 1)
          ctx.stroke()
          ctx.shadowBlur = 0
        }
      }

      // Enhanced floating particles (smooth audio reactivity)
      particles.forEach((particle, index) => {
        // Smooth audio-reactive movement
        const audioEffect = effectiveIntensity > 0.1 ? dataArray[index % dataArray.length] / 255 : 0
        const targetSpeedMultiplier = 1 + audioEffect * 2
        particle.smoothSpeed = particle.smoothSpeed * smoothingFactor + targetSpeedMultiplier * (1 - smoothingFactor)

        const targetSizeMultiplier = 1 + audioEffect * 3
        particle.smoothSize = particle.smoothSize * smoothingFactor + targetSizeMultiplier * (1 - smoothingFactor)

        // Update particle position
        particle.x += Math.cos(particle.angle) * particle.speed * particle.smoothSpeed
        particle.y += Math.sin(particle.angle) * particle.speed * particle.smoothSpeed
        particle.angle += particle.frequency + (effectiveIntensity > 0.1 ? audioEffect * 0.05 : 0)

        // Wrap around screen
        if (particle.x < 0) particle.x = canvasWidth
        if (particle.x > canvasWidth) particle.x = 0
        if (particle.y < 0) particle.y = canvasHeight
        if (particle.y > canvasHeight) particle.y = 0

        // Smooth audio-reactive opacity and size
        const audioReactivity = effectiveIntensity > 0.1 ? audioEffect : 0
        const pulseOpacity = particle.baseOpacity * (0.5 + Math.sin(time * 2 + index) * 0.5)
        const finalOpacity = pulseOpacity + audioReactivity * 0.5 * Math.min(effectiveIntensity * 2, 1)
        const particleSize = particle.radius * particle.smoothSize

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particleSize, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(34, 211, 238, ${Math.min(1, finalOpacity)})`
        ctx.fill()

        // Smooth glow for audio-reactive particles
        if (audioReactivity > 0.6 && effectiveIntensity > 0.5) {
          ctx.shadowColor = "#22d3ee"
          ctx.shadowBlur = 12 * Math.min(effectiveIntensity, 1)
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })

      // Energy waves (smooth transition)
      const baseWaveCount = 2
      const audioWaveCount = 4
      const waveCount = Math.round(
        baseWaveCount + (audioWaveCount - baseWaveCount) * Math.min(effectiveIntensity * 2, 1),
      )

      for (let wave = 0; wave < waveCount; wave++) {
        const waveRadius = baseRadius * 1.8 + wave * 40 + Math.sin(time * 2 + wave * Math.PI) * 20
        const audioWaveEffect = effectiveIntensity * 15
        const finalWaveRadius = waveRadius + audioWaveEffect * Math.min(effectiveIntensity * 2, 1)

        const baseWaveOpacity = 0.15 * (1 - wave * 0.3)
        const audioWaveOpacity = 0.25 * (1 - wave * 0.15) * smoothIntensity
        const waveOpacity = baseWaveOpacity + (audioWaveOpacity - baseWaveOpacity) * Math.min(effectiveIntensity * 2, 1)

        ctx.beginPath()
        ctx.arc(centerX, centerY, finalWaveRadius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(14, 165, 233, ${waveOpacity})`
        ctx.lineWidth = 1 + Math.min(effectiveIntensity, 1)
        ctx.stroke()
      }

      // Breathing outer boundary (smooth transition)
      const baseBoundaryPulse = Math.sin(time * 1.2) * 20
      const audioBoundaryPulse = Math.sin(time * 2.5) * (25 + effectiveIntensity * 15)
      const boundaryPulse =
        baseBoundaryPulse + (audioBoundaryPulse - baseBoundaryPulse) * Math.min(effectiveIntensity * 2, 1)

      const boundaryRadius = baseRadius * 2.8 + boundaryPulse
      const baseBoundaryOpacity = 0.2 + Math.sin(time * 1.5) * 0.1
      const audioBoundaryOpacity = 0.3 + Math.sin(time * 1.5) * 0.15 + effectiveIntensity * 0.2
      const boundaryOpacity =
        baseBoundaryOpacity + (audioBoundaryOpacity - baseBoundaryOpacity) * Math.min(effectiveIntensity * 2, 1)

      ctx.beginPath()
      ctx.arc(centerX, centerY, boundaryRadius, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(34, 211, 238, ${boundaryOpacity})`
      ctx.lineWidth = 3 + Math.min(effectiveIntensity, 1)
      ctx.stroke()

      // Audio-reactive particle bursts (smooth appearance)
      if (effectiveIntensity > 0.8) {
        const burstIntensity = (effectiveIntensity - 0.8) / 0.4 // Normalize to 0-1 range
        for (let burst = 0; burst < 8; burst++) {
          const burstAngle = (burst / 8) * Math.PI * 2 + time
          const burstDistance = baseRadius * 2.2 + Math.sin(time * 5 + burst) * 20
          const burstX = centerX + Math.cos(burstAngle) * burstDistance
          const burstY = centerY + Math.sin(burstAngle) * burstDistance

          ctx.beginPath()
          ctx.arc(burstX, burstY, 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(34, 211, 238, ${burstIntensity * 0.5})`
          ctx.fill()
        }
      }
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      if (!audioContext && currentAudioContext.state !== "closed") {
        currentAudioContext.close()
      }
    }
  }, [audio, audioContext, canvasWidth, canvasHeight, idlePulse])

  return (
    <div className="flex justify-center items-center pt-4 px-4 bg-black rounded-xl w-full border border-gray-800">
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} className="rounded-lg" />
    </div>
  )
}

export default CircularAudioVisualizer
