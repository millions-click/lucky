import React from 'react';
import Image from 'next/image';
import { HiOutlineWallet } from 'react-icons/hi2';
import { HiOutlineCog } from 'react-icons/hi';
import { IoStorefrontOutline } from 'react-icons/io5';
import { HiArrowLeftStartOnRectangle } from 'react-icons/hi2';
import map from '../../public/img/mapa-vial 1.svg'

export default function Tablet() {
  return (
    <div className="modal-box w-11/12 max-w-sm bg-[#3c1a06] bg-opacity-90">
      <div className="grid grid-cols-3 gap-4  rounded-lg m-2 p-6 display">
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
          <HiOutlineWallet color="#ffe9b0" className="inline-block w-8 h-8" />
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
  );
}
