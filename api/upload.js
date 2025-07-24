const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Use memory storage for Vercel
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow specific file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|csv|zip/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images, PDFs, documents, and archives are allowed!'));
    }
  }
});

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Handle file upload
    upload.single('file')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ 
          success: false, 
          error: err.message 
        });
      }
      
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          error: 'No file uploaded' 
        });
      }
      
      // In a real deployment, you'd save to cloud storage (AWS S3, Cloudinary, etc.)
      res.json({
        success: true,
        message: 'File uploaded successfully',
        file: {
          filename: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
          // For demo purposes - in production, save to cloud storage
          buffer: req.file.buffer.toString('base64')
        }
      });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}