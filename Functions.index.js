const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// 1. ہر 1 منٹ بعد چیک کرے - 10 منٹ پہلے Room ID بھیجے
exports.sendRoomDetails = functions.pubsub.schedule('every 1 minutes').onRun(async () => {
  const tenMinsLater = Date.now() + 10 * 60 * 1000;
  const snap = await admin.firestore().collection('tournaments')
    .where('status', '==', 'scheduled')
    .where('startTime', '<=', admin.firestore.Timestamp.fromMillis(tenMinsLater))
    .get();
  
  snap.forEach(async doc => {
    const roomId = Math.floor(100000 + Math.random() * 900000);
    const roomPass = Math.floor(1000 + Math.random() * 9000);
    await doc.ref.update({status: 'live', roomId: roomId, roomPass: roomPass});
  });
  return null;
});
