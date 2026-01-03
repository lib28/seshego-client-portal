import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export async function getCurrentUserData() {
  const user = auth.currentUser;
  if (!user) return null;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return snap.data();
}
