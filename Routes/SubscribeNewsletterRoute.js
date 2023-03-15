const express = require('express');
const SubscribeRouter = express.Router();
const SubscribeModel = require("../Models/SubscribeNewsletter")
const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require('fs');
const { parse } = require("csv-parse")
const path = require('path');
const csvWriter = require('csv-writer').createObjectCsvWriter;

var storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    pool: true,
    auth: {
        user: 'gm.webevis@gmail.com',
        pass: 'zovrfkzboftaoyys'
    }
});
var storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});
const upload = multer({ storage: storage });

SubscribeRouter.post('/read-csv', upload.single('file'), (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    var parser = parse({ columns: true }, function (err, import_emails) {
        if (err) {
            console.error(err)
            return res.status(400).json({ success: false, message: 'An error occurred' })
        }
        import_emails = import_emails.map((element, index) => { 
            return element.emails 
         })
    //    res.json(import_emails)
         
       SubscribeModel.findOneAndUpdate({}, { $addToSet: { subscriberList: { $each: import_emails } } }, { new: true, upsert: true })
       .exec()
       .then(emailDoc => {

        emailDoc = [...new Set([emailDoc])]
        // emailDoc.save();
         res.status(201).json({success:true,data:emailDoc});
       })
       .catch(err => {
         console.error(err);
         next(err);
       });
    });
    fs.createReadStream(req.file.path).pipe(parser);
});


SubscribeRouter.post("/sendEmail", async (req, res, next) => {
    const emailList = req.body.emails;

    for (let i = 0; i < emailList.length; i++) {
        const mailOptions = {
            from: 'gm.webevis@gmail.com',
            to: emailList[i],
            subject: 'Welcome to Webevis.com!',
            html: '<p>Thank you for signing up to Wevevis. We are glad to have you onboard!</p>'
        };

        transporter.sendMail(mailOptions,  (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }

    res.status(200).send('Welcome emails sent successfully!');
})

SubscribeRouter.post('/', (req, res) => {
    const newEmail =  req.body.email 
    SubscribeModel.findOneAndUpdate({}, { $addToSet: { subscriberList: newEmail } }, { new: true, upsert: true })
      .exec()
      .then(emailDoc => {
        res.status(201).json({success:true,data:emailDoc.subscriberList});
      })
      .catch(err => {
        next(err);
      });
});

SubscribeRouter.get('/', (req, res) => {
    SubscribeModel.find()
        .then((emails) => res.json({success:true,data:emails.subscriberList}), (err) => next(err))
        .catch((err) => next(new Error("Unable to get")));
});
SubscribeRouter.put('/:id', (req, res) => {
    SubscribeModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(() => res.json({ success: true, message: 'Email updated successfully' }), (err) => next(err))
        .catch((err) => next(new Error("Unable to update")));
});

SubscribeRouter.delete('/:id', (req, res) => {
    SubscribeModel.findByIdAndDelete(req.params.id)
        .then(() => res.json({ success: true, message: 'Email deleted successfully' }), (err) => next(err))
        .catch((err) => next(new Error("Unable to delete")));
});
SubscribeRouter.get('/download', (req, res, next) => {
    SubscribeModel.find()
        .then((emails) => {
            console.log("emails1", emails[0].emails)
            const csvHeaders = [{ id: 'email', title: 'Email' }];
            const csvRecords = emails[0].subscriberList.map((email) => {
                return { email: email }
            });

            const csvWriterObj = csvWriter({
                path: 'emails.csv',
                header: csvHeaders
            });
                csvWriterObj.writeRecords(csvRecords)
                .then(() => {
                    res.download(path.join(__dirname, '../emails.csv'), 'emails.csv', (err) => {
                        if (err) {
                            next(new Error('An error occurred while downloading the file'))
                        }
                    });
                })
                .catch((err1) => {
                    const err = new Error()
                    err.status=400
                    err.message = 'Unable to generate CSV'
                    next(err)
                })
        })
        .catch((err1) =>{
            const err = new Error()
            err.status=400
            err.message = 'Unable to fetch emails'
            next(err)
        }) 
});
module.exports = SubscribeRouter

