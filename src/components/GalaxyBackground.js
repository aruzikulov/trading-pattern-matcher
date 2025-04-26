import React, { useRef, useEffect } from 'react';
import './GalaxyBackground.css';

const STAR_COUNT = 200;
const STAR_COLOR = 'rgba(255,255,255,0.8)';
const STAR_SIZE = [0.5, 1.5];
const STAR_SPEED = [0.05, 0.3];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function createStar(width, height) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size: randomBetween(STAR_SIZE[0], STAR_SIZE[1]),
    speed: randomBetween(STAR_SPEED[0], STAR_SPEED[1]),
    angle: Math.random() * 2 * Math.PI,
  };
}

const GalaxyBackground = () => {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Create stars
    starsRef.current = Array.from({ length: STAR_COUNT }, () => createStar(width, height));

    function draw() {
      ctx.clearRect(0, 0, width, height);
      // Galaxy gradient
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        width * 0.1,
        width / 2,
        height / 2,
        width * 0.7
      );
      gradient.addColorStop(0, '#2b1055');
      gradient.addColorStop(0.5, '#12022f');
      gradient.addColorStop(1, '#000');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw stars
      for (let star of starsRef.current) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
        ctx.fillStyle = STAR_COLOR;
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }
    }

    function animate() {
      for (let star of starsRef.current) {
        // Move star in a circular pattern
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        star.angle += 0.002 * star.speed;
        // Wrap around
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;
      }
      draw();
      requestAnimationFrame(animate);
    }

    animate();

    // Resize handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      starsRef.current = Array.from({ length: STAR_COUNT }, () => createStar(width, height));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse interaction: twinkle on move
  useEffect(() => {
    const canvas = canvasRef.current;
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      for (let star of starsRef.current) {
        const dx = star.x - mx;
        const dy = star.y - my;
        if (dx * dx + dy * dy < 1000) {
          star.size = randomBetween(1.5, 2.5);
        } else {
          star.size = randomBetween(STAR_SIZE[0], STAR_SIZE[1]);
        }
      }
    };
    canvas.addEventListener('mousemove', handleMouseMove);
    return () => canvas.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <canvas ref={canvasRef} className="galaxy-bg-canvas" />
  );
};

export default GalaxyBackground;
