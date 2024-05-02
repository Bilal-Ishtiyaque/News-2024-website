//Variables

const leftArrow = document.querySelector(".chevron_left i");
const rightArrow = document.querySelector(".chevron_right i");
const ul = document.querySelector(".nav_list");
let navLinks = document.querySelectorAll(".nav_link");
let searchField = document.querySelector(".search_field");
let searchIcon = document.querySelector(".search_icon");
let menuBtn = document.querySelector(".menu_btn");
let menu = document.querySelector(".menu");
let menuLinks = document.querySelectorAll(".menu_link");
let scrollToTopBtn = document.querySelector(".scroll_to_top");

// on window load
window.addEventListener("load", checkScrollability);
window.addEventListener("load", truncateLines);

// on resize
window.addEventListener("resize", checkScrollability);
window.addEventListener("resize", truncateLines);

window.addEventListener("scroll", CheckScrollToTop);

// Event listener on Document
document.addEventListener('click', function(e) {
    if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
        menu.classList.remove("active");
    }
});


// checking navigation scrollability
function checkScrollability() {
    let isScrollable = (ul.scrollWidth > ul.clientWidth) ? true : false;

    if (isScrollable) {
        rightArrow.parentElement.classList.add("active");
    } else {
        rightArrow.parentElement.classList.remove("active");
    }
}

// event listener on navigation list / scroll functionality 

ul.addEventListener("scroll", (e) => {

    let difference = e.target.scrollWidth - e.target.clientWidth - 10;

    if (e.target.scrollLeft >= 10) {
        leftArrow.parentElement.classList.add("active");
    } else {
        leftArrow.parentElement.classList.remove("active");
    }


    if (e.target.scrollLeft >= difference) {
        rightArrow.parentElement.classList.remove("active");
    } else {
        rightArrow.parentElement.classList.add("active");
    }

    // clientWidth = visible area's width of an element 
    // scrollWidth = full width of scroll content including hidden content due to overflow

});

rightArrow.addEventListener("click", () => {
    ul.scrollLeft += 80;
});

leftArrow.addEventListener("click", () => {
    ul.scrollLeft -= 80;
});


//Scroll to top Functionality

function CheckScrollToTop() {
    if (window.scrollY > 300) {
        scrollToTopBtn.style.transform = "scale(1)";
    } else {
        scrollToTopBtn.style.transform = "scale(0)";
    }
}

scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        left: 0
    });
});


//News Article overflow Text Truncation

function truncateLines() {

    // console.log("fired");

    let news = document.querySelectorAll(".news");


    news.forEach(function (newsElems) {

        let newsDesc = newsElems.querySelector(".news_desc");

        let lineheight = parseInt(window.getComputedStyle(newsDesc).lineHeight);

        let newsRect = newsElems.getBoundingClientRect();
        let newsDescRect = newsDesc.getBoundingClientRect();

        
        let visibleHeight = newsRect.bottom - newsDescRect.top;

        let lines = parseInt(visibleHeight / lineheight);

        if (window.innerWidth > 651) {
            newsDesc.style.setProperty("--lineClamp", `${lines}`);
        } else {
            newsDesc.style.setProperty("--lineClamp", `unset`);
        }

    });
}


//Fetching and showing data From API

const API_KEY = "insert your API key here";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => getNews("world"));

async function getNews(query) {
    let res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    let data = await res.json();
    showNews(data.articles);
    console.log(data.articles);

}


function showNews(articles) {
    let newsSection = document.querySelector(".news_section");
    let templateNewsCard = document.getElementById("template_news_card");

    newsSection.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage || article.urlToImage == null) return;

        let cardClone = templateNewsCard.content.cloneNode(true);
        
        fillDataInCard(cardClone, article);
        newsSection.appendChild(cardClone);
    });

    truncateLines();

}


function fillDataInCard(cardClone, article) {

    let newsImg = cardClone.querySelector(".news_img");
    let newsTitle = cardClone.querySelector(".news_title");
    let newsSource = cardClone.querySelector(".news_source");
    let newsDescription = cardClone.querySelector(".news_desc");
    let newsBanner = cardClone.querySelector(".news_banner");

    newsImg.src = article.urlToImage;
    newsTitle.innerText = article.title;
    newsDescription.innerText = article.description;

    let date = new Date(article.publishedAt).toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        timeZone: "Asia/Karachi"
    });

    newsSource.innerText = `${article.source.name} • ${date}`;

    newsBanner.addEventListener("click", () => {
        window.open(article.url, "_blank")
    });
}

//Navigation link active state

navLinks.forEach((link) => {

    link.addEventListener("click", (e) => {

        menuLinks.forEach((link) => { link.classList.remove("active") });
        menu.classList.remove("active");

        navLinks.forEach((link) => { link.classList.remove("active") });

        let linkClicked = e.target;
        let linkText = linkClicked.innerText;

        linkClicked.classList.add("active");

        getNews(linkText);

    });

});

//Event listener on Search Icon

searchIcon.addEventListener("click", () => {

    let searchVal = searchField.value;

    if (!searchVal) return;

    getNews(searchVal);

    navLinks.forEach((link) => { link.classList.remove("active") });

});

// Open/Close menu

menuBtn.addEventListener("click", openMenu);

function openMenu() {
    menu.classList.toggle("active");
}

// Event listener on menu Links

menuLinks.forEach((link) => {

    link.addEventListener("click", (e) => {

        menuLinks.forEach((link) => { link.classList.remove("active") });

        let linkClicked = e.target;
        linkClicked.classList.add("active");

        menu.classList.remove("active");
    });
})

