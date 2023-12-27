const TerserPlugin = require("terser-webpack-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, context) {
    if (config.optimization.splitChunks.cacheGroups) {
      config.optimization.splitChunks.cacheGroups["white-box"] = {
        chunks: "all",
        name: "white-box",
        enforce: true,
        test(module) {
          const filename = module.resource;
          if (!filename) {
            return false;
          }
          return /\/challenge(-[^\.]+?)?\.tsx$/.test(filename);
        },
      };
    }
    config.optimization.minimizer = [
      new TerserPlugin({
        exclude: /\/white-box(-[a-z0-9]+?)?\.js/,
      }),
    ];
    return config;
  },
};

module.exports = nextConfig;
