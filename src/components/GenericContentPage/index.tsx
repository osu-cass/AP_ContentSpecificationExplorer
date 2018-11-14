import React from 'react';
import { SizeBreaks } from '../../constants';
import MediaQuery from 'react-responsive';
import { MobileGenericContentPage } from './mobile';
import { DesktopHelpPage } from './desktop';

export interface ContentSection {
  title: string;
  jsx: React.ReactNode;
}

export interface GenericContentProps {
  contentSections: ContentSection[];
}

export interface GenericContentPageProps extends GenericContentProps {
  title: string;
}

const GenericContentPage: React.SFC<GenericContentPageProps> = ({
  contentSections,
  title
}) => (
  <React.Fragment>
    <MediaQuery minDeviceWidth={SizeBreaks.mobile + 1}>
      <DesktopHelpPage contentSections={contentSections} />
    </MediaQuery>
    <MediaQuery maxDeviceWidth={SizeBreaks.mobile}>
      <MobileGenericContentPage contentSections={contentSections} />
    </MediaQuery>
  </React.Fragment>
);
