import jwt from 'jsonwebtoken'

export function auth (req: any, res: any, next: any) {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return res.status(401).json({ error: 'No token provided' })

    const decoded: any = jwt.decode(token)
    const username = decoded?.username

    if (username) {
        req.username = username
        next()
    }
}