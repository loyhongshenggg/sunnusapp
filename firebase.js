import { initializeApp, getApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'
import secrets from './secrets'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = secrets.firebase

// Initialize Firebase
let app
if (getApps.length === 0) {
  app = initializeApp(firebaseConfig)
  console.debug('firebase: initialized') // perma
} else {
  console.debug('firebase: continued') // perma
  app = getApp()
}

const auth = getAuth(app)
const db = getFirestore(app)
const functions = getFunctions(app)

export { auth, db, functions }
