// Animacja wejścia dla kart projektów
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, i) => {
    card.style.opacity = 0;
    card.style.transform = "translateY(40px)";
    setTimeout(() => {
      card.style.transition = "opacity 0.7s cubic-bezier(.77,0,.18,1), transform 0.7s cubic-bezier(.77,0,.18,1)";
      card.style.opacity = 1;
      card.style.transform = "translateY(0)";
    }, 200 + i * 180);
  });

  // Parallax na nagłówku
  const header = document.querySelector('header h1');
  window.addEventListener('scroll', () => {
    if (header) {
      const scrollY = window.scrollY;
      header.style.transform = `translateY(${scrollY * 0.3}px) scale(${1 + scrollY * 0.0007})`;
      header.style.letterSpacing = `${2 + scrollY * 0.02}px`;
    }
  });

  // Glow na kartach projektów
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.boxShadow = `0 0 24px 4px rgba(100,125,222,0.25), 0 0 60px 0 rgba(67,206,162,0.15)`;
      card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(100,125,222,0.10) 0%, rgba(30,30,30,0.82) 100%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
      card.style.background = '';
    });
  });

  // Animacja podświetlenia nagłówka
  const header = document.querySelector('header h1');
  if(header) {
    header.animate([
      { textShadow: "0 0 0px #fff" },
      { textShadow: "0 0 18px #fff, 0 0 8px #bdbdbd" },
      { textShadow: "0 0 0px #fff" }
    ], {
      duration: 1800,
      easing: "ease-in-out"
    });
  }
}); 