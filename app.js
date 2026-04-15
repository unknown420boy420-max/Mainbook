const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_ID",
  storageBucket: "YOUR_BUCKET"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

let currentUser = null;

// AUTH
function signup(){
  auth.createUserWithEmailAndPassword(email.value, password.value);
}

function login(){
  auth.signInWithEmailAndPassword(email.value, password.value);
}

auth.onAuthStateChanged(user => {
  if(user){
    currentUser = user;
    auth.style.display = "none";
    loadPosts();
  }
});

// UPLOAD
function upload(){
  const file = document.getElementById("file").files[0];
  const ref = storage.ref(Date.now() + file.name);

  ref.put(file).then(() => {
    ref.getDownloadURL().then(url => {
      db.collection("posts").add({
        user: currentUser.email,
        image: url,
        likes: 0,
        createdAt: Date.now()
      });
      loadPosts();
    });
  });
}

// LOAD POSTS
function loadPosts(){
  db.collection("posts").orderBy("createdAt","desc")
  .onSnapshot(snapshot => {
    feed.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      feed.innerHTML += `
      <div class="post">
        <p>${data.user}</p>
        <img src="${data.image}">
        <div class="actions">
          <span onclick="likePost('${doc.id}', ${data.likes})">
            ❤️ ${data.likes}
          </span>
          <span onclick="commentPost('${doc.id}')">💬</span>
        </div>
      </div>
      `;
    });
  });
}

// LIKE
function likePost(id, currentLikes){
  db.collection("posts").doc(id).update({
    likes: currentLikes + 1
  });
}

// COMMENT
function commentPost(id){
  const text = prompt("Write comment:");
  if(text){
    db.collection("posts").doc(id)
    .collection("comments")
    .add({
      text: text,
      user: currentUser.email
    });
  }
}

// UI NAV
function showUpload(){
  uploadBox.style.display = "block";
}
function showFeed(){
  uploadBox.style.display = "none";
}
function showProfile(){
  alert("Profile coming soon 😎");
}
