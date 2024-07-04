import React from 'react';
import profile from '../../public/img/profile.jpeg';
import Image from 'next/image';
export default function ChatLucky() {
  return (
    <div className="modal-box w-11/12 max-w-sm bg-[#3c1a06] bg-opacity-70">
      <div className="chat chat-start">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <Image alt="Tailwind CSS chat bubble component" src={profile} />
          </div>
        </div>
        <div className="chat-header">Lucky</div>
        <div className="chat-bubble">
          Puff, it took you 3 attempts to get in, you almost don't count it.
        </div>
      </div>
      <div className="chat chat-start">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <Image alt="Tailwind CSS chat bubble component" src={profile} />
          </div>
        </div>
        <div className="chat-header">Lucky</div>
        <div className="chat-bubble">How do you feel?</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-image avatar">
          {/* <div className="w-10 rounded-full">
          <Image
            alt="Tailwind CSS chat bubble component"
            // src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
          />
        </div> */}
        </div>
        <div className="chat-header">You</div>
        <div className="chat-bubble bg-[#211608] min-w-lg text-center p-4 space-y-2">
          <button className="bg-[#f07a0c] border-transparent w-full text-[#ffe9b0]  rounded-lg">
            Ready to WIN.
          </button>
          <button className="bg-[#f07a0c] border-transparent w-full text-[#ffe9b0]  rounded-lg">
            Eager to chase those treasures.
          </button>
          <button className="bg-[#f07a0c] border-transparent w-full text-[#ffe9b0]  rounded-lg">
            Calm and cautious.
          </button>
          <button className="bg-[#f07a0c] border-transparent w-full text-[#ffe9b0]  rounded-lg">
            Excited & lucky.
          </button>
        </div>
      </div>
    </div>
  );
}
