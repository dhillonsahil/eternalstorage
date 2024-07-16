/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
          config.resolve.alias.canvas = false;
        
          return config;
         },env:{
            SEVER_HOST:'http://localhost:3002/'
         }
};

export default nextConfig;
