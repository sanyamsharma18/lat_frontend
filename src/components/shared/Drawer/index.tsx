import React, { MouseEvent, KeyboardEvent, ReactNode, memo } from 'react';

import { SwipeableDrawer, SxProps, Theme } from '@mui/material';

import { KeyboardEvent as KeyboardEventEnum } from '@/constants/enumConstant';

type Anchor = 'left' | 'right' | 'bottom' | 'top';


interface DrawerType {
    children: ReactNode;
    drawerOpen: boolean;
    setDrawerOpen: (value: boolean) => void;
    anchor: Anchor;
    className?: string;
    sx?: SxProps<Theme>;
}

const Drawer = (props: DrawerType) => {
    const { children, drawerOpen, setDrawerOpen, anchor, className, sx } = props;

    const toggleDrawer = (open: boolean) => (event: KeyboardEvent | MouseEvent) => {
        if (
            event.type === KeyboardEventEnum.KEYDOWN &&
            ((event as KeyboardEvent).key === KeyboardEventEnum.TAB ||
                (event as KeyboardEvent).key === KeyboardEventEnum.SHIFT)
        ) {
            return;
        }

        setDrawerOpen(open);
    };

    return (
        <div className={className}>
            <SwipeableDrawer
                anchor={anchor}
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                sx={sx}
                onOpen={toggleDrawer(true)}
            >
                {children}
            </SwipeableDrawer>
        </div>
    );
};

export default memo(Drawer);
