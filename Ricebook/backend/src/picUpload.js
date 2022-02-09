const multer = require('multer');
const stream = require('stream');
const cloudinary = require('cloudinary');

cloudinary.config({
	cloud_name: "hdca5yeri",
	api_key: "621857889144297",
	api_secret: "9iSFpv9MHtN36PSiB3ylNdCsh4Y",
})

const doUpload = (publicId, req, res, next) => {

	const uploadStream = cloudinary.uploader.upload_stream(result => {
		// capture the url and public_id and add to the request
		req.fileurl = result.url
		req.fileid = result.public_id
		next()
	}, { public_id: req.body[publicId] });

	// multer can save the file locally if we want
	// instead of saving locally, we keep the file in memory
	// multer provides req.file and within that is the byte buffer

	// we create a passthrough stream to pipe the buffer
	// to the uploadStream function for cloudinary.
	const s = new stream.PassThrough();
	s.end(req.files[0].buffer);
	s.pipe(uploadStream);
	s.on('end', uploadStream.end);

	// and the end of the buffer we tell cloudinary to end the upload.
}

// multer parses multipart form data.  Here we tell
// it to expect a single file upload named 'image'
// Read this function carefully so you understand
// what it is doing!
const parseFD = (publicId) => (req, res, next) => {
		
	multer().any()(req, res, () => {
		if (!req.body.text) {
			req.content = null;
		} else if (!req.body.text || req.body.text == 'undefined') {
			req.content = 'you can add text here';
		} else {
			req.content = req.body.text;
		}

		if (req.files === undefined) {
			req.files = null;
			next()
		} else {
			doUpload(publicId, req, res, next);
		}
	});
}

module.exports = parseFD;