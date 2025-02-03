const { bucket } = require("../config/firebase");

app.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;
  const uploadedFile = await bucket.upload(file.path);
  res.json({ url: uploadedFile[0].publicUrl() });
});

module.exports = router;
