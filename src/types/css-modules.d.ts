declare module '*.module.css' {
    interface CssModuleClasses {
        [key: string]: string;
    }

    const classes: CssModuleClasses;
    export default classes;
}

declare module '*.module.scss' {
    interface ScssModuleClasses {
        [key: string]: string;
    }

    const classes: ScssModuleClasses;
    export default classes;
}

declare module '*.svg' {
    import * as React from 'react';

    interface SvgComponentProps extends React.SVGProps<SVGSVGElement> {
        title?: string;
    }

    const ReactComponent: React.FunctionComponent<SvgComponentProps>;
    export default ReactComponent;
}

