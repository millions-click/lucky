'use client';

import { PlayButton } from '@/components/shared';
export default function DashboardFeature() {
  return (
    <div
     
    >
      <div className="hero-content text-center">
        <div style={{marginTop:'-5%'}} className="max-w-md">
          {/* <h1 className="text-7xl font-bold">Hello there</h1>
          <p className="text-3xl py-6 mb-8">
            Wanna try your luck?
            <span className="text-2xl font-bold block">Feed a rabbit</span>
          </p> */}
          <PlayButton />
        </div>
      </div>
    </div>
  );
}
