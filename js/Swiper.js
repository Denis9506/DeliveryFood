document.addEventListener('DOMContentLoaded', () => {
  const swiper = new Swiper('.promo-slider', {
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    autoplay: {
      delay: 5000, 
      disableOnInteraction: false,
    },
  });
});
