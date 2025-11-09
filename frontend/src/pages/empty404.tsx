import { useNavigate } from 'react-router-dom'

export default function Empty404 () {
    const navigate = useNavigate()

    return <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br ">

        <h1 className="text-7xl font-extrabold text-gray-800 mb-4">404</h1>
        <p className="text-2xl font-semibold text-gray-700 mb-2">
            Page Not Found
        </p>

        <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-10 left-20 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-70"></div>
            <div className="absolute bottom-10 right-24 w-56 h-56 bg-purple-100 rounded-full blur-3xl opacity-70"></div>
        </div>
    </div>
}