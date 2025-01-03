if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/src/sw.js")
    .then((reg) => {
      console.log("service worker is registered",reg);
    })
    .catch((err) => console.log("service worker is not registered",err));
}

// Fetch posts from the Fake API
const apiUrl = "https://jsonplaceholder.typicode.com/posts"; // Example Fake API URL

// Function to fetch and display posts
async function fetchPosts() {
  try {
    // Fetch data from the API
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }

    const posts = await response.json(); // Parse JSON data
    displayPosts(posts); // Call function to display posts
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("posts").innerHTML = "<p>Failed to load posts.</p>";
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
          src="images/profile-img.jpg"
          alt="User Profile"
          class="profile-pic"
          
        />
        <div class="user-info">
          <h4>Fatma</h4>
          <p>${post.id} hour ago</p>
        </div>
      </div>
      <div class="post-content">
        <p>
         ${post.body}
        </p>
        <img src="images/post-img.jpg" alt="post-img" class="" />
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
