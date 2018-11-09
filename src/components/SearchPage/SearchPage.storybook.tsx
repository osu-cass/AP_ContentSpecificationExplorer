import React from 'react';
import { storiesOf } from '@storybook/react';
import { SearchPage } from '.';
import { searchPageMockProps } from './__mocks__';
import { RouterDecorator } from '../../__decorators__';

storiesOf('Search Page', module)
  .addDecorator(RouterDecorator)
  .add('default', () => <SearchPage {...searchPageMockProps} />);
