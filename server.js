const express = require('express');
const multer = require('multer');
const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' });

// تقديم ملفات ثابتة من مجلد 'public'
app.use(express.static('public'));

// التعامل مع رفع الملفات
app.post('/upload', upload.fields([{ name: 'image' }, { name: 'audio' }]), (req, res) => {
  console.log(req.files);
  // معالجة الملفات هنا
  res.send('Files uploaded successfully');
});

// التعامل مع الطلبات إلى المسار الجذري '/'
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
