

document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".carousel-track");
    const images = Array.from(track.children);
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");

    let index = 0;
    const total = images.length;
    let imageWidth = images[0].offsetWidth + 20; // inclui gap
    let position = 0;
    let interval;

    // Clonar imagens para loop infinito
    images.forEach(img => {
        const clone = img.cloneNode(true);
        track.appendChild(clone);
    });

    const moveCarousel = () => {
        position += imageWidth;
        track.style.transition = "transform 0.5s ease-in-out";
        track.style.transform = `translateX(-${position}px)`;

        index++;
        if (index >= total) {
            setTimeout(() => {
                track.style.transition = "none";
                position = 0;
                track.style.transform = `translateX(0px)`;
                index = 0;
            }, 500);
        }
    };

    const moveToPrev = () => {
        if (index === 0) {
            index = total;
            position = imageWidth * total;
            track.style.transition = "none";
            track.style.transform = `translateX(-${position}px)`;
            setTimeout(() => {
                index--;
                position -= imageWidth;
                track.style.transition = "transform 0.5s ease-in-out";
                track.style.transform = `translateX(-${position}px)`;
            }, 10);
        } else {
            index--;
            position -= imageWidth;
            track.style.transition = "transform 0.5s ease-in-out";
            track.style.transform = `translateX(-${position}px)`;
        }
    };

    const moveToNext = () => {
        moveCarousel();
    };

    // Botões
    nextBtn.addEventListener("click", moveToNext);
    prevBtn.addEventListener("click", moveToPrev);

    // Auto-play com pausa ao hover
    const startAutoPlay = () => {
        interval = setInterval(moveCarousel, 3000);
    };

    const stopAutoPlay = () => {
        clearInterval(interval);
    };

    track.addEventListener("mouseenter", stopAutoPlay);
    track.addEventListener("mouseleave", startAutoPlay);

    startAutoPlay();

    // Swipe para mobile
    let startX = 0;
    let endX = 0;

    track.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });

    track.addEventListener("touchmove", (e) => {
        endX = e.touches[0].clientX;
    });

    track.addEventListener("touchend", () => {
        if (startX - endX > 50) {
            moveToNext();
        } else if (endX - startX > 50) {
            moveToPrev();
        }
        startX = 0;
        endX = 0;
    });
});








//////////////////////////////////////////////////////////////////


// Função para abrir o modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

// Função para fechar o modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Fechar modal ao clicar fora dele ou pressionar Esc
document.addEventListener("click", (event) => {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        const modals = document.querySelectorAll(".modal");
        modals.forEach((modal) => {
            modal.style.display = "none";
        });
    }
});


/////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("agendarConsulta");
    const rodape = document.getElementById("rodape");

    // Função para verificar se o botão está sobre o rodapé
    const checkIntersection = () => {
        const rodapeRect = rodape.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();

        // Verifica se o botão está sobre o rodapé
        if (
            buttonRect.bottom > rodapeRect.top &&
            buttonRect.top < rodapeRect.bottom
        ) {
            button.style.backgroundColor = "white";
            button.style.color = "#103440"; // Cor do texto no rodapé
        } else {
            button.style.backgroundColor = "#103440"; // Cor padrão
            button.style.color = "white"; // Cor do texto padrão
        }
    };

    // Adiciona um evento de rolagem para verificar a posição
    window.addEventListener("scroll", checkIntersection);
});



////////////////////////////////
let slideAtual = 0;
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicators span');

function mostrarSlide(n) {
  slideAtual = (n + slides.length) % slides.length;
  document.querySelector('.slides').style.transform = `translateX(-${slideAtual * 100}%)`;
  indicators.forEach((el, i) => el.classList.toggle('active', i === slideAtual));
}

function mudarSlide(n) {
  mostrarSlide(slideAtual + n);
}

function irParaSlide(n) {
  mostrarSlide(n);
}

mostrarSlide(0);



////////////////////////////////////////////////////////////////


const hamburger = document.querySelector(".hamburger");
const nav = document.querySelector(".nav");
nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        nav.classList.remove("active");
    });
});

hamburger.addEventListener("click", () => nav.classList.toggle("active"));


