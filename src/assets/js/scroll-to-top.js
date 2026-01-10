// Scroll to top button functionality
(function() {
  function initScrollToTop() {
    const scrollTopBtn = document.getElementById('potionScrollTop');
    if (!scrollTopBtn) return;

    // Show/hide button based on scroll position
    function toggleScrollTop() {
      if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    // Smooth scroll to top
    function scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    // Event listeners
    window.addEventListener('scroll', toggleScrollTop);
    scrollTopBtn.addEventListener('click', scrollToTop);

    // Initial check
    toggleScrollTop();
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollToTop);
  } else {
    initScrollToTop();
  }
})();
