document.addEventListener("DOMContentLoaded", () => {
  // Animacja wejścia zdjęć
  document.querySelectorAll('.gallery-img').forEach((img, i) => {
    setTimeout(() => img.classList.add('visible'), 200 + i * 180);
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  document.querySelectorAll('.gallery-img').forEach(img => {
    img.addEventListener('click', () => {
      lightbox.classList.add('active');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    });
  });
  lightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
    lightboxImg.src = '';
  });
}); 