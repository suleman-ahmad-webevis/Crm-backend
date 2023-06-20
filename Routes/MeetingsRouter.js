const express = require("express");
const MeetingsRouter = express.Router();
const Meetings = require("../models/Meeting");

// Create a new meeting
MeetingsRouter.post("/", async (req, res, next) => {
  const meeting = new Meetings({
    client_name: req.body.client_name,
    developer_name: req.body.developer_name,
    date: req.body.date,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
  });
  try {
    meeting.save().then(
      () => {
        res.status(200).json({
          success: true,
          message: "Meeting is scheduled successfully",
        });
      },
      (err) => next(err)
    );
  } catch (err) {
    console.log("er", err);
    next(err);
  }
});

// Get all meetings
MeetingsRouter.get("/", async (req, res, next) => {
  try {
    Meetings.find()
      .populate("client_name")
      .populate("developer_name")
      .then(
        (meeting) => {
          res.status(200).json({ success: true, data: meeting });
        },
        (err) => next(err)
      );
  } catch (err) {
    console.log("er", err);
    next(err);
  }
});

// Get a single meeting by ID
MeetingsRouter.get("/:id", (req, res, next) => {
  try {
    Meetings.findById(req.params.id)
      .populate("client_name")
      .populate("developer_name")
      .then(
        (meeting) => {
          res.status(200).json({ success: true, data: meeting });
        },
        (err) => next(err)
      );
  } catch (err) {
    next(err);
  }
});

// Update a meeting by ID
MeetingsRouter.patch("/:id", async (req, res) => {
  let meeting;
  try {
    meeting = await Meetings.findById(req.params.id);
    if (meeting == null) {
      return res.status(404).json({ message: "Meeting not found" });
    }
    if (req.body.client_name != null) {
      meeting.client_name = req.body.client_name;
    }
    if (req.body.developer_name != null) {
      meeting.developer_name = req.body.developer_name;
    }
    if (req.body.date != null) {
      meeting.date = req.body.date;
    }
    if (req.body.start_time != null) {
      meeting.start_time = req.body.start_time;
    }
    if (req.body.end_time != null) {
      meeting.end_time = req.body.end_time;
    }
    const updatedMeeting = await meeting.save();
    res.status(200).json({ success: true, data: updatedMeeting });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a meeting by ID
MeetingsRouter.delete("/:id", async (req, res, next) => {
  Meetings.findByIdAndDelete(req.params.id)
    .then(
      () => {
        res.status(200).res.json({ success: true, message: "Meeting Deleted" });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

MeetingsRouter.post("/sendEmail", async (req, res, next) => {
  const emailList = req.body.emails;
  for (let i = 0; i < emailList.length; i++) {
    const mailOptions = {
      from: "gm.webevis@gmail.com",
      to: emailList[i],
      subject: "Welcome to Webevis.com!",
      html: "<p>Thank you for signing up to Wevevis. We are glad to have you onboard!</p>",
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
  res.status(200).json({ message: "Welcome emails sent successfully" });
});

module.exports = MeetingsRouter;
