import { db } from './firebase';
import { doc, setDoc, collection, getDocs, getDoc, query, orderBy } from 'firebase/firestore';

const COLL = (uid) => collection(db, 'users', uid, 'assessments');
const DOC  = (uid, id) => doc(db, 'users', uid, 'assessments', id);

export async function saveAssessment(uid, assessment) {
  await setDoc(DOC(uid, assessment.id), assessment);
}

export async function getAssessments(uid) {
  const q = query(COLL(uid), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data());
}

export async function getAssessment(uid, assessmentId) {
  const snap = await getDoc(DOC(uid, assessmentId));
  return snap.exists() ? snap.data() : null;
}
