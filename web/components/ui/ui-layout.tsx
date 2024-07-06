'use client';

import { WalletButton } from '@/providers';
import * as React from 'react';
import { ReactNode, Suspense, useEffect, useRef, useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { AccountChecker } from '../account/account-ui';
import {
  ClusterChecker,
  ClusterUiSelect,
  ExplorerLink,
} from '../cluster/cluster-ui';
import toast, { Toaster } from 'react-hot-toast';
import { HiOutlineWallet } from 'react-icons/hi2';
import { FaXTwitter } from 'react-icons/fa6';
import { FaTelegram } from 'react-icons/fa';

import { decodeName } from '@luckyland/anchor';

import dinero from '../../public/img/dinero.svg';
import './css/style.css';

export function UiLayout({
  children,
  links,
  env = 'development',
}: {
  children: ReactNode;
  links: { label: string; path: string; program?: boolean; img?: string }[];
  env?: string;
}) {
  const pathname = usePathname();
  const [backgroundImage, setBackgroundImage] = useState('/img/fondo.svg');


  console.log(decodeName,'datos');
  
  useEffect(() => {
    switch (pathname) {
      case '/lobby':
        setBackgroundImage('/img/lobby.svg');
        break;
      case '/about':
        setBackgroundImage('/img/about-background.svg');
        break;
      default:
        setBackgroundImage('/img/fondo.svg');
    }
  }, [pathname]);
  return (
    <div
      className="drawer"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top',
      }}
    >
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="w-full navbar flex justify-center items-center">
          <div className="flex-1 ">
            <details className="dropdown w-3/4">
              <summary className="flex cursor-pointer m-1 items-center">
                <Image
                  className="z-10"
                  src={dinero}
                  alt="Dinero"
                  width={50}
                  height={50}
                />
                <p
                  className="-ml-2 mt-2 z-0 text-white bg-[#3c1a06] px-2 border-2 border-solid border-[#f07a0c] rounded-lg text-base"
                  style={{
                    boxShadow:
                      '0 0 10px rgba(240, 122, 12, 0.8), 0 0 20px rgba(240, 122, 12, 0.6), 0 0 30px rgba(240, 122, 12, 0.4)',
                  }}
                >
                  123,567,00
                </p>
              </summary>
              <div className="menu dropdown-content bg-black bg-opacity-50  rounded-xl z-[1] w-52 p-2 shadow ">
                <ul className="menu p-4 w-full">
                  {links.map(({ label, path, program, img }) => (
                    <li key={path}>
                      <Link
                        className={`text-base font-semibold	text-white ${
                          pathname.startsWith(path)
                            ? 'bg-opacity-100 bg-[#f07a0c] rounded-lg p-2'
                            : ''
                        } `}
                        href={path}
                      >
                        {img && (
                          <Image
                            src={img}
                            alt={`${label} icon`}
                            className="min-h-6 min-w-6 mr-2"
                          />
                        )}
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </div>
          <details className="dropdown dropdown-end">
            <summary className=" m-1 flex justify-center items-center bg-[#f07a0c] rounded-lg p-2 cursor-pointer">
              <HiOutlineWallet
                color="#ffe9b0"
                className="inline-block w-8 h-8"
              />
            </summary>
            <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
              <div className="flex-none space-x-2">
                <WalletButton />
                {env !== 'production' && <ClusterUiSelect />}
              </div>
            </ul>
          </details>
        </div>
        {/* Page content here */}
        <ClusterChecker>
          <AccountChecker />
        </ClusterChecker>
        <div className="flex flex-col justify-center items-center min-h-[calc(85dvh_-_60px)] ">
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

        <footer className="footer footer-center p-4  text-base-content flex">
          <aside className="flex justify-start">
            <FaXTwitter color="#FFF" size={20} />
            <FaTelegram color="#FFF" size={20} />
          </aside>
        </footer>
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
