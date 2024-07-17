import { Generate } from './Generate';
import { Import } from './Import';
import { Connect } from './Connect';

import { Selector } from '../../Selector';

const ACTIONS = [
  {
    next: 'generate',
    className: 'sm:btn-lg bg-orange-500 hover:btn-accent',
    component: Generate,
  },
  {
    next: 'import',
    className: 'max-sm:btn-sm btn-secondary',
    component: Import,
  },
  { next: 'connect', className: 'max-sm:btn-xs btn-sm', component: Connect },
];

export const actions = Object.fromEntries(
  ACTIONS.map(({ next, component }) => [next, component])
);

export const Options = Selector({
  noTitle: true,
  className: 'flex flex-col gap-2 w-full',
  actions: ACTIONS.map(({ next, className }) => ({
    next,
    className: `btn btn-block text-amber-100 ${className}`,
  })),
});
