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

(function getUserData() {
  fetch(`${baseURL}/users/profile-data`, {
    headers: {
      token: localStorage.getItem("token"),
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      setData(data);
    });
})();

function setData(userData) {
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
  history.back();
});
