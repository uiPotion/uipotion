// Copy button functionality - reusable for any copy button.
// A button copies its data-copy-text value, or the text of the element whose
// id is in data-copy-target. data-copy-done sets the screen reader message.
(function() {
  let status = null;

  // One polite live region for all copy buttons on the page. It's created on
  // load, because screen readers can miss a region that appears with its text.
  function createStatus() {
    status = document.createElement('div');
    status.className = 'sr-only';
    status.setAttribute('role', 'status');
    document.body.appendChild(status);
  }

  function announce(message) {
    // Clear first so the same message is announced again on a repeat copy
    status.textContent = '';
    setTimeout(function() {
      status.textContent = message;
    }, 100);
  }

  // Template indentation can end up inside the target; trim every line
  function getTargetText(target) {
    return target.textContent
      .split('\n')
      .map(function(line) { return line.trim(); })
      .join('\n')
      .trim();
  }

  function selectTarget(target) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(target);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function initCopyButtons() {
    const copyButtons = document.querySelectorAll('[data-copy-text], [data-copy-target]');
    if (copyButtons.length === 0) return;
    createStatus();

    copyButtons.forEach(function(copyBtn) {
      const copyIcon = copyBtn.querySelector('.copy-icon');
      const checkIcon = copyBtn.querySelector('.check-icon');
      const copyText = copyBtn.querySelector('.copy-text');
      const targetId = copyBtn.getAttribute('data-copy-target');
      const target = targetId ? document.getElementById(targetId) : null;
      const doneMessage = copyBtn.getAttribute('data-copy-done') || 'Copied to the clipboard.';

      if (!copyIcon || !checkIcon || !copyText) return;
      if (targetId && !target) return;

      const originalLabel = copyText.textContent;
      let resetTimer = null;

      function reset() {
        copyIcon.style.display = 'block';
        checkIcon.style.display = 'none';
        copyText.textContent = originalLabel;
        copyBtn.classList.remove('copied');
      }

      copyBtn.addEventListener('click', async function() {
        const textToCopy = target ? getTargetText(target) : copyBtn.getAttribute('data-copy-text');
        clearTimeout(resetTimer);

        try {
          await navigator.clipboard.writeText(textToCopy);

          copyIcon.style.display = 'none';
          checkIcon.style.display = 'block';
          copyText.textContent = 'Copied!';
          copyBtn.classList.add('copied');
          announce(doneMessage);

          resetTimer = setTimeout(reset, 2500);
        } catch (err) {
          console.error('Failed to copy:', err);
          reset();
          copyText.textContent = 'Copy failed';
          // Leave the text selected so it can be copied by hand
          if (target) {
            selectTarget(target);
            announce('Copying failed. The text is selected, so you can copy it with your keyboard.');
          } else {
            announce('Copying failed.');
          }
          resetTimer = setTimeout(reset, 2500);
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
