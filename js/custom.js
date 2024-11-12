(function ($) {

  "use strict";

    // PRE LOADER
    $(window).load(function(){
      $('.preloader').fadeOut(1000); // set duration in brackets    
    });


    // MENU
    $('.navbar-collapse a').on('click',function(){
      $(".navbar-collapse").collapse('hide');
    });

    $(window).scroll(function() {
      if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
          } else {
            $(".navbar-fixed-top").removeClass("top-nav-collapse");
          }
    });


    // PARALLAX EFFECT
    $.stellar({
      horizontalScrolling: false,
    }); 


    // ABOUT SLIDER
    $('.owl-carousel').owlCarousel({
      animateOut: 'fadeOut',
      items: 1,
      loop: true,
      autoplayHoverPause: false,
      autoplay: true,
      smartSpeed: 1000,
    });


    // SMOOTHSCROLL
    $(function() {
      $('.custom-navbar a').on('click', function(event) {
        var $anchor = $(this);
          $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top - 49
          }, 1000);
            event.preventDefault();
      });
    });  

})(jQuery);

document.addEventListener("DOMContentLoaded", function () {
    const genButton = document.querySelector(".gen-btn");
    const radioButtonGroup = document.querySelector(".radio-button-group");

    function moveButtonForMobile() {
        // Проверява дали ширината на прозореца е 767px или по-малко
        if (window.innerWidth <= 767) {
            // Премества бутона под радио бутоните
            radioButtonGroup.insertAdjacentElement('afterend', genButton);
        } else {
            // Връща бутона на първоначалното му място при по-големи екрани
            document.querySelector(".generate-url-container").appendChild(genButton);
        }
    }

    // Извиква се при зареждане на страницата и при промяна на размера на прозореца
    moveButtonForMobile();
    window.addEventListener("resize", moveButtonForMobile);
});

// Линк генератор
document.addEventListener("DOMContentLoaded", function () {
    const pathLengthElement = document.getElementById("path-length");
    pathLengthElement.style.display = "none"; // Скриване на брояча при зареждане на страницата
});

const generateShortUrl = () => {
    const longUrl = document.getElementById("longurl").value.trim();
    const shortUrlContainer = document.querySelector(".short-url-container");
    const pathLengthElement = document.getElementById("path-length");
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,3}(\/[\w\d\-@#!?%[\]{}_+=*$/&(){}:]*)*$/i;

    // Проверка за празно поле
    if (!longUrl) {
        showPopup("Грешка", "Моля, въведете URL адрес.");
        pathLengthElement.style.display = "none"; // Скриване на брояча, ако URL полето е празно
        return;
    }

    // Проверка дали въведеният текст изглежда като валиден URL
    if (!urlPattern.test(longUrl)) {
        showPopup("Грешка", "Въведените данни не изглеждат като URL. Моля, въведете валиден URL, например 'https://example.com'.");
        pathLengthElement.style.display = "none"; // Скриване на брояча при невалиден URL
        return;
    }

    const formattedUrl = longUrl.startsWith("http") ? longUrl : `https://${longUrl}`;

    try {
        const url = new URL(formattedUrl); // Проверка за валидност на URL

        // Проверка за минимална дължина от 10 символа
        const totalLength = url.protocol.length + url.hostname.length + url.pathname.length;
        if (totalLength < 25) {
            showPopup("Грешка", "Въведеният URL адрес е твърде кратък. Моля, въведете URL с поне 25 символа.");
            pathLengthElement.style.display = "none"; // Скриване на брояча при къс URL
            return;
        }

        // Определяне на дължината за пътя на краткия URL на базата на избрания радио бутон
        let maxLength;
        const selectedLength = document.querySelector('input[name="urlLength"]:checked');
        if (selectedLength) {
            maxLength = parseInt(selectedLength.value, 10);
        } else {
            maxLength = Math.floor(Math.random() * 26) + 5;
        }

        // Създаване на кратък URL с определената дължина само за пътя
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#!?%[]{}_-=+*/$&(){}:";
        const randomSegment = Array.from({ length: maxLength }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
        const shortUrl = `${url.protocol}//${url.hostname}/${randomSegment}`;

        // Показване на краткия URL в полето
        document.getElementById("shorturl").value = shortUrl;

        // Актуализиране и показване на брояча на символите в пътя
        pathLengthElement.innerHTML = `Генерираните символи са: <span style="color: #00FFC0; font-size: 16px; font-weight: bold;">${randomSegment.length}</span>`;
        pathLengthElement.style.display = "block"; // Показване на брояча

        // Показване на контейнера за кратък URL с ефект
        if (!shortUrlContainer.classList.contains("visible")) {
            shortUrlContainer.style.display = "flex";
            setTimeout(() => shortUrlContainer.classList.add("visible"), 10);
        }
    } catch {
        showPopup("Грешка", "Моля, въведете валиден URL адрес.");
        pathLengthElement.style.display = "none"; // Скриване на брояча при грешка
    }
};

// Селектиране на текста в инпут полето за дълъг URL при фокусиране
document.getElementById("longurl").addEventListener("focus", function () {
    if (this.value) {
        this.select();
    }
});

function clearSelection() {
    const radioButtons = document.querySelectorAll('input[name="urlLength"]');
    radioButtons.forEach((radio) => {
        radio.checked = false;
    });
}

// Функция за създаване и показване на pop-up със съобщение
const showPopup = (title, message) => {
    // Премахни съществуващ popup, ако има такъв
    const existingPopup = document.querySelector(".popup-overlay");
    if (existingPopup) existingPopup.remove();

    // Създаване на нов popup
    const popup = document.createElement("div");
    popup.innerHTML = `
        <div class="popup-overlay">
            <div class="popup-box">
                <h2>${title}</h2>
                <p>${message}</p>
                <button onclick="this.closest('.popup-overlay').remove()">Затвори</button>
            </div>
        </div>
        <style>
            .popup-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.5); 
                animation: fadeIn 0.3s ease-in-out; z-index: 1000; }
            .popup-box { max-width: 300px; padding: 20px; text-align: center; background: #fff; 
                border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); animation: popupZoomIn 0.4s ease-in-out; }
            .popup-box h2 { margin-bottom: 10px; color: #333; }
            .popup-box p { margin-bottom: 20px; color: #555; }
            .popup-box button { padding: 8px 16px; border: none; background: #29ca8e; color: #fff; 
                cursor: pointer; border-radius: 4px; }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes popupZoomIn { from { transform: scale(0.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        </style>
    `;
    document.body.appendChild(popup);
};

// Добавяне на събитие за натискане на Enter в полето за дълъг URL
document.getElementById("longurl").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // Спира изпълнението на подразбиране
        generateShortUrl();
    }
});

// Функция за скриване или показване на текста "Изчисти избраното" според избора на радио бутон
function toggleClearSelection() {
    const clearSelectionText = document.querySelector(".clear-selection");
    const radioButtons = document.querySelectorAll(".radio-button-group input[type='radio']");
    let isSelected = false;

    // Проверка дали някой радио бутон е маркиран
    radioButtons.forEach(radio => {
        if (radio.checked) {
            isSelected = true;
        }
    });

    // Показване или скриване на текста "Изчисти избраното"
    clearSelectionText.style.display = isSelected ? "inline" : "none";
}

// Функция за изчистване на избора на радио бутоните и скриване на текста "Изчисти избраното"
function clearSelection() {
    const radioButtons = document.querySelectorAll(".radio-button-group input[type='radio']");
    radioButtons.forEach(radio => {
        radio.checked = false; // Изчистване на избора
    });
    toggleClearSelection(); // Актуализиране на видимостта на текста
}

// Добавяне на event listener за всяка промяна на радио бутоните
document.querySelectorAll(".radio-button-group input[type='radio']").forEach(radio => {
    radio.addEventListener("change", toggleClearSelection);
});


function clearSelection() {
    document.querySelectorAll('input[name="urlLength"]').forEach((radio) => {
        radio.checked = false;
    });
    document.querySelector('.clear-selection').style.display = 'none';
}

// Показване на текста "Изчисти филтъра" само когато има избран радио бутон
document.querySelectorAll('input[name="urlLength"]').forEach((radio) => {
    radio.addEventListener('change', () => {
        document.querySelector('.clear-selection').style.display = 'inline-flex';
    });
});




document.addEventListener("DOMContentLoaded", function () {
    const radioButtons = document.querySelectorAll(".radio-button-group label input[type='radio']");
    const clearSelectionText = document.querySelector(".clear-selection");

    function updateTextForMobile() {
        // Промяна на текста на радио бутоните
        if (radioButtons.length >= 3) {
            if (window.innerWidth <= 767) {
                // Променяме текста на радио бутоните за мобилно
                radioButtons[0].nextSibling.textContent = "5 сим.";
                radioButtons[1].nextSibling.textContent = "10 сим.";
                radioButtons[2].nextSibling.textContent = "15 сим.";
                // Променяме текста на "Изчисти филтъра" на "Изчисти", но запазваме иконата
                if (clearSelectionText) clearSelectionText.innerHTML = `<i class="fa fa-times-circle clear-icon"></i> Изчисти`;
            } else {
                // Възстановяваме оригиналния текст при по-големи екрани
                radioButtons[0].nextSibling.textContent = "До 5 символа";
                radioButtons[1].nextSibling.textContent = "До 10 символа";
                radioButtons[2].nextSibling.textContent = "До 15 символа";
                if (clearSelectionText) clearSelectionText.innerHTML = `<i class="fa fa-times-circle clear-icon"></i> Изчисти филтъра`;
            }
        }
    }

    // Извикваме функцията при зареждане и при промяна на размера на екрана
    updateTextForMobile();
    window.addEventListener("resize", updateTextForMobile);
});


document.addEventListener("DOMContentLoaded", function () {
    const longUrlInput = document.getElementById("longurl");
    const radioButtonGroupContainer = document.querySelector(".radio-button-group");

    // Първоначално не добавяме клас "visible", за да остане скрито
    radioButtonGroupContainer.classList.remove("visible");

    function toggleRadioButtons() {
        if (longUrlInput.value.trim()) {
            radioButtonGroupContainer.classList.add("visible"); // Показва радио бутоните
        } else {
            radioButtonGroupContainer.classList.remove("visible"); // Скрива ги
        }
    }

    longUrlInput.addEventListener("input", toggleRadioButtons);
    toggleRadioButtons();
});


//Плавно скролиране на страницата до най-горната си част при клик на логото
document.addEventListener("DOMContentLoaded", function() {
    const logoLink = document.querySelector(".navbar-brand");
    
    logoLink.addEventListener("click", function(event) {
        event.preventDefault(); // Спира изпълнението на линка по подразбиране
        smoothScrollToTop(1000); // Време за скролиране в милисекунди (1000ms = 1 секунда)
    });

    function smoothScrollToTop(duration) {
        const startPosition = window.pageYOffset;
        const startTime = performance.now();

        function scrollStep(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1); // Нормализираме до максимум 1
            const ease = 1 - Math.pow(1 - progress, 3); // По-плавен ефект с easing

            window.scrollTo(0, startPosition * (1 - ease));

            if (progress < 1) {
                requestAnimationFrame(scrollStep); // Продължава скролирането
            }
        }

        requestAnimationFrame(scrollStep); // Стартира анимацията
    }
});

// Функция за записване на URL-ове с showPopup за съобщения
function saveUrl() {
    const longUrl = document.getElementById('longurl').value;
    const shortUrl = document.getElementById('shorturl').value;

    // Проверка дали полетата не са празни
    if (!longUrl || !shortUrl) {
        showPopup("Грешка", "Моля, въведете и дълъг, и кратък URL.");
        return;
    }

    // Изпращане на POST заявка към сървъра
    fetch('http://localhost:3000/api/save-url', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ longUrl, shortUrl })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            showPopup("Грешка", data.error);
        } else {
            showPopup("Успех", data.message);
            console.log('Записан ID:', data.id);
        }
    })
    .catch(error => {
        console.error('Грешка при запис:', error);
        showPopup("Грешка", "Възникна грешка при записване на URL.");
    });
}

// Присвояване на функцията към бутона за запис
document.getElementById('saveButton').addEventListener('click', saveUrl);

// Изтриване на всички записи при първоначално зареждане на страницата
document.addEventListener("DOMContentLoaded", function () {
    fetch('http://localhost:3000/api/clear-urls', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message); // Съобщение за успех
    })
    .catch(error => {
        console.error('Грешка при изтриване на данни:', error);
    });
});