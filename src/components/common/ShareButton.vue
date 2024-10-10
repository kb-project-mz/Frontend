<script setup>
function copyURL() {
    navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("URL이 복사되었습니다!"))
        .catch(() => alert("복사에 실패했습니다. 다시 시도해주세요."));
}

function shareURL() {
    if (navigator.share) {
        navigator
            .share({
                title: document.title,
                url: window.location.href,
            })
            .then(() => console.log("공유 성공"))
            .catch((err) => console.log("공유 실패:", err));
    } else {
        alert("공유 기능이 지원되지 않는 브라우저입니다.");
    }
}
</script>
<template>
    <div class="flex justify-center gap-4 mt-4 w-[300px]">
        <button class="bg-green-500 text-white font-bold py-2 px-4 rounded w-full"><font-awesome-icon icon="fa-regular fa-copy" /> 링크 복사</button>
        <button class="bg-green-500 text-white font-bold py-2 px-4 rounded w-full"><font-awesome-icon icon="fa-solid fa-share-nodes" /> 링크 공유</button>
    </div>
</template>

<style scoped>
button {
    margin: 5px;
    padding: 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #45a049;
}

@font-face {
    font-family: "GongGothicMedium";
    src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_20-10@1.0/GongGothicMedium.woff") format("woff");
    font-weight: normal;
    font-style: normal;
}

.gong-gothic-font {
    font-family: "GongGothicMedium", sans-serif;
}
</style>
