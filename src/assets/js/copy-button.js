// Copy button functionality - reusable for any copy button
(function() {
  function initCopyButtons() {
    const copyButtons = document.querySelectorAll('[data-copy-text]');
    
    copyButtons.forEach(function(copyBtn) {
      const copyIcon = copyBtn.querySelector('.copy-icon');
      const checkIcon = copyBtn.querySelector('.check-icon');
      const copyText = copyBtn.querySelector('.copy-text');
      const textToCopy = copyBtn.getAttribute('data-copy-text');

      if (!copyIcon || !checkIcon || !copyText) return;

      const originalLabel = copyText.textContent;
      copyBtn.addEventListener('click', async function() {
        try {
          await navigator.clipboard.writeText(textToCopy);
          
          copyIcon.style.display = 'none';
          checkIcon.style.display = 'block';
          copyText.textContent = 'Copied!';
          copyBtn.classList.add('copied');
          
          setTimeout(() => {
            copyIcon.style.display = 'block';
            checkIcon.style.display = 'none';
            copyText.textContent = originalLabel;
            copyBtn.classList.remove('copied');
          }, 2500);
        } catch (err) {
          console.error('Failed to copy:', err);
          // Fallback: show error state briefly
          if (copyText) {
            copyText.textContent = 'Error';
            setTimeout(() => {
              copyText.textContent = originalLabel;
            }, 2000);
          }
        }
      });
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCopyButtons);
  } else {
    initCopyButtons();
  }
})();
