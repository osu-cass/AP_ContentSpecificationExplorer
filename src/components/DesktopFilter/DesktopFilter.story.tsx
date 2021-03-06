import React from 'react';
import { storiesOf } from '@storybook/react';
import centered from '@storybook/addon-centered';
import { FilterOptionModel, FilterType } from '@osu-cass/sb-components';

import { DesktopFilter } from '.';
import { filterModelGS, filterModelGSC, filterModelCSCT } from '../MobileFilter/__mocks__';

export const callback = (Code: FilterType, newFilter?: FilterOptionModel) => {
  // tslint:disable-next-line:no-console
  console.log('New filter params:', JSON.stringify(newFilter));
};

export const reset = () => {
  // tslint:disable-next-line:no-console
  console.log('Reset Pressed');
};

storiesOf('Filter/Desktop', module)
  .addDecorator(centered)
  .add('default', () => <DesktopFilter filters={filterModelGS} onUpdate={callback} reset={reset} />)
  .add('Subject, Grade and Claim', () => (
    <DesktopFilter filters={filterModelGSC} onUpdate={callback} reset={reset} />
  ))
  .add('Subject grade and target', () => (
    <DesktopFilter filters={filterModelCSCT} onUpdate={callback} reset={reset} />
  ));
