import React from 'react';
import { storiesOf } from '@storybook/react';
import centered from '@storybook/addon-centered';

import { DownloadModal } from '.';
import { ClaimMe } from '../PDFLink/Document/testData';

storiesOf('DownloadModal DontTest', module)
  .addDecorator(centered)
  .add('Download Task Model Multi-Select', () => <DownloadModal claim={ClaimMe} isOpen={true} />);
