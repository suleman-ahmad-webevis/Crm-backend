const express = require("express");
const QueriesRouter = express.Router();
const Queries = require("../Models/Queries");

// Create a queries
QueriesRouter.post("/", async (req, res, next) => {
  const { name, company, email } = req.body;
  const queriesData = new Queries({
    name,
    company,
    email,
  });
  queriesData
    .save()
    .then(
      (queries) => {
        res
          .status(200)
          .json({ success: true, message: "Query is created successfully" });
      },
      (err) => next(err)
    )
    .catch((err) => {
      next(err);
    });
});

// Get all queries
QueriesRouter.get("/", async (req, res, next) => {
  Queries.find()
    .populate("developer")
    .then(
      (queries) => {
        res.status(200).json({ success: true, data: queries });
      },
      (err) => next(err)
    )
    .catch((err) => {
      next(err);
    });
});

// Get a specific queries by ID
QueriesRouter.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  Queries.findById(id)
    .populate("developer")
    .then(
      (queries) => {
        if (!queries) {
          return res.status(404).json({ message: "queries not found" });
        }
        res.status(200).json({ success: true, data: queries });
      },
      (err) => next(err)
    )
    .catch((err) => {
      next(err);
    });
});

// Update a queries by ID
QueriesRouter.patch("/:id", async (req, res, next) => {
  try {
    const { developer, ...rest } = req.body;
    const user = await Queries.findByIdAndUpdate(
      req.params.id,
      { $push: { developer }, $set: rest },
      { new: true, useFindAndModify: false }
    );
    res.status(200).json({ msg: "User updated successfully." });
  } catch (err) {
    next(err);
  }
});

// Delete a queries by ID
QueriesRouter.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  Queries.findByIdAndDelete(id)
    .then((queries) => {
      if (!queries) {
        return res.status(404).json({ message: "queries not found" });
      }
      res.json({ success: true, message: "Query Deleted" });
    })
    .catch((err) => {
      next(err);
    });
});

// Read CSV
QueriesRouter.post("/read-csv", (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  var parser = parse({ columns: true }, function (err, import_emails) {
    if (err) {
      console.error(err);
      return res
        .status(400)
        .json({ success: false, message: "An error occurred" });
    }
    import_emails = import_emails.map((element, index) => {
      return element.emails;
    });
    //    res.json(import_emails)
    SubscribeModel.findOneAndUpdate(
      {},
      { $addToSet: { subscriberList: { $each: import_emails } } },
      { new: true, upsert: true }
    )
      .exec()
      .then((emailDoc) => {
        // emailDoc = [...new Set([emailDoc])]
        // emailDoc.save();
        res.status(201).json({ success: true, data: emailDoc });
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  });
  fs.createReadStream(req.file.path).pipe(parser);
});

// send email
QueriesRouter.post("/sendEmail", async (req, res, next) => {
  const emailList = req.body.emails;
  for (let i = 0; i < emailList.length; i++) {
    const mailOptions = {
      from: "gm.webevis@gmail.com",
      to: emailList[i],
      subject: "Welcome to Webevis.com!",
      html: "<p>Thank you for signing up to Wevevis. We are glad to have you onboard!</p>",
    };
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      pool: true,
      auth: {
        user: "gm.webevis@gmail.com",
        pass: "zovrfkzboftaoyys",
      },
    });
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
  res.status(200).send("Welcome emails sent successfully!");
});

module.exports = QueriesRouter;
