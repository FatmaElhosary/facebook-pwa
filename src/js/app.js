const baseURL = "https://linked-posts.routemisr.com";
pathLoginPage = "./pages/login.html";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/src/sw.js")
    .then((reg) => {
      console.log("service worker is registered");
    })
    .catch((err) => console.log("service worker is not registered", err));
}

const GET_ALL_POSTS = `${baseURL}/posts?limit=20`; // real API URL
getUserData();
function getUserData() {
  let token = localStorage.getItem("token");
  if (!token) {
    console.log("Token Not Found");
    // redirect to login page
    window.location.href = "./login.html";
    return;
  }
  fetch(`${baseURL}/users/profile-data`, {
    headers: {
      token,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      setUserData(data);
    });
}

function setUserData(userData) {
  document.querySelector("#Navbar img").src = userData.user.photo;
  document.querySelectorAll(".userPhoto img").forEach((ele) => {
    ele.src = userData.user.photo;
  });
}

// Function to fetch and display posts
async function fetchPosts() {
  try {
    let token = localStorage.getItem("token");
    if (!token) {
      console.log("Token Not Found");
      // redirect to login page
      window.location.href = pathLoginPage;
      return;
    }
    // Fetch data from the API
    let response = await fetch(GET_ALL_POSTS, {
      headers: {
        token,
      },
    });
    response
      .json()
      .then((data) => {
        displayPosts(data.posts);
      })
      .catch((err) => {
        throw new Error("Failed to fetch posts");
      });

    // if (response.message != "success") {
    //   throw new Error("Failed to fetch posts");
    // }

    // const posts = await response.posts; // Parse JSON data
    // displayPosts(posts);
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("home-posts").innerHTML =
      "<p>Failed to load posts.</p>";
  }
}

// Function to display posts on the page
function displayPosts(posts) {
  const postsContainer = document.getElementById("home-posts");
  postsContainer.innerHTML = ""; // Clear any existing content

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.className = "post-container";
    postElement.innerHTML = `
     <div class="post-header">
        <img
          src=${post.user.photo}
          alt="User Profile"
          class="profile-pic"

        />
        <div class="user-info">
          <h4>${post.user.name}</h4>
          <p>${getHoursAgoSafe(post.createdAt)}   </p>
        </div>
      </div>
      <div class="post-content p-3">
        <p>
         ${post.body}
        </p>
        ${
          post.image
            ? `<img src="${post.image}" alt="" class="w-100 rounded-2">`
            : ""
        }
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

// Call the function to fetch and display posts when the page loads
fetchPosts();
function getHoursAgoSafe(timestamp) {
  const pastDate = new Date(timestamp);
  const now = new Date();
  let hoursAgoSafe = "now";
  if (pastDate > now) {
    return "In the future";
  }

  const hoursAgo = Math.floor((now - pastDate) / (1000 * 60 * 60));
  if (hoursAgo == 24) hoursAgoSafe = "yesterday";
  else if (hoursAgo > 24) {
    hoursAgoSafe = "Long Time Ago";
  } else hoursAgoSafe = `${hoursAgo} hours ago`;
  return hoursAgoSafe;
}

document.querySelector(".logout").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = pathLoginPage;
});
