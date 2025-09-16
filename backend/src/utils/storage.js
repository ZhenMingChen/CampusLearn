import multer from 'multer';
import fs from 'fs';
const dir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g,'_')),
});

export const upload = multer({
  storage,
  limits: { fileSize: (Number(process.env.MAX_FILE_MB)||10) * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = (process.env.ALLOWED_MIME||'').split(',').map(s=>s.trim()).filter(Boolean);
    if (!allowed.length || allowed.includes(file.mimetype)) cb(null,true); else cb(new Error('Invalid mime type'));
  }
});
