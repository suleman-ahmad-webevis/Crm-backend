const express = require('express');
const MeetingsRouter = express.Router()
const Meetings = require('../Models/Meeting')

// Get all meetings
MeetingsRouter.get('/', async (req, res) => {
  try {
    const meetings = await Meetings.find()
      .populate('client_name')
      .populate('developer_name');
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new meeting
MeetingsRouter.post('/', async (req, res) => {
  const meeting = new Meetings({
    client_name: req.body.client_name,
    developer_name: req.body.developer_name,
    date: req.body.date,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
  });

  try {
    const newMeeting = await meeting.save();
    res.status(201).json(newMeeting);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single meeting by ID
MeetingsRouter.get('/:id', getMeeting, (req, res) => {
  res.json(res.meeting);
});

// Update a meeting by ID
MeetingsRouter.patch('/:id', getMeeting, async (req, res) => {
  if (req.body.client_name != null) {
    res.meeting.client_name = req.body.client_name;
  }
  if (req.body.developer_name != null) {
    res.meeting.developer_name = req.body.developer_name;
  }
  if (req.body.date != null) {
    res.meeting.date = req.body.date;
  }
  if (req.body.start_time != null) {
    res.meeting.start_time = req.body.start_time;
  }
  if (req.body.end_time != null) {
    res.meeting.end_time = req.body.end_time;
  }

  try {
    const updatedMeeting = await res.meeting.save();
    res.json(updatedMeeting);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a meeting by ID
MeetingsRouter.delete('/:id', getMeeting, async (req, res) => {
  try {
    await res.meeting.remove();
    res.json({ message: 'Meeting deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get a single meeting by ID
async function getMeeting(req, res, next) {
  let meeting;  
  try {
    meeting = await Meetings.findById(req.params.id)
      .populate('client_name')
      .populate('developer_name');
    if (meeting == null) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.meeting = meeting;
  next();
}

MeetingsRouter.post("/sendEmail", async (req, res, next) => {
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

module.exports = MeetingsRouter;