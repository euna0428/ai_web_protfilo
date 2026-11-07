(function () {
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    const MAX_FILE_COUNT = 5;

    const form = document.querySelector(".board-form");
    const photoInput = document.getElementById("photos");
    const previewArea = document.getElementById("previewArea");
    const content = document.getElementById("content");
    const contentCount = document.getElementById("contentCount");

    function formatMB(size) {
        return Math.round((size / 1024 / 1024) * 10) / 10;
    }

    function validateFiles(files) {
        if (!files || files.length === 0) {
            return true;
        }

        if (files.length > MAX_FILE_COUNT) {
            alert("이미지는 최대 " + MAX_FILE_COUNT + "장까지 업로드할 수 있습니다.");
            return false;
        }

        for (const file of files) {
            if (!file.type || !file.type.startsWith("image/")) {
                alert("이미지 파일만 업로드할 수 있습니다.");
                return false;
            }

            if (file.size > MAX_FILE_SIZE) {
                alert(
                    "이미지는 1장당 10MB 이하로 업로드해 주세요.\n\n" +
                    "선택한 파일: " + file.name + "\n" +
                    "현재 용량: " + formatMB(file.size) + "MB"
                );
                return false;
            }
        }

        return true;
    }

    function renderPreview(files) {
        if (!previewArea) {
            return;
        }

        previewArea.innerHTML = "";

        files.forEach(function (file) {
            if (!file.type || !file.type.startsWith("image/")) {
                return;
            }

            const reader = new FileReader();

            reader.onload = function (event) {
                const item = document.createElement("div");
                item.className = "jm-preview-item";

                const img = document.createElement("img");
                img.src = event.target.result;
                img.alt = file.name;

                item.appendChild(img);
                previewArea.appendChild(item);
            };

            reader.readAsDataURL(file);
        });
    }

    if (photoInput && previewArea) {
        photoInput.addEventListener("change", function () {
            const files = Array.from(photoInput.files || []);

            if (!validateFiles(files)) {
                photoInput.value = "";
                previewArea.innerHTML = "";
                return;
            }

            renderPreview(files);
        });
    }

    if (form) {
        form.addEventListener("submit", function (event) {
            const files = Array.from(photoInput ? photoInput.files || [] : []);

            if (!validateFiles(files)) {
                event.preventDefault();
            }
        });
    }

    if (content && contentCount) {
        function updateCount() {
            contentCount.textContent = String((content.value || "").length);
        }

        content.addEventListener("input", updateCount);
        updateCount();
    }
})();