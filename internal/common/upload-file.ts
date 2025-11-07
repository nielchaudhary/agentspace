import multer from 'multer';
import path from 'path';
import type { Request, Response, NextFunction } from 'express';

const storage = multer.diskStorage({
  destination: path.join(process.cwd(), 'tmp/'),
  filename: (req, file, cb) => {
    const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('myFile');

export const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large (max 5MB).' });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: 'File upload failed.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file provided.' });
    }

    next();
  });
};
