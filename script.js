const sidebarToggleBtns = document.querySelectorAll(".sidebar-toggle");
const sidebar = document.querySelector(".sidebar");
const searchForm = document.querySelector(".search-form");
const themeToggleBtn = document.querySelector(".theme-toggle");
const themeIcon = themeToggleBtn.querySelector(".theme-icon");
const allMenuLinks = document.querySelectorAll(".menu-link");

// --- PHẦN LOGIC HIỂN THỊ NỘI DUNG (CẬP NHẬT) ---
const dashboardContent = document.getElementById('dashboard-content');
const profileContent = document.getElementById('profile-content');
const mmgContent = document.getElementById('mmg-content');
const pianoContent = document.getElementById('piano-content');
// Thêm biến cho nội dung drawing
const drawContent = document.getElementById('draw-content'); 

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
    mmgContent.style.display = 'none';
    pianoContent.style.display = 'none';
    drawContent.style.display = 'none'; // Ẩn drawing

    // Hiện khối nội dung tương ứng
    if (contentToShow === 'dashboard') {
      dashboardContent.style.display = 'block';
    } else if (contentToShow === 'profile') {
      profileContent.style.display = 'flex';
    } else if (contentToShow === 'mmg') {
      mmgContent.style.display = 'flex';
    } else if (contentToShow === 'piano') {
      pianoContent.style.display = 'flex';
    } else if (contentToShow === 'draw') { // Thêm điều kiện cho drawing
      drawContent.style.display = 'flex'; // Dùng flex để căn giữa
      initDrawingCanvas(); // Gọi hàm khởi tạo canvas
    }
  });
});

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

// --- SCRIPT CỦA MEMORY GAME ---
const cards = document.querySelectorAll("#mmg-content .card");
// ... (giữ nguyên code của memory game)
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
 
        imgTag.src = `images/img-${arr[i]}.png`;
        card.addEventListener("click", flipCard);
    });
}

shuffleCard();
    
cards.forEach(card => {
    card.addEventListener("click", flipCard);
});

// --- SCRIPT CỦA PIANO ---
const pianoKeys = document.querySelectorAll("#piano-content .piano-keys .key"),
// ... (giữ nguyên code của piano)
volumeSlider = document.querySelector("#piano-content .volume-slider input"),
keysCheckbox = document.querySelector("#piano-content .keys-checkbox input");

let allKeys = [],
audio = new Audio(`tunes/a.wav`);

const playTune = (key) => {
    audio.src = `tunes/${key}.wav`;
    audio.play(); 

    const clickedKey = document.querySelector(`#piano-content [data-key="${key}"]`); 
    clickedKey.classList.add("active"); 
    setTimeout(() => { 
        clickedKey.classList.remove("active");
    }, 150);
}

pianoKeys.forEach(key => {
    allKeys.push(key.dataset.key);
    key.addEventListener("click", () => playTune(key.dataset.key));
});

const handleVolume = (e) => {
    audio.volume = e.target.value; 
}

const showHideKeys = () => {
    pianoKeys.forEach(key => key.classList.toggle("hide"));
}

const pressedKey = (e) => {
    if(allKeys.includes(e.key)) playTune(e.key);
}

keysCheckbox.addEventListener("click", showHideKeys);
volumeSlider.addEventListener("input", handleVolume);
document.addEventListener("keydown", pressedKey);


// ==================================
// SCRIPT CỦA DRAWING APP ĐƯỢC THÊM TẠI ĐÂY
// ==================================

// Trỏ tất cả các biến vào trong #draw-content để tránh xung đột
const drawCanvas = document.querySelector("#draw-content canvas"),
drawToolBtns = document.querySelectorAll("#draw-content .tool"),
drawFillColor = document.querySelector("#draw-content #fill-color"),
drawSizeSlider = document.querySelector("#draw-content #size-slider"),
drawColorBtns = document.querySelectorAll("#draw-content .colors .option"),
drawColorPicker = document.querySelector("#draw-content #color-picker"),
drawClearCanvas = document.querySelector("#draw-content .clear-canvas"),
drawSaveImg = document.querySelector("#draw-content .save-img"),
ctx = drawCanvas.getContext("2d");

// Biến toàn cục
let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5,
selectedColor = "#000",
canvasInitialized = false; // Cờ để kiểm tra canvas đã được khởi tạo chưa

const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
    ctx.fillStyle = selectedColor;
}

// Hàm này sẽ được gọi khi người dùng click vào mục Drawing
const initDrawingCanvas = () => {
    if (canvasInitialized) return; // Nếu đã khởi tạo thì không làm gì cả
    canvasInitialized = true; // Đánh dấu đã khởi tạo

    // Đặt kích thước canvas bằng kích thước của phần tử cha
    drawCanvas.width = drawCanvas.offsetWidth;
    drawCanvas.height = drawCanvas.offsetHeight;
    setCanvasBackground();
};

const drawRect = (e) => {
    if(!drawFillColor.checked) {
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const drawCircle = (e) => {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    drawFillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);

    ctx.closePath();
    drawFillColor.checked ? ctx.fill() : ctx.stroke();
}

const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapshot = ctx.getImageData(0, 0, drawCanvas.width, drawCanvas.height);
}

const drawing = (e) => {
    if(!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0);

    if(selectedTool === "brush" || selectedTool === "eraser") {
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if(selectedTool === "rectangle"){
        drawRect(e);
    } else if(selectedTool === "circle"){
        drawCircle(e);
    } else {
        drawTriangle(e);
    }
}

drawToolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("#draw-content .options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});

drawSizeSlider.addEventListener("change", () => brushWidth = drawSizeSlider.value);

drawColorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("#draw-content .options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

drawColorPicker.addEventListener("change", () => {
    drawColorPicker.parentElement.style.background = drawColorPicker.value;
    drawColorPicker.parentElement.click();
});

drawClearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    setCanvasBackground();
});

drawSaveImg.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = drawCanvas.toDataURL();
    link.click();
});

drawCanvas.addEventListener("mousedown", startDraw);
drawCanvas.addEventListener("mousemove", drawing);
drawCanvas.addEventListener("mouseup", () => isDrawing = false);