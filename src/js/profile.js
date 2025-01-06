window.addEventListener("scroll", function () {
  const currentScroll = window.scrollY;
  const heightNavbar = document.querySelector("nav").offsetHeight;
  const navBill = document.querySelector(".nav-pills");
  if (currentScroll > document.querySelector("main").offsetTop - heightNavbar) {
    navBill.classList.add("position-fixed");
    navBill.classList.replace("container", "container-fluid");
    navBill.style.top = `${heightNavbar}px`;
  } else {
    navBill.classList.remove("position-fixed");
    navBill.classList.replace("container-fluid", "container");
  }
});

const baseURL = "https://jsonplaceholder.typicode.com";
username = '';

(function getUserData(userId) {
  fetch(`${baseURL}/users/${userId}`)
    .then((res) => res.json())
    .then((data) => {
      setData(data);
    });
})("1");

function setData(userData) {
  document.querySelectorAll(".userName").forEach((ele) => {
    ele.innerHTML = userData.name || "Mohamed Omara";
    username = userData.name
  });
  document.querySelector(".address").innerHTML = `${
    userData?.address?.street || "El Shohada"
  }, ${userData?.address?.city || "Al Minufiyah, Egypt"}`;
}

let userPosts = [];

(function getPosts(userId) {
  fetch(`${baseURL}/posts`)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      userPosts = data.filter((post) => post.userId == userId);
      displayPosts();
    })
    .catch((err) => console.error("Error fetching posts:", err));
})("1");

function displayPosts() {
  const postsContainer = document.getElementById("posts");
  postsContainer.innerHTML = ""; 
  if (userPosts.length === 0) {
    postsContainer.innerHTML = "<p>No posts available for this user.</p>";
    return;
  }

  userPosts.forEach((post) => {    
    const postElement = document.createElement("div");
    postElement.className = "post-container";
    postElement.innerHTML = `
      <div class="post-header">
        <img
          src="images/profile-img.jpg"
          alt="User Profile"
          class="profile-pic"
        />
        <div class="user-info">
          <h4>${username}</h4>
        </div>
      </div>
      <div class="post-content">
        <p>${post.body}</p>
      </div>
      <div class="post-footer">
        <button class="like-button">👍 Like</button>
        <button class="comment-button">💬 Comment</button>
        <button class="share-button">🔗 Share</button>
      </div>
    `;
    postsContainer.appendChild(postElement);
  });
}

function openPrompet() {

  if(defferedPrompt){
    defferedPrompt.prompt();

  }
  defferedPrompt.userChoise.then(function (choiseRes){
    if(choiseRes.outcome =="dismissed"){
      console.log("dismissed")
    }else{
      console.log("accepted")
    }
  })
  }

function createPost() {
  let post = document.querySelector("#postInput").value;
  fetch(`${baseURL}/posts`, {
    method: 'POST',
    body: JSON.stringify({ 
      title: 'foo',
      body: post,
      userId: 1,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((res) => res.json())
    .then((data) => {console.log(data)
      document.querySelector("#postInput").value = '';
      userPosts.unshift(data)
      displayPosts()
    })
    .catch((err) => console.error(err));
}

