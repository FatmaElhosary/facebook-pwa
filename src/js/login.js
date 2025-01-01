const userEmail = document.getElementById("userEmail");
const userPassword = document.getElementById("userPassword");
const loginBtn = document.getElementById("loginBtn");
const alert = document.querySelector(".alert");

loginBtn.addEventListener("click", (e) => {
  const user = {
    email: userEmail.value,
    password: userPassword.value,
  };
  login(user);
});

function login(userData) {
  fetch("https://linked-posts.routemisr.com/users/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => {
      if (!response.ok) {
        alert.classList.remove("d-none");
        return;
      }
      alert.classList.replace("alert-danger", "alert-success");
      alert.innerHTML = "Success";
      alert.classList.remove("d-none");
      return response.json();
    })
    .then((response) => {
      localStorage.setItem("token", response.token);
      window.location.href = "./profile.html";
    });
}
