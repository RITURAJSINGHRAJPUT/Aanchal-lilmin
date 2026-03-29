import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import type { Student, StudentFormData, Payment } from '../types';

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Auth helpers
export const loginWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const logout = () => signOut(auth);

export const onAuthChange = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback);

// Firestore helpers
const studentsCollection = collection(db, 'students');

export const getStudents = async (): Promise<Student[]> => {
  const q = query(studentsCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Student[];
};

export const getStudent = async (id: string): Promise<Student | null> => {
  const docRef = doc(db, 'students', id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Student;
};

export const addStudent = async (data: StudentFormData): Promise<string> => {
  const studentData = {
    name: data.name,
    age: data.age,
    class: data.class,
    parentName: data.parentName,
    contactNumber: data.contactNumber,
    address: data.address,
    admissionDate: data.admissionDate,
    createdAt: Timestamp.now().toDate().toISOString(),
    fees: {
      totalFees: data.totalFees,
      paidFees: data.paidFees,
      pendingFees: data.totalFees - data.paidFees,
      lastPaymentDate: data.paidFees > 0 ? new Date().toISOString().split('T')[0] : null,
    },
  };
  const docRef = await addDoc(studentsCollection, studentData);
  return docRef.id;
};

export const updateStudent = async (
  id: string,
  data: StudentFormData
): Promise<void> => {
  const docRef = doc(db, 'students', id);
  await updateDoc(docRef, {
    name: data.name,
    age: data.age,
    class: data.class,
    parentName: data.parentName,
    contactNumber: data.contactNumber,
    address: data.address,
    admissionDate: data.admissionDate,
    'fees.totalFees': data.totalFees,
    'fees.paidFees': data.paidFees,
    'fees.pendingFees': data.totalFees - data.paidFees,
  });
};

export const deleteStudent = async (id: string): Promise<void> => {
  const docRef = doc(db, 'students', id);
  await deleteDoc(docRef);
};

export const updatePayment = async (
  id: string,
  amount: number,
  currentPaid: number,
  totalFees: number
): Promise<void> => {
  const newPaid = currentPaid + amount;
  const docRef = doc(db, 'students', id);
  await updateDoc(docRef, {
    'fees.paidFees': newPaid,
    'fees.pendingFees': totalFees - newPaid,
    'fees.lastPaymentDate': new Date().toISOString().split('T')[0],
  });
};

// Payment Subcollection Helpers
export const getPayments = async (studentId: string): Promise<Payment[]> => {
  const paymentsQuery = query(
    collection(db, `students/${studentId}/payments`),
    orderBy('date', 'desc')
  );
  const snapshot = await getDocs(paymentsQuery);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Payment[];
};

export const addStudentPayment = async (
  studentId: string,
  amount: number,
  mode: 'Cash' | 'Online',
  date: string,
  note: string,
  currentPaid: number,
  totalFees: number
): Promise<string> => {
  const batch = writeBatch(db);
  
  // 1. Create the payment record
  const paymentRef = doc(collection(db, `students/${studentId}/payments`));
  batch.set(paymentRef, {
    studentId,
    amount,
    mode,
    date,
    note,
    createdAt: Timestamp.now().toDate().toISOString()
  });

  // 2. Update the student's fee summary
  const newPaid = currentPaid + amount;
  const studentRef = doc(db, 'students', studentId);
  batch.update(studentRef, {
    'fees.paidFees': newPaid,
    'fees.pendingFees': totalFees - newPaid,
    'fees.lastPaymentDate': date.split('T')[0], // keep date format concise
  });

  await batch.commit();
  return paymentRef.id;
};

export const deleteStudentPayment = async (
  studentId: string,
  paymentId: string,
  amount: number,
  currentPaid: number,
  totalFees: number
): Promise<void> => {
  const batch = writeBatch(db);
  
  // 1. Delete the payment record
  const paymentRef = doc(db, `students/${studentId}/payments`, paymentId);
  batch.delete(paymentRef);

  // 2. Revert the student's fee summary
  const newPaid = currentPaid - amount;
  const studentRef = doc(db, 'students', studentId);
  batch.update(studentRef, {
    'fees.paidFees': Math.max(0, newPaid),
    'fees.pendingFees': Math.max(0, totalFees - newPaid)
  });

  await batch.commit();
};
