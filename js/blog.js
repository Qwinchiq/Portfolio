// Animacja wejścia kart bloga + filtrowanie + scroll reveal
document.addEventListener("DOMContentLoaded", () => {
  const blogCards = document.querySelectorAll('.blog-card');
  blogCards.forEach((card, i) => {
    setTimeout(() => {
      card.classList.add('visible');
    }, 200 + i * 200);
  });

  // Przycisk "Pokaż więcej" z animacją ładowania
  const moreBtn = document.getElementById('blog-more-btn');
  if (moreBtn) {
    moreBtn.addEventListener('click', () => {
      const btnText = moreBtn.querySelector('.btn-text');
      const btnLoader = moreBtn.querySelector('.btn-loader');
      btnText.textContent = "Ładowanie...";
      btnLoader.style.display = "inline-block";
      moreBtn.disabled = true;

      setTimeout(() => {
        btnText.textContent = "Brak nowych wpisów 😎";
        btnLoader.style.display = "none";
      }, 1800);
    });
  }

  // Filtrowanie wpisów po kategoriach
  const catBtns = document.querySelectorAll('.cat-btn');
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-cat');
      blogCards.forEach(card => {
        if (cat === 'all' || card.getAttribute('data-cat') === cat) {
          card.style.display = '';
          setTimeout(() => card.classList.add('visible'), 50);
        } else {
          card.style.display = 'none';
          card.classList.remove('visible');
        }
      });
    });
  });

  // Scroll reveal dla blog-card
  const revealOnScroll = () => {
    blogCards.forEach(card => {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) {
        card.classList.add('visible');
      }
    });
  };
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();
}); 