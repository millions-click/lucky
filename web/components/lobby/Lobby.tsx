'use client';

import * as React from 'react';

import Image from 'next/image';

import { IoIosArrowForward } from 'react-icons/io';

import bonny from '../../public/Img/bunny.svg';
import ChatLucky from './ChatLucky';
import Tablet from './Tablet';

export function Lobby() {
  return (
    <div className="block">
      <div
        className="absolute left-0 top-1/2 transform -translate-y-1/2 "
        onClick={() =>
          (
            document.getElementById('my_modal_2') as HTMLDialogElement
          ).showModal()
        }
      >
        <Image
          className="h-full  z-10 transform cursor-pointer -ml-6 mt-10"
          src={bonny}
          alt="Lucky"
        />
      </div>
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-orange-500 py-6 rounded-r-lg shadow-lg mt-60"
        onClick={() =>
          (
            document.getElementById('my_modal_1') as HTMLDialogElement
          ).showModal()
        }
      >
        <IoIosArrowForward size={30} color="#ffe9b0" />
      </button>
      <dialog id="my_modal_1" className="modal modal-middle mt-40">
        <Tablet />
      </dialog>
      <dialog id="my_modal_2" className="modal mt-20">
        <ChatLucky />
      </dialog>
    </div>
  );
}
