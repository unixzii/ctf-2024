const TerserPlugin = require("terser-webpack-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, context) {
    config.optimization.minimizer = [
      new TerserPlugin({
        exclude: /\/page(-[a-z0-9]+?)?\.js/,
      }),
    ];
    return config;
  },
};

module.exports = nextConfig;
