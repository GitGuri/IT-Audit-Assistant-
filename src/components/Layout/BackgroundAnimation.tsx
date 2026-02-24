import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  type: 'box' | 'x';
  rotation: number;
  rotationSpeed: number;
}

export const BackgroundAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    // Initialize particles
    const initialParticles: Particle[] = [];
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
      initialParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.3, // Slow velocity
        vy: (Math.random() - 0.5) * 0.3,
        size: 20 + Math.random() * 30,
        type: Math.random() > 0.5 ? 'box' : 'x',
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 0.5,
      });
    }

    setParticles(initialParticles);
  }, []);

  useEffect(() => {
    if (!containerRef.current || particles.length === 0) return;

    const animate = () => {
      setParticles((prevParticles) => {
        const newParticles = prevParticles.map((particle) => {
          let newX = particle.x + particle.vx;
          let newY = particle.y + particle.vy;
          let newVx = particle.vx;
          let newVy = particle.vy;

          // Bounce off walls
          if (newX <= 0 || newX >= 100) {
            newVx = -newVx * 0.9; // Damping
            newX = Math.max(0, Math.min(100, newX));
          }
          if (newY <= 0 || newY >= 100) {
            newVy = -newVy * 0.9;
            newY = Math.max(0, Math.min(100, newY));
          }

          // Check collisions with other particles
          prevParticles.forEach((other) => {
            if (other.id === particle.id) return;

            const dx = (newX - other.x) / 100;
            const dy = (newY - other.y) / 100;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = (particle.size + other.size) / 200;

            if (distance < minDistance && distance > 0) {
              // Collision detected - bounce off
              const angle = Math.atan2(dy, dx);
              const targetX = Math.cos(angle) * minDistance;
              const targetY = Math.sin(angle) * minDistance;

              const ax = (targetX - dx) * 0.1;
              const ay = (targetY - dy) * 0.1;

              newVx += ax;
              newVy += ay;

              // Separate particles
              newX = other.x / 100 + Math.cos(angle) * minDistance;
              newY = other.y / 100 + Math.sin(angle) * minDistance;
              newX *= 100;
              newY *= 100;
            }
          });

          return {
            ...particle,
            x: newX,
            y: newY,
            vx: newVx * 0.99, // Slow decay
            vy: newVy * 0.99,
            rotation: particle.rotation + particle.rotationSpeed,
          };
        });

        return newParticles;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particles.length]);

  return (
    <Box
      ref={containerRef}
      position="fixed"
      top={0}
      left={0}
      width="100%"
      height="100%"
      zIndex={0}
      pointerEvents="none"
      overflow="hidden"
    >
      {particles.map((particle) => (
        <Box
          key={particle.id}
          position="absolute"
          left={`${particle.x}%`}
          top={`${particle.y}%`}
          width={`${particle.size}px`}
          height={`${particle.size}px`}
          transform={`translate(-50%, -50%) rotate(${particle.rotation}deg)`}
          transition="transform 0.1s linear"
        >
          {particle.type === 'box' ? (
            <Box
              width="100%"
              height="100%"
              borderWidth="2px"
              borderColor="emerald.400"
              bg="transparent"
              opacity={0.15}
              borderRadius="md"
            />
          ) : (
            <Box
              width="100%"
              height="100%"
              position="relative"
              opacity={0.15}
            >
              <Box
                position="absolute"
                top="50%"
                left="0"
                width="100%"
                height="2px"
                bg="emerald.400"
                transform="translateY(-50%) rotate(45deg)"
                transformOrigin="center"
              />
              <Box
                position="absolute"
                top="50%"
                left="0"
                width="100%"
                height="2px"
                bg="emerald.400"
                transform="translateY(-50%) rotate(-45deg)"
                transformOrigin="center"
              />
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

