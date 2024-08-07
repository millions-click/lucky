'use client';

import { useMemo } from 'react';
import type { AbstractIntlMessages } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';

type Goal = {
  title: string;
  description?: string;
  tags: string;
  tasks: Array<string>;
};
type StepDetails = {
  title: string;
  description: string;
  goals: Array<Goal>;
};
type StepSlug = string;
type Steps = Record<StepSlug, StepDetails>;

export function Details({ details }: { details: AbstractIntlMessages }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const steps = useMemo(() => details as unknown as Steps, [details]);
  const step = searchParams.get('details');
  if (!step || !steps[step]) return null;

  const { title, description, goals = [] } = steps[step];

  return (
    <dialog
      role="dialog"
      className="modal modal-bottom sm:modal-middle modal-open"
    >
      <div className="modal-box sm:max-h-[70dvh] flex flex-col">
        <button
          onClick={router.back}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>

        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="py-4">{description}</p>

        <div className="flex flex-wrap gap-2 px-8 pt-4 flex-1 overflow-auto bg-base-300">
          {goals.map(({ title, description, tags, tasks }, i) => (
            <div key={i} className="w-full">
              <h4 className="mb-4 font-semibold text-xl">‣ {title}</h4>
              <p className=" mb-2 text-end label-text-alt">{description}</p>
              <ul>
                {tasks.map((task, i) => (
                  <li key={i} className="items-center">
                    ⦿ {task}
                  </li>
                ))}
              </ul>
              <div className="divider" />
            </div>
          ))}
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={router.back}>close</button>
      </form>
    </dialog>
  );
}
