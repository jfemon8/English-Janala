function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({
        behavior: "smooth"
    });
}

addLoader = () => {
    document.getElementById("loader").classList.remove("hidden");
    document.getElementById("word_container").classList.add("hidden");
}

removeLoader = () => {
    document.getElementById("loader").classList.add("hidden");
    document.getElementById("word_container").classList.remove("hidden");
}

fetch("https://openapi.programming-hero.com/api/levels/all")
    .then(response => response.json())
    .then(data => {
        showLessons(data.data);
    })

showLessons = (lessons) => {
    const lessonButtons = document.getElementById("lessons");
    lessons.forEach(lesson => {
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-outline', 'btn-primary');
        button.innerHTML = `
        <img src="assets/fa-book-open.png" alt="Book" />Lesson-${lesson.level_no}
        `
        button.addEventListener('click', function () {
            const activeButtons = document.getElementsByClassName("active");
            for (const btn of activeButtons) {
                btn.classList.remove("active");
            }
            button.classList.add("active");
            loadWords(lesson.level_no);
        });

        lessonButtons.appendChild(button);
    });
}

loadWords = (id) => {
    addLoader();
    const url = "https://openapi.programming-hero.com/api/level/" + id;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            viewWords(data.data);
        })
    removeLoader();
}

viewWords = (words) => {
    const wordContainer = document.getElementById("word_container");
    wordContainer.innerHTML = "";
    if (words.length === 0) {
        wordContainer.innerHTML = `
            <div class="col-span-3 flex flex-col items-center font-bn">
                <img src="assets/alert-error.png" alt="Alert">
                <p class="mt-4 text-[#79716B] text-sm">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h1 class="mt-4 text-4xl font-medium text-[#292524]">নেক্সট Lesson এ যান</h1>
            </div>
        `
        return;
    }
    words.forEach(word => {
        const wordCard = `
            <div class="bg-white rounded-lg p-14">
              <h1 class="text-3xl font-bold">${word.word}</h1>
              <p class="mt-6 text-xl font-medium">Meaning / Pronunciation</p>
              <h1 class="mt-6 text-3xl font-semibold font-bn">
                "${word.meaning === null ? `অর্থ নেই` : `${word.meaning}`} / ${word.pronunciation}"
              </h1>
              <div class="mt-14 flex justify-between items-center">
                <div onclick = "loadWordDetails(${word.id})" class="p-4 bg-[#1A91FF1A] rounded-lg cursor-pointer hover:bg-blue-300">
                  <i class="fa-solid fa-circle-info"></i>
                </div>
                <div onclick = "pronounceWord('${word.word}')" class="p-4 bg-[#1A91FF1A] rounded-lg cursor-pointer hover:bg-blue-300">
                  <i class="fa-solid fa-volume-low"></i>
                </div>
              </div>
            </div>
        `
        wordContainer.innerHTML += wordCard;
    });
}

loadWordDetails = (id) => {
    const url = "https://openapi.programming-hero.com/api/word/" + id;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            viewWordDetails(data.data);
        })
}

viewWordDetails = (word) => {
    const modal = document.getElementById("modal_container");
    let synonymButtons = "";
    word.synonyms.forEach(synonym => {
        synonymButtons += `<button class="btn bg-[#EDF7FF] border border-[#D7E4EF] text-black text-xl cursor-default">${synonym}</button>`
    });
    modal.innerHTML = `
              <h1 class="font-semibold text-4xl">
                ${word.word} (<i class="fa-solid fa-microphone-lines"></i> : ${word.pronunciation})
              </h1>
              <p class="mt-8 font-semibold text-2xl">Meaning</p>
              <p class="mt-3 font-medium text-2xl font-bn">${word.meaning === null ? `অর্থ পাওয়া যায় নি` : `${word.meaning}`}</p>
              <p class="mt-8 font-semibold text-2xl">Example</p>
              <p class="mt-2 text-2xl">
                ${word.sentence}
              </p>
              <p class="mt-8 font-medium text-2xl">সমার্থক শব্দ গুলো</p>
              <div class="mt-3 flex flex-wrap gap-4 items-center">
                ${synonymButtons}
              </div>
    `
    document.getElementById("word_modal").showModal();
}

document.getElementById("login-btn").addEventListener("click", function (event) {
    const username = document.getElementById("username").value;
    if (username === "") {
        Swal.fire({
            title: "Invalid username!",
            text: "Please enter a valid username!",
            icon: "error"
        });
    }
    else {
        const password = document.getElementById("password").value;
        if (password === '123456') {
            document.getElementById("navbar").classList.remove("hidden");
            document.getElementById("banner").classList.add("hidden");
            document.getElementById("vocabulary").classList.remove("hidden");
            document.getElementById("faq").classList.remove("hidden");
            Swal.fire({
                title: "Welcome!",
                text: "Successfully logged in!",
                icon: "success"
            });
        }
        else {
            Swal.fire({
                title: "Wrong Password!",
                text: "Please enter correct password!",
                icon: "warning"
            });
        }
    }
});


document.getElementById("logout-btn").addEventListener("click", function (event) {
    document.getElementById("navbar").classList.add("hidden");
    document.getElementById("banner").classList.remove("hidden");
    document.getElementById("vocabulary").classList.add("hidden");
    document.getElementById("faq").classList.add("hidden");
});

function pronounceWord(word) {
    console.log(word);
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-EN';
    window.speechSynthesis.speak(utterance);
}