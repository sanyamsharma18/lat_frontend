// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//     turbopack: {},
//     webpack(config) {
//         // Allow: import Icon from './icon.svg' (as a React component)
//         config.module.rules.push({
//             test: /\.svg$/i,
//             issuer: /\.[jt]sx?$/,
//             use: ['@svgr/webpack'],
//         });

//         return config;
//     },
// };

// export default nextConfig;

import type { NextConfig } from 'next';
import path from 'path';

const stylesPath = path.join(process.cwd(), 'src/styles');

const nextConfig: NextConfig = {
    reactStrictMode: true,
    allowedDevOrigins: ['192.168.0.233'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
            {
                protocol: 'http',
                hostname: '**',
            },
        ],
    },
    sassOptions: {
        includePaths: [stylesPath],
        loadPaths: [stylesPath],
    },
    turbopack: {
        resolveAlias: {
            '@styles': stylesPath,
        },
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js',
            },
        },
    },
    /* config options here */
    webpack(config) {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@styles': stylesPath,
        };

        config.module.rules.push({
            test: /\.svg$/i,
            // issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
        });

        return config;
    },
};

export default nextConfig;
