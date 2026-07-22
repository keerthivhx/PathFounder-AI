import { useState, useEffect } from 'react';

export interface MotionSensorsState {
  headingDegrees: number;
  stepCount: number;
  isCompassAvailable: boolean;
  isMotionAvailable: boolean;
}

export function useSensors() {
  const [sensors, setSensors] = useState<MotionSensorsState>({
    headingDegrees: 0,
    stepCount: 0,
    isCompassAvailable: false,
    isMotionAvailable: false,
  });

  useEffect(() => {
    let lastAccel = 0;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      let alpha = event.alpha || 0;
      // Webkit compass heading for iOS
      if ((event as any).webkitCompassHeading) {
        alpha = (event as any).webkitCompassHeading;
      }
      setSensors(prev => ({
        ...prev,
        headingDegrees: Math.round(alpha),
        isCompassAvailable: true
      }));
    };

    const handleMotion = (event: DeviceMotionEvent) => {
      const accel = event.accelerationIncludingGravity;
      if (accel) {
        const total = Math.sqrt((accel.x || 0) ** 2 + (accel.y || 0) ** 2 + (accel.z || 0) ** 2);
        const delta = Math.abs(total - lastAccel);
        lastAccel = total;

        // Step threshold peak detection
        if (delta > 8) {
          setSensors(prev => ({
            ...prev,
            stepCount: prev.stepCount + 1,
            isMotionAvailable: true
          }));
        }
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, []);

  const simulateStep = () => {
    setSensors(prev => ({
      ...prev,
      stepCount: prev.stepCount + 1,
      headingDegrees: (prev.headingDegrees + 5) % 360
    }));
  };

  return { sensors, simulateStep };
}
