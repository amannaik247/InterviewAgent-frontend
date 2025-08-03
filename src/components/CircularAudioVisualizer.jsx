import React, { useRef, useEffect } from "react";

const CircularAudioVisualizer = ({ audio, canvasWidth = 300, canvasHeight = 300, idlePulse = true }) => {
  const canvasRef = useRef(null);

  useEffect(() => {


    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 128;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    // Connect <audio> element to analyser
    let source;
    if (audio) {
      source = audioContext.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
    }

    let animationId;
    let hasAudio = false;

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);



      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      hasAudio = avg > 10;

      const radius = Math.min(canvasWidth, canvasHeight) / 3;
      const bars = 64;
      const step = (Math.PI * 2) / bars;

      if (hasAudio) {
        for (let i = 0; i < bars; i++) {
          const value = dataArray[i];
          const barHeight = (value / 255) * 60;

          const angle = i * step;
          const x1 = canvasWidth / 2 + Math.cos(angle) * (radius - barHeight / 2);
          const y1 = canvasHeight / 2 + Math.sin(angle) * (radius - barHeight / 2);
          const x2 = canvasWidth / 2 + Math.cos(angle) * (radius + barHeight / 2);
          const y2 = canvasHeight / 2 + Math.sin(angle) * (radius + barHeight / 2);

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
          gradient.addColorStop(0, '#6366F1'); // Indigo-500
          gradient.addColorStop(1, '#A855F7'); // Purple-500
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      } else if (idlePulse) {
        // breathing animation
        const time = Date.now() * 0.002;
        const pulseRadius = radius + Math.sin(time) * 5;

        ctx.beginPath();
        ctx.arc(canvasWidth / 2, canvasHeight / 2, pulseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(100, 200, 255, 0.6)";
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      audioContext.close();
    };
  }, [audio, canvasWidth, canvasHeight, idlePulse]);

  return (
    <div className="flex justify-center items-center p-4 bg-gray-900 rounded-lg shadow-lg w-full">
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
    </div>
  );
};

export default CircularAudioVisualizer;
