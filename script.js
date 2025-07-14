// =================================================
// PHẦN LOGIC CỦA DASHBOARD (ĐÃ CẬP NHẬT)
// =================================================
const sidebarToggleBtns = document.querySelectorAll(".sidebar-toggle");
const sidebar = document.querySelector(".sidebar");
const searchForm = document.querySelector(".search-form");
const themeToggleBtn = document.querySelector(".theme-toggle");
const themeIcon = themeToggleBtn.querySelector(".theme-icon");
const allMenuLinks = document.querySelectorAll(".menu-link"); // Đổi tên biến để không bị trùng

// --- PHẦN LOGIC HIỂN THỊ NỘI DUNG (CẬP NHẬT) ---
const dashboardContent = document.getElementById('dashboard-content');
const profileContent = document.getElementById('profile-content');
const mmgContent = document.getElementById('mmg-content'); // Thêm nội dung game

allMenuLinks.forEach((link) => {
  if (!link.hasAttribute('data-content')) return;

  link.addEventListener("click", (e) => {
    e.preventDefault();

    allMenuLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    const contentToShow = link.getAttribute('data-content');

    // Ẩn tất cả các khối nội dung
    dashboardContent.style.display = 'none';
    profileContent.style.display = 'none';
    mmgContent.style.display = 'none'; // Ẩn game

    // Hiện khối nội dung tương ứng
    if (contentToShow === 'dashboard') {
      dashboardContent.style.display = 'block';
    } else if (contentToShow === 'profile') {
      profileContent.style.display = 'flex';
    } else if (contentToShow === 'mmg') {
      mmgContent.style.display = 'flex'; // Hiện game
    }
  });
});

// --- PHẦN CODE GỐC CỦA DASHBOARD ---
const updateThemeIcon = () => {
  const isDark = document.body.classList.contains("dark-theme");
  themeIcon.textContent = sidebar.classList.contains("collapsed") ? (isDark ? "light_mode" : "dark_mode") : "dark_mode";
};
const savedTheme = localStorage.getItem("theme");
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const shouldUseDarkTheme = savedTheme === "dark" || (!savedTheme && systemPrefersDark);
document.body.classList.toggle("dark-theme", shouldUseDarkTheme);
updateThemeIcon();
themeToggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateThemeIcon();
});
sidebarToggleBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    updateThemeIcon();
  });
});
searchForm.addEventListener("click", () => {
  if (sidebar.classList.contains("collapsed")) {
    sidebar.classList.remove("collapsed");
    searchForm.querySelector("input").focus();
  }
});
if (window.innerWidth > 768) sidebar.classList.remove("collapsed");


// =================================================
// PHẦN LOGIC CỦA MEMORY GAME (SAO CHÉP TỪ scriptMMG.js)
// =================================================

const cards = document.querySelectorAll("#mmg-content .card"); // Sửa bộ chọn để chỉ lấy thẻ trong game

let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;

function flipCard({target: clickedCard}) {
    if(cardOne !== clickedCard && !disableDeck) {
        clickedCard.classList.add("flip");
        if(!cardOne) {
            return cardOne = clickedCard;
        }
        cardTwo = clickedCard;
        disableDeck = true;
        let cardOneImg = cardOne.querySelector(".back-view img").src,
        cardTwoImg = cardTwo.querySelector(".back-view img").src;
        matchCards(cardOneImg, cardTwoImg);
    }
}

function matchCards(img1, img2) {
    if(img1 === img2) {
        matched++;
        if(matched == 8) {
            setTimeout(() => {
                return shuffleCard();
            }, 1000);
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        return disableDeck = false;
    }
    setTimeout(() => {
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    }, 400);

    setTimeout(() => {
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne = cardTwo = "";
        disableDeck = false;
    }, 1200);
}

function shuffleCard() {
    matched = 0;
    disableDeck = false;
    cardOne = cardTwo = "";
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
    arr.sort(() => Math.random() > 0.5 ? 1 : -1);
    cards.forEach((card, i) => {
        card.classList.remove("flip");
        let imgTag = card.querySelector(".back-view img");
        // Quan trọng: Đảm bảo thư mục 'images' của bạn có đủ các file img-1.png, img-2.png,...
        imgTag.src = `images/img-${arr[i]}.png`;
        card.addEventListener("click", flipCard);
    });
}

// Bắt đầu game khi tải trang
shuffleCard();
    
cards.forEach(card => {
    card.addEventListener("click", flipCard);
});