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

const baseURL = "https://linked-posts.routemisr.com";

getUserData();
getUserPosts();

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
      setUserData(data);
    });
}

function getUserPosts() {
  const token = localStorage.getItem("token");
  fetch(`${baseURL}/users/664bcf3e33da217c4af21f00/posts`, {
    headers: {
      token,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      showUserPosts(data.posts);
    });
}

function showUserPosts(posts) {
  document.querySelector(".userPosts").innerHTML = posts
    .reverse()
    .map(
      (post) => `<div class="post bg-white p-4 mb-3 md:w-50 mx-auto rounded-2">
                          <div class="header mb-2 userPhoto">
                              <img src=${post.user.photo}
                                  alt="" class="rounded-circle">
                              <span class="fw-semibold">${post.user.name}</span>
                          </div>
                          <div class="body">
                              <h3>${post.body}</h3>
                              ${
                                post.image
                                  ? `<img src="${post.image}" alt="" class="w-100 rounded-2">`
                                  : ""
                              }
                          </div>
                          <div class="d-flex justify-content-between mt-2 py-0 px-3">
                            <button class="text-primary bg-transparent border-0">👍 Like</button>
                            <button class="text-primary bg-transparent border-0">💬 Comment</button>
                            <button class="text-primary bg-transparent border-0">🔗 Share</button>
                          </div>
                      </div>`
    )
    .join("");
}

function setUserData(userData) {
  document.querySelectorAll(".userName").forEach((ele) => {
    ele.innerHTML = userData.user.name;
  });
  document.querySelector(".userType").innerHTML = userData.user.gender;
  document.querySelector(".dob").innerHTML = userData.user.dateOfBirth;
  document.querySelectorAll(".userPhoto img").forEach((ele) => {
    ele.src = userData.user.photo;
  });
}

document.querySelector(".backButton").addEventListener("click", () => {
  location.href = "../index.html";
});
