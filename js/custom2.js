// JavaScript за зареждане на последните 3 кратки URL-и и пренасочване към дългите URL-и
document.addEventListener("DOMContentLoaded", function () {
    console.log("Скриптът се стартира и чака данни от сървъра");

    // Изпращане на заявка към сървъра за последните 3 кратки URL-а
    fetch('http://localhost:3000/api/get-short-urls')
        .then(response => {
            if (!response.ok) {
                throw new Error("Грешка при връзката със сървъра: " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("Данни получени от API:", data);
            
            // Обработка на получените URL-и и попълване на полетата
            data.forEach((item, index) => {
                const urlFieldId = index === 0 ? 'genlo' : index === 1 ? 'genlt' : 'genltr';
                const urlField = document.getElementById(urlFieldId);

                if (urlField) {
                    // Настройка на краткия URL като линк в полето
                    urlField.value = item.short_url;
                    urlField.style.color = "blue";
                    urlField.style.textDecoration = "underline";
                    urlField.style.cursor = "pointer";

                    // Добавяне на обработчик за пренасочване към дългия URL при клик
                    urlField.addEventListener("click", () => {
                        window.open(item.long_url, "_blank"); // Отваряне на дългия URL в нов раздел
                    });
                } else {
                    console.error(`Полето с ID ${urlFieldId} не съществува`);
                }
            });
        })
        .catch(error => {
            console.error('Грешка при зареждането на URL-ите:', error);
            alert('Грешка при зареждането на URL-ите. Моля, опитайте отново по-късно.');
        });
});

// JavaScript за зареждане на URL-ите и редактиране на краткия URL
document.addEventListener("DOMContentLoaded", function () {
    console.log("Скриптът се стартира и чака данни от сървъра");

    // Изпращане на заявка към сървъра за последните 3 кратки URL-а
    fetch('http://localhost:3000/api/get-short-urls')
        .then(response => {
            if (!response.ok) {
                throw new Error("Грешка при връзката със сървъра: " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("Данни получени от API:", data);

            // Обработка на получените URL-и и попълване на полетата
            data.forEach((item, index) => {
                const urlFieldId = index === 0 ? 'genlo' : index === 1 ? 'genlt' : 'genltr';
                const buttonId = index === 0 ? 'genlon' : index === 1 ? 'genltu' : 'genltree';
                const urlField = document.getElementById(urlFieldId);
                const editButton = document.getElementById(buttonId);

                // Настройка на краткия URL като линк в полето
                urlField.value = item.short_url;
                urlField.dataset.longUrl = item.long_url; // Запазване на дългия URL в data атрибут
                urlField.readOnly = true; // Полето е само за четене по подразбиране

                // Обработчик за "edit" бутона
                editButton.addEventListener("click", function () {
                    if (editButton.classList.contains("edit-btn")) {
                        // Промяна на полето за редактиране и бутон за запазване
                        urlField.readOnly = false;
                        urlField.focus();
                        editButton.classList.remove("edit-btn");
                        editButton.classList.add("save-btn");
                        editButton.innerHTML = '<i class="fa fa-save btn-icon"></i>'; // Промяна на иконата

                        // Обработчик за промяна на полето (за активиране на save бутона при промяна)
                        urlField.addEventListener("input", function () {
                            editButton.classList.add("save-btn-active"); // Показване, че бутонът е активен за запазване
                        });
                    } else if (editButton.classList.contains("save-btn")) {
                        // Запазване на промените
                        const newShortUrl = urlField.value.trim();
                        const longUrl = urlField.dataset.longUrl;

                        // Изпращане на заявка за обновяване на URL-а в базата данни
                        fetch('http://localhost:3000/api/update-url', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ longUrl, shortUrl: newShortUrl })
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.error) {
                                alert('Грешка при запазване на промените: ' + data.error);
                            } else {
                                alert('Промените бяха успешно запазени!');
                            }

                            // Връщане на полето в режим само за четене и смяна на бутона на "edit"
                            urlField.readOnly = true;
                            editButton.classList.remove("save-btn", "save-btn-active");
                            editButton.classList.add("edit-btn");
                            editButton.innerHTML = '<i class="fa fa-edit btn-icon"></i>'; // Връщане на иконата за редактиране
                        })
                        .catch(error => {
                            console.error('Грешка при обновяване на URL-а:', error);
                            alert('Възникна грешка при запазване на промените.');
                        });
                    }
                });
            });
        })
        .catch(error => {
            console.error('Грешка при зареждането на URL-ите:', error);
            alert('Грешка при зареждането на URL-ите. Моля, опитайте отново по-късно.');
        });
});

// Примерен код за изпращане на заявка към /api/update-url
fetch('http://localhost:3000/api/update-url', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ longUrl, shortUrl: newShortUrl })
})
.then(response => response.json())
.then(data => {
    if (data.error) {
        alert('Грешка при запазване на промените: ' + data.error);
    } else {
        alert('Промените бяха успешно запазени!');
    }
})
.catch(error => {
    console.error('Грешка при обновяване на URL-а:', error);
    alert('Възникна грешка при запазване на промените.');
});

