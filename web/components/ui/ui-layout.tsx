'use client';

import { WalletButton } from '../solana/solana-provider';
import * as React from 'react';
import { ReactNode, Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { AccountChecker } from '../account/account-ui';
import { FaXTwitter } from 'react-icons/fa6';
import { HiOutlineWallet } from 'react-icons/hi2';
import { FaTelegram } from 'react-icons/fa6';
import {
  ClusterChecker,
  ClusterUiSelect,
  ExplorerLink,
} from '../cluster/cluster-ui';
import toast, { Toaster } from 'react-hot-toast';
import dinero from '../../public/img/dinero.svg';
import map from '../../public/img/mapa-vial 1.svg';
import token from '../../public/img/grafico-circular 1.svg';
import copa from '../../public/img/futbol-americano 1.svg';
import reloj from '../../public/img/reloj.svg';
import polvo from '../../public/img/polvo (1).svg';
import plata from '../../public/img/plata.svg';
import game from '../../public/img/game.svg';
// import { usePathname } from 'next/navigation';
export function UiLayout({
  children,
  links,
  env = 'development',
}: {
  children: ReactNode;
  links: { label: string; path: string; program?: boolean }[];
  env?: string;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [lobby, setLobby] = useState(false);
  const [game, setGame] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    if (pathname === '/') {
      setLobby(true);
    } else {
      setLobby(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (pathname === '/game') {
      setGame(true);
    } else {
      setGame(false);
    }
  }, [pathname]);

  return (
    <div
      className={`${
        lobby
          ? "bg-[url('/img/fondo.svg')]"
          : game
          ?  "bg-[url('/img/game.svg')]"
          : "bg-[url('/img/lobby.svg')]"
      } bg-center bg-no-repeat bg-cover min-h-screen drawer`}
    >
      <input
        id="my-drawer-3"
        type="checkbox"
        className="drawer-toggle appearance-none h-8 w-8 bg-orange-400 border-2 border-solid border-orange-500 rounded-lg checked:bg-orange-500 checked:border-transparent focus:outline-none"
      />

      <div className=" drawer-content  flex flex-col">
        <div className="w-full justify-between navbar">
          <div className="relative">
            <div className="block">
              <div
                className={`flex items-center cursor-pointer p-2 ${
                  isOpen ? 'bg-black bg-opacity-40 rounded-t-lg ' : ''
                }`}
                onClick={toggleMenu}
              >
                <Image
                  className="z-10"
                  src={dinero}
                  alt="Dinero"
                  width={50}
                  height={50}
                />
                <p
                  className="-m-2 z-0 text-white bg-[#3c1a06] px-2 border-2 border-solid border-[#f07a0c] rounded-lg"
                  style={{
                    boxShadow:
                      '0 0 10px rgba(240, 122, 12, 0.8), 0 0 20px rgba(240, 122, 12, 0.6), 0 0 30px rgba(240, 122, 12, 0.4)',
                  }}
                >
                  {lobby ? (
                    '1252515'
                  ) : (
                    <div className="flex">
                      <Image
                        className="z-10"
                        src={reloj}
                        alt="Dinero"
                        width={20}
                        height={20}
                      />
                      1:00:00
                    </div>
                  )}
                </p>
              </div>
            </div>
            {lobby ? (
              isOpen && (
                <div className="absolute top-12 right-0 bg-black bg-opacity-40 rounded-b-lg p-4 shadow-lg space-y-2">
                  <div className="text-white hover:text-orange-400 cursor-pointer flex">
                    <Image className="z-10" src={map} alt="Map" />
                    Roadmap
                  </div>
                  <div className="text-white hover:text-orange-400 cursor-pointer flex">
                    <Image className="z-10" src={token} alt="token" />
                    Tokenomics
                  </div>
                  <div className="text-white hover:text-orange-400 cursor-pointer flex">
                    <Image className="z-10" src={copa} alt="cup" />
                    Leaderboard
                  </div>
                </div>
              )
            ) : (
              <></>
            )}
          </div>
          {lobby ? (
            <div className="flex-none bg-[#f07a0c] rounded-lg">
              <label
                htmlFor="my-drawer-3"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                <HiOutlineWallet
                  color="#ffe9b0"
                  className="inline-block w-8 h-8"
                />
              </label>
            </div>
          ) : (
            <></>
          )}
        </div>
        {lobby ? (
          <></>
        ) : (
          <div className="m-2 relative w-20 p-2">
            <p
              className="-m-2 z-0 text-white bg-[#3c1a06] px-2 border-2 border-solid border-[#f07a0c] rounded-lg"
              style={{
                boxShadow:
                  '0 0 10px rgba(240, 122, 12, 0.8), 0 0 20px rgba(240, 122, 12, 0.6), 0 0 30px rgba(240, 122, 12, 0.4)',
              }}
            >
              <div className="flex">
                <Image
                  className="z-10 -my-2  mr-2"
                  src={polvo}
                  alt="Dinero"
                  width={30}
                  height={30}
                />
                10
              </div>
            </p>
          </div>
        )}
        {lobby ? (
          <></>
        ) : (
          <div className="m-2 relative w-20 p-2">
            <p
              className="-m-2 z-0 text-white bg-[#3c1a06] px-2 border-2 border-solid border-[#f07a0c] rounded-lg"
              style={{
                boxShadow:
                  '0 0 10px rgba(240, 122, 12, 0.8), 0 0 20px rgba(240, 122, 12, 0.6), 0 0 30px rgba(240, 122, 12, 0.4)',
              }}
            >
              <div className="flex">
                <Image
                  className="z-10 -my-2 mr-2"
                  src={plata}
                  alt="Dinero"
                  width={30}
                  height={30}
                />
                35
              </div>
            </p>
          </div>
        )}
        <ClusterChecker>
          <AccountChecker />
        </ClusterChecker>
        <div className="flex-grow min-h-[calc(100dvh_-_114px)] lg:min-h-[calc(100dvh_-_120px)] flex items-center justify-center">
          <Suspense
            fallback={
              <div className="text-center my-32">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            }
          >
            {children}
          </Suspense>
          <Toaster position="bottom-right" />
        </div>
        <footer className="footer footer-left p-4 text-while bg-black bg-opacity-40 rounded-t-lg ">
          <aside className="flex">
            <FaXTwitter color="#FFF" size={20} />
            <FaTelegram color="#FFF" size={20} />
          </aside>
        </footer>
      </div>
      {/* routes */}

      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className={'flexNone'}>
          <WalletButton />
          {env !== 'production' && <ClusterUiSelect />}
        </div>
        <ul className="menu p-4 w-80 min-h-full bg-base-200">
          {/* Sidebar content here */}
          {links.map(({ label, path, program }) => (
            <li key={path}>
              <Link
                className={`${pathname.startsWith(path) ? 'active' : ''} ${
                  program ? 'border border-accent' : ''
                }`}
                href={path}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
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
