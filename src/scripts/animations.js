// src/scripts/animations.js

document.addEventListener('DOMContentLoaded', () => {
  // Mengatur Intersection Observer untuk animasi fade-in standar
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Opsional: Hentikan pengamatan setelah elemen terlihat untuk mencegah animasi berulang
        observer.unobserve(entry.target);
      }
    });
  }, {
    // Memulai animasi sedikit sebelum elemen sepenuhnya terlihat
    threshold: 0.1 
  });

  // Temukan semua elemen yang ingin dianimasikan
  const elementsToAnimate = document.querySelectorAll('.fade-in-on-scroll, .stagger-children');
  elementsToAnimate.forEach(el => observer.observe(el));

  // --- Implementasi Expand/Collapse & See More/Less ---

  // 1. Logika Accordion (Expand/Collapse) untuk FAQ
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    const icon = header.querySelector('.accordion-icon');

    if (header && content) {
      header.addEventListener('click', () => {
        // Tutup semua item lain jika ada
        document.querySelectorAll('.accordion-item').forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            const otherContent = otherItem.querySelector('.accordion-content');
            const otherIcon = otherItem.querySelector('.accordion-icon');
            otherContent.style.maxHeight = null;
            if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
          }
        });

        // Buka/tutup item yang diklik
        const isActive = item.classList.toggle('active');
        content.style.maxHeight = isActive ? content.scrollHeight + "px" : null;
        if (icon) icon.style.transform = isActive ? 'rotate(180deg)' : 'rotate(0deg)';
      });
    }
  });

  // 2. Logika "See More/Less"
  const seeMoreContainers = document.querySelectorAll('.see-more-container');
  seeMoreContainers.forEach(container => {
    const content = container.querySelector('.see-more-content');
    const button = container.querySelector('.see-more-button');

    if (content && button) {
      // Periksa apakah kontennya lebih panjang dari tinggi maksimum awal
      if (content.scrollHeight > 150) { // 150px adalah maxHeight awal
        button.style.display = 'inline-block'; // Tampilkan tombol jika perlu
      }

      button.addEventListener('click', () => {
        const isExpanded = container.classList.toggle('expanded');
        if (isExpanded) {
          content.style.maxHeight = content.scrollHeight + 'px';
          button.textContent = 'Lihat Lebih Sedikit';
        } else {
          content.style.maxHeight = '150px'; // Kembali ke tinggi awal
          button.textContent = 'Lihat Lebih Banyak';
        }
      });
    }
  });
});
