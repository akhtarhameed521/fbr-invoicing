import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

const firebaseCredentials: admin.ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};



if (!admin.apps.length) {
  if (!firebaseCredentials.projectId || !firebaseCredentials.privateKey || !firebaseCredentials.clientEmail) {
    throw new Error('Missing required Firebase credentials (projectId, privateKey, or clientEmail).');
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert(firebaseCredentials),
    });
   
  } catch (error) {
    console.error('Firebase Admin SDK initialization failed:', error);
    throw error;
  }
}

export default admin;