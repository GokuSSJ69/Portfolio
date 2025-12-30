const preloader = document.querySelector("[data-preloader]");

window.addEventListener('load', () => {

  setTimeout(() => {
    preloader.classList.add('remove');
  }, 1500);
});

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

addEventOnElements(navTogglers, "click", toggleNavbar);


const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
  header.classList[window.scrollY > 100 ? "add" : "remove"]("active");
});

const heroSearchForm = document.getElementById("heroSearchForm");
const heroSearchInput = document.getElementById("heroSearchInput");

if (heroSearchForm && heroSearchInput) {
  const lastSearch = sessionStorage.getItem("travelia:lastSearch");
  if (lastSearch) {
    heroSearchInput.value = lastSearch;
  }

  heroSearchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const query = heroSearchInput.value.trim();

    if (!query) {
      heroSearchInput.focus();
      return;
    }

    sessionStorage.setItem("travelia:lastSearch", query);

    window.location.href = `search-results.html?query=${query}`;
  });
}

const moreDestiBtn = document.querySelector("[data-more-desti]");
const extraDestinations = document.querySelectorAll("[data-extra-desti]");

if (moreDestiBtn && extraDestinations.length) {
  moreDestiBtn.addEventListener("click", () => {
    const isExpanded = moreDestiBtn.getAttribute("aria-expanded") === "true";
    const nextState = !isExpanded;

    extraDestinations.forEach((item) => {
      item.classList.toggle("is-visible", nextState);
    });

    moreDestiBtn.setAttribute("aria-expanded", String(nextState));

    const labelSpan = moreDestiBtn.querySelector(".span");
    const icon = moreDestiBtn.querySelector("ion-icon");

    if (labelSpan) {
      labelSpan.textContent = nextState
        ? "Show Fewer Destinations"
        : "View More Destinations";
    }

    if (icon) {
      icon.setAttribute("name", nextState ? "chevron-up" : "chevron-down");
    }

    if (nextState) {
      extraDestinations[0].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      moreDestiBtn.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  });
}
