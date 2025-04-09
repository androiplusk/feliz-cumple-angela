document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcome-screen');
    const birthdayScreen = document.getElementById('birthday-screen');
    const startButton = document.getElementById('start-button');
    const blowButton = document.getElementById('blow-candle');
    const balloonsContainer = document.getElementById('balloons-container');
    const blowSound = document.getElementById('blow-sound');
    const confettiSound = document.getElementById('confetti-sound');
    const cakeContainer = document.querySelector('.cake-container');
    const candle = document.querySelector('.candle');
    const envelopeContainer = document.querySelector('.envelope-container');
    const envelope = document.querySelector('.envelope');
    const envelopeMessage = document.querySelector('.envelope-message');
    const messageLines = document.querySelectorAll('.message-line');
    const tapToContinue = document.querySelector('.tap-to-continue');
    let currentMessageIndex = 0;
    let balloonInterval;

    // Función para scroll suave
    function scrollToElement(element) {
        const offset = 50;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    // Función para crear efecto de escritura
    function createTypingEffect(element, text, delay = 50) {
        element.classList.add('typing-text');
        element.textContent = '';
        element.classList.add('start');
        
        const chars = text.split('');
        let html = '';
        chars.forEach((char) => {
            html += `<span>${char}</span>`;
        });
        element.innerHTML = html;

        const spans = element.querySelectorAll('span');
        spans.forEach((span, index) => {
            span.style.animationDelay = `${index * delay}ms`;
        });
    }

    // Crear globos
    function createBalloon() {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.left = Math.random() * 100 + 'vw';
        const colors = ['#ff4081', '#7c4dff', '#00bcd4', '#ffd700', '#ff6b6b', '#4caf50'];
        balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.setProperty('--random-offset', (Math.random() * 360) + 'deg');
        balloon.style.animationDuration = (8 + Math.random() * 4) + 's';
        balloonsContainer.appendChild(balloon);

        balloon.addEventListener('animationend', () => {
            balloon.remove();
        });
    }

    // Iniciar la celebración
    startButton.addEventListener('click', () => {
        welcomeScreen.classList.remove('active');
        birthdayScreen.classList.add('active');
        
        // Iniciar globos
        balloonInterval = setInterval(createBalloon, 800);

        // Mostrar la torta después de un momento
        setTimeout(() => {
            cakeContainer.style.opacity = '1';
        }, 2000);

        // Agregar efecto de escritura al mensaje inicial
        const birthdayQuote = document.querySelector('.birthday-quote');
        createTypingEffect(birthdayQuote, birthdayQuote.textContent);

        // Asegurar que la página sea scrolleable si es necesario
        document.body.style.overflowY = 'auto';
    });

    // Efecto al soplar la vela
    blowButton.addEventListener('click', () => {
        // Reproducir sonido de soplar
        blowSound.play();
        
        // Reproducir sonido de confeti inmediatamente después
        setTimeout(() => {
            confettiSound.play();
        }, 300);

        // Apagar la vela
        candle.classList.add('blown');

        // Detener la creación de globos
        clearInterval(balloonInterval);

        // Hacer que los globos existentes desaparezcan gradualmente
        const existingBalloons = document.querySelectorAll('.balloon');
        existingBalloons.forEach((balloon, index) => {
            setTimeout(() => {
                balloon.style.transition = 'all 1s ease';
                balloon.style.opacity = '0';
                balloon.style.transform = 'translateY(-100vh) scale(0)';
                setTimeout(() => balloon.remove(), 1000);
            }, index * 100);
        });

        // Ocultar el botón y agregar nuevo mensaje
        blowButton.style.display = 'none';
        const newMessage = document.createElement('p');
        newMessage.className = 'birthday-quote typing-text';
        cakeContainer.appendChild(newMessage);
        createTypingEffect(newMessage, '¡Felicidades, Angela! Has cumplido un año más de vida, y me alegra muchísimo por ti. Estoy muy feliz de poder celebrarlo contigo, aunque sea con este pequeño detalle.');

        // Mostrar el sobre después de un momento
        setTimeout(() => {
            envelopeContainer.style.display = 'block';
            setTimeout(() => {
                envelopeContainer.classList.add('show');
                // Scroll suave hasta el sobre
                scrollToElement(envelopeContainer);
            }, 100);
        }, 3500);

        // Confeti
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            }));
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            }));
        }, 250);
    });

    // Manejar el sobre y el mensaje
    envelope.addEventListener('click', () => {
        envelope.classList.add('open');
        envelopeMessage.style.display = 'block';
        
        // Cambiar el fondo suavemente
        document.body.classList.add('envelope-open');
        
        // Scroll suave hasta el mensaje
        setTimeout(() => {
            scrollToElement(envelopeMessage);
            tapToContinue.classList.add('visible');
            messageLines[currentMessageIndex].classList.add('visible');
            currentMessageIndex++;
        }, 1000);
    });

    // Manejar los toques para revelar el mensaje
    envelopeMessage.addEventListener('click', () => {
        if (currentMessageIndex < messageLines.length) {
            messageLines[currentMessageIndex].classList.add('visible');
            currentMessageIndex++;
            
            // Ocultar la instrucción después del primer toque
            if (currentMessageIndex > 1) {
                tapToContinue.style.opacity = '0';
            }

            // Mostrar la firma después del último mensaje
            if (currentMessageIndex === messageLines.length) {
                setTimeout(() => {
                    document.querySelector('.signature').classList.add('visible');
                }, 500);
            }
        }
    });
});
