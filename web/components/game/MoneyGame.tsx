'use client';

import * as React from 'react';
import { useState } from 'react';
import Image from 'next/image';

// import './RangeSlider.css';
import front from '../../public/img/front.svg';
import back from '../../public/img/back.svg';

export function MoneyGame() {
  const [result, setResult] = useState<number | null>(null);
  const [prediction, setPrediction] = useState<number>(0.5);
  const [gameState, setGameState] = useState<string | null>(null);

  const lanzarMoneda = () => {
    const x = Math.floor(Math.random() * 2); // Valores entre 0 y 1
    setResult(x);
    if (prediction !== 0.5) {
      if (x === prediction) {
        setGameState('¡Ganaste!');
      } else {
        setGameState('Perdiste.');
      }
    }
  };

  const handlePredictionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = Number(event.target.value);
    setPrediction(newValue);
    setGameState(null); // Reset game state when prediction changes

    if (newValue !== 0.5) {
      lanzarMoneda();
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex items-center  ">
        <div>
          <Image src={back} alt="Left Icon" className="w-40 h-40" />
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.5"
          value={prediction}
          onChange={handlePredictionChange}
          className="range range-primary mx-4 custom-range"
        />
        <div>
          <Image src={front} alt="Right Icon" className="w-40 h-40" />
        </div>
      </div>
      {result !== null && (
        <p className="text-white mt-4">Resultado: {result}</p>
      )}
      {gameState && <p className="text-white">{gameState}</p>}
    </div>
  );
}
