<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"></script>

// Firebase init (তোমার config বসাবে)
const app = firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const db = firebase.firestore();

let profileFile, coverFile;

document.getElementById("profileInput").onchange = e => {
  profileFile = e.target.files[0];
  document.getElementById("profilePreview").src = URL.createObjectURL(profileFile);
};

document.getElementById("coverInput").onchange = e => {
  coverFile = e.target.files[0];
  document.getElementById("coverPreview").src = URL.createObjectURL(coverFile);
};

function loadProfile() {
  const user = firebase.auth().currentUser;
  if (!user) return;

  firebase.firestore().collection("users").doc(user.uid)
    .onSnapshot((doc) => {
      if (doc.exists) {
        const data = doc.data();

        document.getElementById("profilePreview").src = data.profilePic || "";
        document.getElementById("coverPreview").src = data.coverPhoto || "";
      }
    });
}
  
  // Upload profile
  const profileRef = storage.ref("profiles/" + userId);
  await profileRef.put(profileFile);
  const profileURL = await profileRef.getDownloadURL();

  // Upload cover
  const coverRef = storage.ref("covers/" + userId);
  await coverRef.put(coverFile);
  const coverURL = await coverRef.getDownloadURL();

  // Save to Firestore
  await db.collection("users").doc(userId).set({
    profilePic: profileURL,
    coverPhoto: coverURL
  });

  alert("Profile Updated!");
}

async function loadProfile() {
  const doc = await db.collection("users").doc("user123").get();

  document.getElementById("profilePreview").src = doc.data().profilePic;
  document.getElementById("coverPreview").src = doc.data().coverPhoto;
}

loadProfile();
