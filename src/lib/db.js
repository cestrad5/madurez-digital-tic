import { db } from './firebase';
import { doc, setDoc, collection, getDocs, getDoc, query, orderBy } from 'firebase/firestore';

const COLL       = (uid)   => collection(db, 'users', uid, 'assessments');
const DOC        = (uid, id) => doc(db, 'users', uid, 'assessments', id);
const SHARE_DOC  = (token) => doc(db, 'shares', token);

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

export async function saveShare(shareToken, assessment) {
  const { answers: _omit, ...data } = assessment;
  await setDoc(SHARE_DOC(shareToken), data);
}

export async function getShare(shareToken) {
  const snap = await getDoc(SHARE_DOC(shareToken));
  return snap.exists() ? snap.data() : null;
}
