var admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
    }),
  });
}

export default async function handler(req, res) {
  const titles = [
    "🧩 Daily Puzzle Ready!",
    "🏹 Arrow Escape Challenge!",
    "🧠 Boost Your Escape IQ!",
    "⚡ Can You Clear the Maze?",
    "🏆 New Daily Stage Unlocked!",
    "🎯 Daily Brain Teaser!",
    "🔥 Untangle the Arrows!",
    "🌟 Your Puzzle Time!",
    "🚀 Clear the Path Today!",
    "👑 Master the Arrow Maze!"
  ];

  const messages = [
    "Today's daily challenge is live! Can you solve it without getting stuck?",
    "Your arrows maze is waiting. Tap to escape and test your logic!",
    "Take a 2-minute break and sharpen your brain with a quick puzzle.",
    "Arrows are all tangled up! Help them escape cleanly.",
    "Only 5% of players can beat today's expert levels. Are you one of them?",
    "Relax your mind and solve today's tricky arrow escape maze!",
    "Jump back in! Fresh puzzles are ready for you to unlock.",
    "Test your spatial IQ! Can you clear all the arrows in one go?",
    "Show your puzzle-solving skills. Tap now to play!",
    "A brand new arrow escape puzzle awaits. Don't break your streak!"
  ];

  const randomIndex = Math.floor(Math.random() * titles.length);
  const selectedTitle = titles[randomIndex];
  const selectedMessage = messages[randomIndex];

  const message = {
    topic: "all_users",
    notification: {
      title: selectedTitle,
      body: selectedMessage
    },
    data: {
      title: selectedTitle,
      body: selectedMessage,
      type: "arrow_escape_daily_notification"
    },
    android: {
      priority: "high",
      notification: {
        sound: "default",
        channelId: "arrow_escape_channel",
        clickAction: "FLUTTER_NOTIFICATION_CLICK"
      }
    }
  };

  try {
    const response = await admin.messaging().send(message);
    return res.status(200).json({ 
      success: true, 
      messageId: response, 
      sentTitle: selectedTitle, 
      sentBody: selectedMessage 
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
