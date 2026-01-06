const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

/**
 * Callable function:
 * Client creates an employee user (Auth + Firestore) and sends invite email.
 */
exports.createEmployee = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Login required.');
  }

  const { fullName, email } = data || {};
  if (!fullName || !email) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'fullName and email are required.'
    );
  }

  const clientUid = context.auth.uid;

  // 1) Get the caller profile to ensure they are a client and get companyId
  const clientUserSnap = await admin.firestore().doc(`users/${clientUid}`).get();
  if (!clientUserSnap.exists) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Client profile missing in users collection.'
    );
  }

  const clientUser = clientUserSnap.data();
  const role = String(clientUser.role || '').toLowerCase();
  const companyId = clientUser.companyId;

  if (role !== 'client') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only clients can create employees.'
    );
  }

  if (!companyId) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'Client companyId is missing. Add companyId to users/{clientUid}.'
    );
  }

  // 2) Create a temp password
  const tempPassword = generateTempPassword();

  // 3) Create Auth user
  let userRecord;
  try {
    userRecord = await admin.auth().createUser({
      email,
      password: tempPassword,
      displayName: fullName,
    });
  } catch (err) {
    // If user already exists, stop and return a clean message
    if (err && err.code === 'auth/email-already-exists') {
      throw new functions.https.HttpsError(
        'already-exists',
        'That email already has an account.'
      );
    }
    throw new functions.https.HttpsError(
      'internal',
      err.message || 'Failed to create Auth user.'
    );
  }

  const employeeUid = userRecord.uid;
  const now = admin.firestore.FieldValue.serverTimestamp();

  // 4) Set role claim (optional but good)
  await admin.auth().setCustomUserClaims(employeeUid, {
    role: 'employee',
    companyId,
  });

  // 5) Create Firestore docs
  await admin.firestore().doc(`users/${employeeUid}`).set(
    {
      email,
      role: 'employee',
      companyId,
      createdAt: now,
      createdByUid: clientUid,
    },
    { merge: true }
  );

  await admin.firestore().doc(`employees/${employeeUid}`).set(
    {
      uid: employeeUid,
      companyId,
      fullName,
      email,
      status: 'active',
      createdByUid: clientUid,
      createdAt: now,
    },
    { merge: true }
  );

  // 6) Send email via Trigger Email extension (writes to mail collection)
  const loginUrl = 'https://YOUR_NETLIFY_DOMAIN/login';

  const subject = 'Seshego Portal — Your Employee Access';
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Welcome to the Seshego Portal</h2>
      <p>Hello ${escapeHtml(fullName)},</p>
      <p>Your employee access has been created.</p>
      <p><b>Login email:</b> ${escapeHtml(email)}<br/>
         <b>Temporary password:</b> ${escapeHtml(tempPassword)}</p>
      <p>Please log in and change your password after first sign-in.</p>
      <p><a href="${loginUrl}">${loginUrl}</a></p>
      <hr/>
      <p style="font-size: 12px; color: #666;">Seshego Consulting</p>
    </div>
  `;

  await admin.firestore().collection('mail').add({
    to: [email],
    message: { subject, html },
  });

  return { ok: true, employeeUid };
});

function generateTempPassword() {
  // Simple readable temp password for demo (upgrade later)
  const part1 = Math.random().toString(36).slice(2, 6).toUpperCase();
  const part2 = Math.random().toString(36).slice(2, 6);
  return `${part1}-${part2}!`;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
