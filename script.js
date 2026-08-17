// ==========================================
// HUSSAINA BIRTHDAY WEBSITE
// JavaScript - Version 1
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // ELEMENTS
    // ==========================================

    const openStoryButton = document.getElementById("openStory");
    const mainContent = document.getElementById("mainContent");

    const musicButton = document.getElementById("musicButton");
    const backgroundMusic = document.getElementById("backgroundMusic");


    // ==========================================
    // INITIAL STATE
    // ==========================================

    mainContent.style.display = "none";


    // ==========================================
    // OPEN STORY
    // ==========================================

    if (openStoryButton) {

        openStoryButton.addEventListener("click", () => {

            // Hide hero smoothly
            const hero = document.querySelector(".hero");

            hero.style.transition = "opacity 1s ease, transform 1s ease";
            hero.style.opacity = "0";
            hero.style.transform = "scale(1.05)";

            setTimeout(() => {

                hero.style.display = "none";

                // Show main content
                mainContent.style.display = "block";

                mainContent.style.opacity = "0";

                requestAnimationFrame(() => {

                    mainContent.style.transition = "opacity 1.2s ease";

                    mainContent.style.opacity = "1";

                });

                // Scroll to beginning
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }, 900);


            // Try to start music
            playMusic();

        });

    }


    // ==========================================
    // MUSIC SYSTEM
    // ==========================================

    let musicPlaying = false;


    function playMusic() {

        if (!backgroundMusic) return;

        backgroundMusic.volume = 0.35;

        const playPromise = backgroundMusic.play();

        if (playPromise !== undefined) {

            playPromise
                .then(() => {

                    musicPlaying = true;

                    updateMusicButton();

                })
                .catch(() => {

                    // Browser may block autoplay.
                    // User can press the music button.

                    musicPlaying = false;

                    updateMusicButton();

                });

        }

    }


    function pauseMusic() {

        if (!backgroundMusic) return;

        backgroundMusic.pause();

        musicPlaying = false;

        updateMusicButton();

    }


    function updateMusicButton() {

        if (!musicButton) return;

        if (musicPlaying) {

            musicButton.innerHTML = "🔊";

            musicButton.setAttribute(
                "aria-label",
                "Pause music"
            );

            musicButton.title = "Pause music";

        } else {

            musicButton.innerHTML = "🎵";

            musicButton.setAttribute(
                "aria-label",
                "Play music"
            );

            musicButton.title = "Play music";

        }

    }


    if (musicButton) {

        musicButton.addEventListener("click", () => {

            if (musicPlaying) {

                pauseMusic();

            } else {

                playMusic();

            }

        });

    }


    // ==========================================
    // SCROLL REVEAL ANIMATION
    // ==========================================

    const animatedElements = document.querySelectorAll(
        ".story-card, " +
        ".quote-card, " +
        ".quality-card, " +
        ".special-message, " +
        ".eyes-card, " +
        ".meaning-card, " +
        ".prayer-card, " +
        ".final-card, " +
        ".photo-card"
    );


    animatedElements.forEach((element) => {

        element.style.opacity = "0";

        element.style.transform = "translateY(35px)";

        element.style.transition =
            "opacity 0.8s ease, transform 0.8s ease";

    });


    const revealObserver = new IntersectionObserver(

        (entries, observer) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) return;

                entry.target.style.opacity = "1";

                entry.target.style.transform =
                    "translateY(0)";

                observer.unobserve(entry.target);

            });

        },

        {
            threshold: 0.12
        }

    );


    animatedElements.forEach((element) => {

        revealObserver.observe(element);

    });


    // ==========================================
    // FLOATING HEARTS
    // ==========================================

    function createHeart() {

        const heart = document.createElement("div");

        heart.innerHTML = "❤";

        heart.style.position = "fixed";

        heart.style.left =
            Math.random() * 100 + "vw";

        heart.style.bottom = "-30px";

        heart.style.fontSize =
            (12 + Math.random() * 18) + "px";

        heart.style.opacity =
            (0.15 + Math.random() * 0.45).toString();

        heart.style.pointerEvents = "none";

        heart.style.zIndex = "999";

        heart.style.transition =
            "transform 6s linear, opacity 6s linear";

        document.body.appendChild(heart);


        requestAnimationFrame(() => {

            heart.style.transform =
                `translateY(-${window.innerHeight + 100}px) rotate(${Math.random() * 90 - 45}deg)`;

            heart.style.opacity = "0";

        });


        setTimeout(() => {

            heart.remove();

        }, 6500);

    }


    // Create hearts occasionally
    setInterval(() => {

        // Only create hearts after story is opened
        if (mainContent.style.display !== "none") {

            createHeart();

        }

    }, 1800);


    // ==========================================
    // CLICK HEART EFFECT
    // ==========================================

    document.addEventListener("click", (event) => {

        // Don't create click hearts from the music button
        if (
            event.target === musicButton ||
            event.target === openStoryButton
        ) {
            return;
        }


        const heart = document.createElement("div");

        heart.innerHTML = "❤";

        heart.style.position = "fixed";

        heart.style.left = event.clientX + "px";

        heart.style.top = event.clientY + "px";

        heart.style.fontSize = "18px";

        heart.style.pointerEvents = "none";

        heart.style.zIndex = "2000";

        heart.style.transform = "translate(-50%, -50%)";

        heart.style.transition =
            "transform 0.9s ease, opacity 0.9s ease";


        document.body.appendChild(heart);


        requestAnimationFrame(() => {

            heart.style.transform =
                "translate(-50%, -120px) scale(1.5)";

            heart.style.opacity = "0";

        });


        setTimeout(() => {

            heart.remove();

        }, 1000);

    });


    // ==========================================
    // IMAGE ERROR HANDLING
    // ==========================================

    const images = document.querySelectorAll("img");


    images.forEach((image) => {

        image.addEventListener("error", () => {

            image.style.display = "none";

            const parent = image.parentElement;

            if (parent) {

                parent.style.background =
                    "linear-gradient(135deg, #f3dce5, #fff5f8)";

                parent.style.display = "flex";

                parent.style.alignItems = "center";

                parent.style.justifyContent = "center";

                parent.innerHTML =
                    '<span style="font-size:40px;">❤️</span>';

            }

        });

    });


    // ==========================================
    // PAGE VISIBILITY
    // ==========================================

    document.addEventListener(
        "visibilitychange",
        () => {

            if (document.hidden) {

                if (musicPlaying) {

                    backgroundMusic.pause();

                }

            } else {

                if (musicPlaying) {

                    backgroundMusic.play().catch(() => {});

                }

            }

        }
    );


    // ==========================================
    // PREVENT MUSIC FROM BEING TOO LOUD
    // ==========================================

    if (backgroundMusic) {

        backgroundMusic.volume = 0.35;

    }


    // ==========================================
    // CONSOLE MESSAGE
    // ==========================================

    console.log(
        "❤️ Hussaina Birthday Website loaded successfully."
    );

});