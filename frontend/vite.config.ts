import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode } : any) => {
    // @ts-ignore
    const env = loadEnv(mode, process.cwd(), '')

    return defineConfig({
        server: {
            port: Number(env.VITE_PORT) || 40000,
        },
        plugins: [react()],
    })
}