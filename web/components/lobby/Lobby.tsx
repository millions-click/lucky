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

import {
  ClusterChecker,
  ClusterUiSelect,
  ExplorerLink,
} from '../cluster/cluster-ui';
import toast, { Toaster } from 'react-hot-toast';
export function Lobby({
  children,
  links,
  env = 'development',
}: {
  children: ReactNode;
  links: { label: string; path: string; program?: boolean }[];
  env?: string;
}) {
  return (
    <div className="block">
      <div className="flex justify-center items-left min-h-screen">
        <Image
          className="relative z-10"
          src={bonny}
          alt="Lucky"
          //   style={{ width: '10vw', height: 'auto' }}
        />
      </div>
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-orange-500 py-6   rounded-r-lg shadow-lg"
        onClick={() => document.getElementById('my_modal_1').showModal()}
      >
        <IoIosArrowForward size={30} color="#ffe9b0" />
      </button>
      <dialog id="my_modal_1" className="modal modal-middle mt-40">
        <div className="modal-box w-11/12 max-w-sm bg-[#3c1a06] bg-opacity-90">
          <div className="grid grid-cols-3 gap-4 bg-[#3a2400] rounded-lg p-6">
            <div className="flex justify-center items-center bg-[#9bc368] rounded-lg p-4">
              <HiOutlineCog color="#ffe9b0" className="inline-block w-8 h-8" />
            </div>
            <div className="flex justify-center items-center bg-[#23adc9] rounded-lg p-4">
              <Image
                className="relative z-10 inline-block w-8 h-8"
                src={map}
                alt="Lucky"
              />
            </div>
            <div className="flex justify-center items-center bg-[#f07a0c] rounded-lg p-4">
              <HiOutlineWallet
                color="#ffe9b0"
                className="inline-block w-8 h-8"
              />
            </div>
            <div className="flex justify-center items-center bg-[#828282] rounded-lg p-4">
              <p className="text-[#d9d9d9] font-bold text-center">NFT</p>
            </div>
            <div className="flex justify-center items-center bg-[#e44207] rounded-lg p-4">
              <IoStorefrontOutline
                color="#ffe9b0"
                className="inline-block w-8 h-8"
              />
            </div>
            <div className="flex justify-center items-center bg-[#70addf] rounded-lg p-4">
              <HiArrowLeftStartOnRectangle
                color="#ffe9b0"
                className="inline-block w-8 h-8"
              />
            </div>
          </div>
        </div>
      </dialog>
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
