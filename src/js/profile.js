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
