const addPostBtn = document.querySelector(".addPost");
const postContent = document.querySelector(".modal-body textarea");
const imageInput = document.querySelector("#imageInput");
const closeModalBtn = document.querySelector(".modal-header .btn-close");

addPostBtn.addEventListener("click", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("Token Not Found");
    // redirect to login page
    window.location.href = "./login.html";
    return;
  }
  const formData = new FormData();
  formData.append("body", postContent.value);
  if (imageInput.files[0]) {
    formData.append("image", imageInput.files[0]);
  }
  addPost(formData, token);
});

function addPost(data, token) {
  fetch(`${baseURL}/posts`, {
    method: "POST",
    headers: {
      token: token,
    },
    body: data,
  })
    .then((res) => res.json())
    .then((data) => {
      // close modal
      closeModalBtn.click();
      location.reload();
    });
}

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      imagePreview.src = reader.result;
      imagePreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.style.display = "none";
  }
});
