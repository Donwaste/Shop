export function setupBurgerMenu() {
  const burgerBtn = document.querySelector("#burger-btn");
  const menu = document.querySelector("#overlay-menu");

  if (!burgerBtn || !menu) return;

  const toggle = () => {
    const open = !menu.classList.contains("active");

    menu.classList.toggle("active", open);
    burgerBtn.classList.toggle("active", open);

    document.body.classList.toggle("no-scroll", open);
  };
  burgerBtn.addEventListener("click", toggle);
}
