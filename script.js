const API_URL = "https://inai-col1.fishrungames.com/ads";
const API_BASE = "https://inai-col1.fishrungames.com";

const form = document.getElementById("adForm");
const adsList = document.getElementById("adsList");
const total = document.getElementById("total");
const message = document.getElementById("message");

async function loadAds() {
    adsList.innerHTML = `
        <div class="loading">
            Загрузка объявлений...
        </div>
    `;

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Ошибка сервера");
        }

        const data = await response.json();

        total.textContent = `Всего объявлений: ${data.total}`;
        adsList.innerHTML = "";

        if (!data.items || data.items.length === 0) {
            adsList.innerHTML = `
                <div class="empty">
                    Объявлений пока нет
                </div>
            `;
            return;
        }

        data.items.forEach(ad => {
            let image;

            if (ad.image_url) {
                image = `
                    <img
                        src="${API_BASE}${ad.image_url}"
                        class="ad-image"
                        alt="${ad.title}"
                    >
                `;
            } else {
                image = `
                    <div class="image-placeholder">
                        Нет фотографии
                    </div>
                `;
            }

            adsList.innerHTML += `
                <article class="ad-card">

                    <div class="image-wrapper">
                        ${image}
                    </div>

                    <div class="ad-content">

                        <div class="ad-top">
                            <span class="ad-id">№ ${ad.id}</span>
                        </div>

                        <h3>${ad.title}</h3>

                        <p>${ad.description}</p>

                        <div class="ad-bottom">
                            <strong>
                                ${Number(ad.price).toLocaleString("ru-RU")} сом
                            </strong>
                        </div>

                    </div>

                </article>
            `;
        });

    } catch (error) {
        adsList.innerHTML = `
            <div class="error">
                Не удалось загрузить объявления
            </div>
        `;
    }
}

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const price = document.getElementById("price").value;
    const image = document.getElementById("image").files[0];

    if (!image) {
        message.innerHTML = `
            <div class="message error-message">
                Выберите изображение
            </div>
        `;
        return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);

    message.innerHTML = `
        <div class="message loading-message">
            Публикация...
        </div>
    `;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Ошибка отправки");
        }

        await response.json();

        form.reset();

        message.innerHTML = `
            <div class="message success-message">
                Объявление успешно опубликовано
            </div>
        `;

        await loadAds();

    } catch (error) {
        message.innerHTML = `
            <div class="message error-message">
                Не удалось опубликовать объявление
            </div>
        `;
    }
});

loadAds();