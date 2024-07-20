/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  redirects: async () => {
    return [{ source: "/", destination: "/about", permanent: true }]
  },
}

export default nextConfig
