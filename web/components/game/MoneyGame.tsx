'use client';

import { WalletButton } from '../solana/solana-provider';
import * as React from 'react';
import { ReactNode, Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { AccountChecker } from '../account/account-ui';
import { IoIosArrowForward } from 'react-icons/io';
import { HiOutlineWallet } from 'react-icons/hi2';
import { HiOutlineCog } from 'react-icons/hi';
import { IoStorefrontOutline } from 'react-icons/io5';
import { HiArrowLeftStartOnRectangle } from 'react-icons/hi2';
import bonny from '../../public/img/bunny.svg';
import map from '../../public/img/mapa-vial 1.svg';
// import './RangeSlider.css';
import front from '../../public/img/front.svg'
import back from '../../public/img/black.svg'
import {
  ClusterChecker,
  ClusterUiSelect,
  ExplorerLink,
} from '../cluster/cluster-ui';
import toast, { Toaster } from 'react-hot-toast';
export function MoneyGame({
  children,
  links,
  env = 'development',
}: {
  children: ReactNode;
  links: { label: string; path: string; program?: boolean }[];
  env?: string;
}) {
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
        <div >
          <Image
            src={back}
            alt="Left Icon"
            className="w-40 h-40"
          />
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="1"
          value={prediction}
          onChange={handlePredictionChange}
          className="range range-primary mx-4 custom-range"
        />
        <div >
          <Image
            src={front}
            alt="Right Icon"
            className="-ml-8 w-96 h-80"
          />
        </div>
      </div>
      {/* <button
        onClick={lanzarMoneda}
        className="bg-[#f07a0c] text-white px-8 py-2 rounded-full border-4 border-white text-lg"
      >
        JUGAR
      </button> */}
      {result !== null && (
        <p className="text-white mt-4">Resultado: {result}</p>
      )}
      {gameState && <p className="text-white">{gameState}</p>}
    </div>
  );
}

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: {
  children: ReactNode;
  title: string;
  hide: () => void;
  show: boolean;
  submit?: () => void;
  submitDisabled?: boolean;
  submitLabel?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!dialogRef.current) return;
    if (show) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [show, dialogRef]);

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box space-y-5">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <div className="join space-x-2">
            {submit ? (
              <button
                className="btn btn-xs lg:btn-md btn-primary"
                onClick={submit}
                disabled={submitDisabled}
              >
                {submitLabel || 'Save'}
              </button>
            ) : null}
            <button onClick={hide} className="btn">
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export function AppHero({
  children,
  title,
  subtitle,
}: {
  children?: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
}) {
  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          {typeof title === 'string' ? (
            <h1 className="text-5xl font-bold">{title}</h1>
          ) : (
            title
          )}
          {typeof subtitle === 'string' ? (
            <p className="py-6">{subtitle}</p>
          ) : (
            subtitle
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export function ellipsify(str = '', len = 4) {
  if (str.length > 30) {
    return (
      str.substring(0, len) + '..' + str.substring(str.length - len, str.length)
    );
  }
  return str;
}

export function useTransactionToast() {
  return (signature: string, message = 'Transaction sent') => {
    toast.success(
      <div className={'text-center'}>
        <div className="text-lg">{message}</div>
        <ExplorerLink
          path={`tx/${signature}`}
          label={'View Transaction'}
          className="btn btn-xs btn-primary"
        />
      </div>
    );
  };
}
