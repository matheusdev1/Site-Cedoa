// Aguarda o DOM carregar completamente antes de executar o código
document.addEventListener("DOMContentLoaded", () => {
    // Inicializar componentes
    initCarousel();
    initModals();
    initNavigation();
    initImageCarousel();
    initImageCarouselEstrutura(); // ADICIONE ESTA LINHA
    initSlider();
    initEquipmentCards();
    initScrollEffects();
});

// ===== CARROSSEL DE CONVÊNIOS =====
function initCarousel() {
    const track = document.querySelector(".carousel-track");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    
    if (!track || !prevBtn || !nextBtn) return;
    
    const images = Array.from(track.children);
    if (images.length === 0) return;
    
    let index = 0;
    const total = images.length;
    let imageWidth = 0;
    let position = 0;
    let interval;
    let isAnimating = false;

    // Função para calcular largura da imagem
    function calculateImageWidth() {
        if (images[0]) {
            const computedStyle = window.getComputedStyle(images[0]);
            const margin = parseFloat(computedStyle.marginRight) || 0;
            imageWidth = images[0].offsetWidth + margin + 20; // 20px = gap
        }
    }

    // Clonar imagens para loop infinito
    function cloneImages() {
        const clonedImages = images.map(img => img.cloneNode(true));
        clonedImages.forEach(clone => track.appendChild(clone));
    }

    // Mover carrossel para frente
    function moveNext() {
        if (isAnimating) return;
        isAnimating = true;
        
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
                isAnimating = false;
            }, 500);
        } else {
            setTimeout(() => { isAnimating = false; }, 500);
        }
    }

    // Mover carrossel para trás
    function movePrev() {
        if (isAnimating) return;
        isAnimating = true;
        
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
                setTimeout(() => { isAnimating = false; }, 500);
            }, 10);
        } else {
            index--;
            position -= imageWidth;
            track.style.transition = "transform 0.5s ease-in-out";
            track.style.transform = `translateX(-${position}px)`;
            setTimeout(() => { isAnimating = false; }, 500);
        }
    }

    // Auto-play
    function startAutoPlay() {
        interval = setInterval(moveNext, 3000);
    }

    function stopAutoPlay() {
        clearInterval(interval);
    }

    // Inicializar carrossel
    function setupCarousel() {
        calculateImageWidth();
        cloneImages();
        startAutoPlay();
    }

    // Event listeners
    nextBtn.addEventListener("click", () => {
        stopAutoPlay();
        moveNext();
        startAutoPlay();
    });

    prevBtn.addEventListener("click", () => {
        stopAutoPlay();
        movePrev();
        startAutoPlay();
    });

    // Pausar auto-play no hover
    track.addEventListener("mouseenter", stopAutoPlay);
    track.addEventListener("mouseleave", startAutoPlay);

    // Touch/Swipe support para mobile
    let startX = 0;
    let endX = 0;
    let isSwiping = false;

    track.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        isSwiping = true;
        stopAutoPlay();
    }, { passive: true });

    track.addEventListener("touchmove", (e) => {
        if (!isSwiping) return;
        endX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener("touchend", () => {
        if (!isSwiping) return;
        
        const swipeThreshold = 50;
        const swipeDistance = startX - endX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                moveNext();
            } else {
                movePrev();
            }
        }
        
        isSwiping = false;
        startAutoPlay();
    }, { passive: true });

    // Reajustar no resize
    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            stopAutoPlay();
            calculateImageWidth();
            position = index * imageWidth;
            track.style.transition = "none";
            track.style.transform = `translateX(-${position}px)`;
            setTimeout(() => {
                startAutoPlay();
            }, 100);
        }, 250);
    });

    // Inicializar
    setupCarousel();
}

// ===== SISTEMA DE MODAIS =====
function initModals() {
    // Função para abrir modal
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Previne scroll do body
            
            // Foco no modal para acessibilidade
            const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                setTimeout(() => firstFocusable.focus(), 100);
            }
        }
    };

    // Função para fechar modal
    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Restaura scroll do body
        }
    };

    // Event listeners para fechar modais
    document.addEventListener("click", (event) => {
        // Fechar ao clicar fora do modal
        if (event.target.classList.contains("modal")) {
            event.target.style.display = "none";
            document.body.style.overflow = '';
        }
        
        // Fechar ao clicar no botão close
        if (event.target.classList.contains("close")) {
            const modal = event.target.closest(".modal");
            if (modal) {
                modal.style.display = "none";
                document.body.style.overflow = '';
            }
        }
    });

    // Fechar modal com tecla ESC
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            const openModals = document.querySelectorAll(".modal[style*='block']");
            openModals.forEach(modal => {
                modal.style.display = "none";
                document.body.style.overflow = '';
            });
        }
    });
}

// ===== NAVEGAÇÃO MOBILE =====
function initNavigation() {
    const hamburger = document.querySelector(".hamburger");
    const nav = document.querySelector(".nav");
    const navLinks = nav.querySelectorAll("a");

    if (!hamburger || !nav) return;

    // Toggle menu mobile
    hamburger.addEventListener("click", (e) => {
        e.preventDefault();
        nav.classList.toggle("active");
        
        // Acessibilidade
        const isOpen = nav.classList.contains("active");
        hamburger.setAttribute("aria-expanded", isOpen);
    });

    // Fechar menu ao clicar nos links
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("active");
            hamburger.setAttribute("aria-expanded", "false");
        });
    });

    // Fechar menu ao clicar fora
    document.addEventListener("click", (e) => {
        if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
            nav.classList.remove("active");
            hamburger.setAttribute("aria-expanded", "false");
        }
    });

    // Smooth scroll para links âncora
    navLinks.forEach(link => {
        if (link.getAttribute("href").startsWith("#")) {
            link.addEventListener("click", (e) => {
                const target = document.querySelector(link.getAttribute("href"));
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: "smooth"
                    });
                }
            });
        }
    });
}

// ===== CARROSSEL DE IMAGENS (Ambiente) =====
function initImageCarousel() {
    const imagens = [
        "Images/Ambientes/retina.jpg",
        "Images/Ambientes/recepcaoar.jpg",
        "Images/Ambientes/recepcao2.jpg",
        "Images/Ambientes/recepcao3.jpg"
    ];
    
    let indiceAtual = 0;
    let isTransitioning = false;

    window.mudarImagem = function(direcao) {
        if (isTransitioning) return;
        
        const img = document.getElementById('imagemCarrossel');
        if (!img) return;
        
        isTransitioning = true;
        img.classList.add('fade-out');
        
        setTimeout(() => {
            indiceAtual += direcao;
            if (indiceAtual < 0) indiceAtual = imagens.length - 1;
            if (indiceAtual >= imagens.length) indiceAtual = 0;
            
            img.src = imagens[indiceAtual];
            img.classList.remove('fade-out');
            img.classList.add('fade-in');
            
            setTimeout(() => {
                img.classList.remove('fade-in');
                isTransitioning = false;
            }, 300);
        }, 300);
    };

    // Auto-play para carrossel de imagens
    let imageInterval = setInterval(() => {
        window.mudarImagem(1);
    }, 5000);

    // Pausar auto-play no hover
    const carrosselContainer = document.querySelector('.carrossel-imagens');
    if (carrosselContainer) {
        carrosselContainer.addEventListener('mouseenter', () => {
            clearInterval(imageInterval);
        });

        carrosselContainer.addEventListener('mouseleave', () => {
            imageInterval = setInterval(() => {
                window.mudarImagem(1);
            }, 5000);
        });
    }
}

// ===== SLIDER DE NOVIDADES =====
function initSlider() {
    let slideAtual = 0;
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicators span');
    
    if (slides.length === 0) return;

    function mostrarSlide(n) {
        slideAtual = (n + slides.length) % slides.length;
        const slidesContainer = document.querySelector('.slides');
        if (slidesContainer) {
            slidesContainer.style.transform = `translateX(-${slideAtual * 100}%)`;
        }
        
        // Atualizar indicadores
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === slideAtual);
        });
    }

    window.mudarSlide = function(n) {
        mostrarSlide(slideAtual + n);
    };

    window.irParaSlide = function(n) {
        mostrarSlide(n);
    };

    // Inicializar
    mostrarSlide(0);

    // Auto-play
    let sliderInterval = setInterval(() => {
        window.mudarSlide(1);
    }, 4000);

    // Pausar no hover
    const slider = document.querySelector('.slider');
    if (slider) {
        slider.addEventListener('mouseenter', () => {
            clearInterval(sliderInterval);
        });

        slider.addEventListener('mouseleave', () => {
            sliderInterval = setInterval(() => {
                window.mudarSlide(1);
            }, 4000);
        });
    }

    // Touch support
    let slideStartX = 0;
    let slideEndX = 0;

    if (slider) {
        slider.addEventListener('touchstart', (e) => {
            slideStartX = e.touches[0].clientX;
            clearInterval(sliderInterval);
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            slideEndX = e.changedTouches[0].clientX;
            const swipeDistance = slideStartX - slideEndX;
            const swipeThreshold = 50;

            if (Math.abs(swipeDistance) > swipeThreshold) {
                if (swipeDistance > 0) {
                    window.mudarSlide(1);
                } else {
                    window.mudarSlide(-1);
                }
            }

            sliderInterval = setInterval(() => {
                window.mudarSlide(1);
            }, 4000);
        }, { passive: true });
    }
}

// ===== CARDS DE EQUIPAMENTOS =====
function initEquipmentCards() {
    const equipmentItems = document.querySelectorAll('.equipamento-item');
    
    equipmentItems.forEach(item => {
        // Touch support para mobile
        item.addEventListener('touchstart', function(e) {
            e.preventDefault();
            
            // Remove flip de outros cards
            equipmentItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('flipped');
                }
            });
            
            // Alterna flip no card tocado
            item.classList.toggle('flipped');
        }, { passive: false });

        // Keyboard support para acessibilidade
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.classList.toggle('flipped');
            }
        });

        // Tornar focável
        if (!item.hasAttribute('tabindex')) {
            item.setAttribute('tabindex', '0');
        }
    });
}

// ===== EFEITOS DE SCROLL =====
function initScrollEffects() {
    // Botão fixo - mudança de cor no rodapé
    const button = document.getElementById("agendarConsulta");
    const rodape = document.getElementById("rodape");

    if (button && rodape) {
        function checkIntersection() {
            const rodapeRect = rodape.getBoundingClientRect();
            const buttonRect = button.getBoundingClientRect();

            // Verifica se o botão está sobre o rodapé
            if (buttonRect.bottom > rodapeRect.top && buttonRect.top < rodapeRect.bottom) {
                button.style.backgroundColor = "white";
                button.style.color = "#103440";
                button.style.boxShadow = "0px 8px 15px rgba(0, 0, 0, 0.2)";
            } else {
                button.style.backgroundColor = "#103440";
                button.style.color = "white";
                button.style.boxShadow = "0px 8px 15px rgba(0, 0, 0, 0.1)";
            }
        }

        // Throttle do scroll para performance
        let scrollTimeout;
        window.addEventListener("scroll", () => {
            if (scrollTimeout) {
                cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = requestAnimationFrame(checkIntersection);
        });

        // Verificar inicialmente
        checkIntersection();
    }

    // Scroll suave para âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== UTILITÁRIOS =====

// Debounce function para eventos que disparam frequentemente
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function para eventos de scroll
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Lazy loading para imagens (opcional)
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Performance: Preload de imagens importantes
function preloadImages() {
    const criticalImages = [
        "Images/Ambientes/retina.jpg",
        "Images/Ambientes/recepcaoar.jpg",
        "Images/Ambientes/recepcao2.jpg",
        "Images/Ambientes/recepcao3.jpg",
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}




// Inicializar preload quando a página carregar
window.addEventListener('load', preloadImages);




// ===== CARROSSEL DE IMAGENS ESTRUTURA =====
function initImageCarouselEstrutura() {
    const imagensEstrutura = [
        "Images/Ambientes/estrutura2.jpg",
        "Images/Ambientes/estrutura3.jpg",
        "Images/Ambientes/estrutura4.jpg",
        // Adicione mais imagens da estrutura aqui conforme necessário
    ];
    
    let indiceAtualEstrutura = 0;
    let isTransitioningEstrutura = false;

    window.mudarImagemEstrutura = function(direcao) {
        if (isTransitioningEstrutura) return;
        
        const img = document.getElementById('imagemCarrosselEstrutura');
        if (!img) return;
        
        isTransitioningEstrutura = true;
        img.classList.add('fade-out');
        
        setTimeout(() => {
            indiceAtualEstrutura += direcao;
            if (indiceAtualEstrutura < 0) indiceAtualEstrutura = imagensEstrutura.length - 1;
            if (indiceAtualEstrutura >= imagensEstrutura.length) indiceAtualEstrutura = 0;
            
            img.src = imagensEstrutura[indiceAtualEstrutura];
            img.classList.remove('fade-out');
            img.classList.add('fade-in');
            
            setTimeout(() => {
                img.classList.remove('fade-in');
                isTransitioningEstrutura = false;
            }, 300);
        }, 300);
    };

    // Auto-play para carrossel de estrutura
    let imageIntervalEstrutura = setInterval(() => {
        window.mudarImagemEstrutura(1);
    }, 5000);

    // Pausar auto-play no hover
    const carrosselContainerEstrutura = document.querySelector('.section-content.equipamentos .carrossel-imagens');
    if (carrosselContainerEstrutura) {
        carrosselContainerEstrutura.addEventListener('mouseenter', () => {
            clearInterval(imageIntervalEstrutura);
        });

        carrosselContainerEstrutura.addEventListener('mouseleave', () => {
            imageIntervalEstrutura = setInterval(() => {
                window.mudarImagemEstrutura(1);
            }, 5000);
        });
    }
}