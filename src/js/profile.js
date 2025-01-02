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
  });
  document.querySelector(".address").innerHTML = `${
    userData?.address?.street || "El Shohada"
  }, ${userData?.address?.city || "Al Minufiyah, Egypt"}`;
}

(function getPosts(userId) {
  fetch(`${baseURL}/posts`)
    .then((res) => res.json())
    .then((data) => {
      userPosts = data.filter((post) => post.userId == userId);
      // setPosts(userPosts);
    });
})("1");

function setPosts(userPosts) {
  for (let index = 0; index < userPosts.length; index++) {
    const post = userPosts[index];
  }
}

function createPost() {
  let postInput = document.querySelector("#postInput").value;
  fetch(`${baseURL}/posts`, {
    method: 'POST',
    body: JSON.stringify({ post: postInput }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
}