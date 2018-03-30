/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var path = require('path');

module.exports = {

        upload: function(req, res) {
            if (req.method === 'GET')
            return res.json({ 'status': 'GET not allowed' });
          	//all to /upload via GET is error
            
          var uploadFile = req.file('uploadFile');
          console.log(uploadFile.filename);

          uploadFile.upload({ dirname: '../../assets/images' }, function onUploadComplete(err, files) {
           
          files.filename = path.basename(files[0].fd);
            if (err) return res.serverError(err);
            //	IF ERROR Return and send 500 error
        
            console.log(files.filename);
            //res.json({ status: 200, file: files });
        res.view("homepage",{file:files.filename});   
        });
      }

};

