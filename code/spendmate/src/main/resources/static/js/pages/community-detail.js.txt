(function () {
    const mainPhoto = document.getElementById("mainCommunityPhoto");
    const mainPhotoBox = document.querySelector(".board-main-photo");
    const thumbButtons = Array.from(document.querySelectorAll(".jm-thumb-btn"));
    const countEl = document.querySelector(".jm-photo-count");

    if (!mainPhoto || !mainPhotoBox || thumbButtons.length === 0) {
        return;
    }

    const photoItems = thumbButtons
        .map(function (button) {
            const img = button.querySelector("img");

            if (!img) {
                return null;
            }

            const src = img.getAttribute("data-src") || img.getAttribute("src");

            if (!src) {
                return null;
            }

            return {
                button: button,
                src: src
            };
        })
        .filter(Boolean);

    if (photoItems.length === 0) {
        return;
    }

    let currentIndex = photoItems.findIndex(function (item) {
        return item.button.classList.contains("is-active");
    });

    if (currentIndex < 0) {
        currentIndex = 0;
    }

    function updatePhoto(index) {
        if (index < 0) {
            currentIndex = photoItems.length - 1;
        } else if (index >= photoItems.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }

        const currentItem = photoItems[currentIndex];

        mainPhoto.setAttribute("src", currentItem.src);

        photoItems.forEach(function (item) {
            item.button.classList.remove("is-active");
        });

        currentItem.button.classList.add("is-active");

        if (countEl) {
            countEl.textContent = (currentIndex + 1) + " / " + photoItems.length;
        }
    }

    function createArrowButton(className, label) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "jm-photo-arrow " + className;
        button.setAttribute("aria-label", label);
        button.textContent = className === "jm-photo-prev" ? "‹" : "›";
        return button;
    }

    if (photoItems.length > 1) {
        const prevButton = createArrowButton("jm-photo-prev", "이전 사진 보기");
        const nextButton = createArrowButton("jm-photo-next", "다음 사진 보기");

        prevButton.addEventListener("click", function () {
            updatePhoto(currentIndex - 1);
        });

        nextButton.addEventListener("click", function () {
            updatePhoto(currentIndex + 1);
        });

        mainPhotoBox.appendChild(prevButton);
        mainPhotoBox.appendChild(nextButton);
    }

    thumbButtons.forEach(function (button, index) {
        button.addEventListener("click", function () {
            updatePhoto(index);
        });
    });

    updatePhoto(currentIndex);
})();(function () {
    const mainPhoto = document.getElementById("mainCommunityPhoto");
    const mainPhotoBox = document.querySelector(".board-main-photo");
    const thumbButtons = Array.from(document.querySelectorAll(".jm-thumb-btn"));
    const countEl = document.querySelector(".jm-photo-count");

    if (!mainPhoto || !mainPhotoBox || thumbButtons.length === 0) {
        return;
    }

    const photoItems = thumbButtons
        .map(function (button) {
            const img = button.querySelector("img");

            if (!img) {
                return null;
            }

            const src = img.getAttribute("data-src") || img.getAttribute("src");

            if (!src) {
                return null;
            }

            return {
                button: button,
                src: src
            };
        })
        .filter(Boolean);

    if (photoItems.length === 0) {
        return;
    }

    let currentIndex = photoItems.findIndex(function (item) {
        return item.button.classList.contains("is-active");
    });

    if (currentIndex < 0) {
        currentIndex = 0;
    }

    function updatePhoto(index) {
        if (index < 0) {
            currentIndex = photoItems.length - 1;
        } else if (index >= photoItems.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }

        const currentItem = photoItems[currentIndex];

        mainPhoto.setAttribute("src", currentItem.src);

        photoItems.forEach(function (item) {
            item.button.classList.remove("is-active");
        });

        currentItem.button.classList.add("is-active");

        if (countEl) {
            countEl.textContent = (currentIndex + 1) + " / " + photoItems.length;
        }
    }

    function createArrowButton(className, label) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "jm-photo-arrow " + className;
        button.setAttribute("aria-label", label);
        button.textContent = className === "jm-photo-prev" ? "‹" : "›";
        return button;
    }

    if (photoItems.length > 1) {
        const prevButton = createArrowButton("jm-photo-prev", "이전 사진 보기");
        const nextButton = createArrowButton("jm-photo-next", "다음 사진 보기");

        prevButton.addEventListener("click", function () {
            updatePhoto(currentIndex - 1);
        });

        nextButton.addEventListener("click", function () {
            updatePhoto(currentIndex + 1);
        });

        mainPhotoBox.appendChild(prevButton);
        mainPhotoBox.appendChild(nextButton);
    }

    thumbButtons.forEach(function (button, index) {
        button.addEventListener("click", function () {
            updatePhoto(index);
        });
    });

    updatePhoto(currentIndex);
})();