import { Download } from './Download';
import { Copy } from './Copy';
import { Upload } from './Upload';

import { Selector } from '@/ui/messages';

export const actions = {
  download: Download,
  copy: Copy,
  cloud: Upload,
};

export const Options = Selector({ actions: Object.keys(actions) });
