import express from 'express'

import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'

import fs from 'fs'
import path from 'path'

const app = express()
const upload = multer({ dest: 'temp/' })

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

app.post('/upload', upload.single('photo'), async (req: any, res: any) => {
    try {
        if (!req.file) return res.status(400).send('No file uploaded')

        const ext = path.extname(req.file.originalname)
        const timestamp = Date.now()
        const year = new Date().getFullYear()

        const name = `${year}_${timestamp}${ext}`

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: `psystem/${year}/file/`,
            public_id: name,
        })

        fs.unlinkSync(req.file.path)

        const files: any[] = [{
            file: req.file.path,
            name: req.file.originalname,
            url: result.secure_url,
            size: req.file.size,
            //type: path.extname(req.file.originalname).slice(1),
        }]

        res.status(200).json({ ok: true, files })
    } catch (error) {
        res.status(500).json({ ok: false, error: `Upload failed: ${error}` })
    }
})

app.post('/upload_file', upload.array('files', 10), async (req: any, res: any) => {
    try {
        const files = req.files
        if (!files || files.length === 0)
            return res.status(400).send('No files uploaded')

        const uploadResults = await Promise.all(
            files.map(async (file: Express.Multer.File) => {

                const ext = path.extname(file.originalname)
                const timestamp = Date.now()
                const year = new Date().getFullYear()

                const name = `${year}_${timestamp}${ext}`

                const result = await cloudinary.uploader.upload(
                    file.path,
                    {
                        folder: `psystem/${year}/files/`,
                        resource_type: 'raw',
                        public_id: name,
                    }
                )

                fs.unlinkSync(file.path)

                return {
                    file: file.path,
                    name: file.originalname,
                    url: result.secure_url,
                    size: file.size,
                }
            })
        )

        res.status(200).json({
            ok: true,
            files: uploadResults,
        })
    } catch (error) {
        console.error('Upload failed:', error)
        res.status(500).json({ ok: false, error: `Upload failed: ${error}` })
    }
})

export default app