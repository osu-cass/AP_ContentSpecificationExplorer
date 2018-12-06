import * as React from 'react';
import MediaQuery from 'react-responsive';
import { SizeBreaks } from '../../constants';

export const MobileBreakSize = {
    maxWidth: SizeBreaks.mobile
};

export const desktopBreakSize = {
    minWidth: SizeBreaks.mobile + 1
};

export const mediaQueryWrapper = <T extends object>(Component: React.ComponentType<T>, config: object): React.SFC<T> => {
    return (props: T) => (<MediaQuery {...config}>
        <Component {...props}/>
    </MediaQuery>);
};