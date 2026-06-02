import multer from 'multer';

const storage = multer.memoryStorage();

const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const proofFileFilter = (req, file, cb) => {
  const allowed = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images, PDF, and Word documents are allowed'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadProof = multer({
  storage,
  fileFilter: proofFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});
