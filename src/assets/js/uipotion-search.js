// UI Potion search overlay UI handler
(function () {
  const rootDir = document.querySelector('html').dataset.hrldRoot;
  const postsPath =
    (rootDir && window.location.href.includes(rootDir) ? '/' + rootDir : '') +
    '/potions/';
  const searchIcon = document.querySelector('[data-js-search]');
  const searchIconClose = document.querySelector('[data-js-search-close]');
  const searchOverlay = document.querySelector('[data-js-search-overlay]');
  const body = document.body;
  const searchInput = document.querySelector('[data-js-search-input]');
  const searchResultsContainer = document.querySelector(
    '[data-js-search-results]'
  );

  if (
    searchIcon &&
    searchInput &&
    searchIconClose &&
    searchOverlay &&
    searchResultsContainer
  ) {
    let selectedIndex = -1; // -1 means input is focused, 0+ means a result is selected
    let currentResults = [];
    let scrollbarWidth = 0;

    // Calculate scrollbar width
    const getScrollbarWidth = function () {
      if (scrollbarWidth > 0) {
        return scrollbarWidth;
      }
      // Create a temporary div to measure scrollbar width
      const outer = document.createElement('div');
      outer.style.visibility = 'hidden';
      outer.style.overflow = 'scroll';
      outer.style.msOverflowStyle = 'scrollbar';
      document.body.appendChild(outer);
      
      const inner = document.createElement('div');
      outer.appendChild(inner);
      
      scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
      
      outer.parentNode.removeChild(outer);
      return scrollbarWidth;
    };

    // Function to open search overlay
    const openSearch = function () {
      searchOverlay.classList.add('js-visible');
      
      // Calculate and apply scrollbar compensation
      const sbWidth = getScrollbarWidth();
      if (sbWidth > 0) {
        body.style.paddingRight = sbWidth + 'px';
      }
      
      body.classList.add('js-overflow-y-hidden');
      
      // Clear previous results
      searchResultsContainer.innerHTML = '';
      selectedIndex = -1;
      currentResults = [];
      // Focus input after a small delay to ensure overlay is visible
      setTimeout(() => {
        searchInput.focus();
      }, 100);
    };

    // Open search overlay on icon click
    searchIcon.addEventListener('click', openSearch);

    // Open search overlay with keyboard shortcut (Ctrl+K / Cmd+K)
    document.addEventListener('keydown', function (e) {
      // Check for Ctrl+K (Windows/Linux) or Cmd+K (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        // Only open search if overlay is not already visible
        if (!searchOverlay.classList.contains('js-visible')) {
          e.preventDefault();
          openSearch();
        }
      }
    });

    // Close search overlay
    const closeSearch = function () {
      searchInput.value = '';
      searchResultsContainer.innerHTML = '';
      searchOverlay.classList.remove('js-visible');
      body.classList.remove('js-overflow-y-hidden');
      // Remove scrollbar compensation
      body.style.paddingRight = '';
    };

    searchIconClose.addEventListener('click', closeSearch);

    // Update visual selection
    const updateSelection = function (resultItems) {
      resultItems.forEach((item, index) => {
        if (index === selectedIndex) {
          item.classList.add('selected');
          item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else {
          item.classList.remove('selected');
        }
      });
    };

    // Keyboard navigation handler
    const handleKeyboardNavigation = function (e) {
      if (!searchOverlay.classList.contains('js-visible')) {
        return;
      }

      const resultItems = searchResultsContainer.querySelectorAll('.search-overlay-results-item:not(.search-no-results):not(.search-error)');
      const resultCount = resultItems.length;

      // Handle Escape key
      if (e.key === 'Escape') {
        closeSearch();
        return;
      }

      // Only handle arrow keys and Enter if we have results
      if (resultCount === 0) {
        return;
      }

      // Handle Arrow Down
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        e.stopPropagation();
        // If input is focused (selectedIndex === -1), start at first result
        if (selectedIndex === -1 && resultCount > 0) {
          selectedIndex = 0;
          updateSelection(resultItems);
        } else if (selectedIndex < resultCount - 1) {
          selectedIndex++;
          updateSelection(resultItems);
        }
        return;
      }

      // Handle Arrow Up
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        e.stopPropagation();
        if (selectedIndex > 0) {
          selectedIndex--;
          updateSelection(resultItems);
        } else if (selectedIndex === 0) {
          // Return to input when at top
          selectedIndex = -1;
          updateSelection(resultItems);
          searchInput.focus();
        }
        return;
      }

      // Handle Enter key
      if (e.key === 'Enter' && selectedIndex >= 0 && selectedIndex < resultCount) {
        e.preventDefault();
        e.stopPropagation();
        const selectedLink = resultItems[selectedIndex].querySelector('.search-result-link');
        if (selectedLink) {
          window.location.href = selectedLink.href;
        }
        return;
      }
    };

    // Add keyboard event listener - only on input to avoid double handling
    searchInput.addEventListener('keydown', handleKeyboardNavigation);

    // Close on overlay background click
    searchOverlay.addEventListener('click', function (e) {
      if (e.target === searchOverlay) {
        closeSearch();
      }
    });

    // Search input handler
    let searchTimeout;
    searchInput.addEventListener('input', function () {
      const query = this.value.trim();

      // Clear previous timeout
      clearTimeout(searchTimeout);

      if (!query) {
        searchResultsContainer.innerHTML = '';
        return;
      }

      // Debounce search for better performance
      searchTimeout = setTimeout(() => {
        if (query.length < 2) {
          searchResultsContainer.innerHTML = '';
          return;
        }

        searchResultsContainer.innerHTML = '';

        if (typeof uipotion === 'undefined' || !uipotion.search) {
          const errorMsg = document.createElement('div');
          errorMsg.classList.add('search-overlay-results-item', 'search-error');
          errorMsg.innerText = 'Search functionality is not available.';
          searchResultsContainer.appendChild(errorMsg);
          return;
        }

        const results = uipotion.search(query);
        currentResults = results || [];
        selectedIndex = -1; // Reset selection when results change

        if (!results || results.length === 0) {
          const noResults = document.createElement('div');
          noResults.classList.add('search-overlay-results-item', 'search-no-results');
          noResults.innerHTML = '<p>No potions found matching "<strong>' + escapeHtml(query) + '</strong>"</p><p class="search-hint">Try different keywords or browse by category.</p>';
          searchResultsContainer.appendChild(noResults);
        } else {
          results.forEach(function (result, index) {
            const resultItemContainer = document.createElement('div');
            resultItemContainer.classList.add('search-overlay-results-item');
            resultItemContainer.setAttribute('role', 'listitem');

            const resultLink = document.createElement('a');
            resultLink.href = postsPath + result.fileName.replace(/\.html$/, '');
            resultLink.classList.add('search-result-link');

            // Extract category from fileName (e.g., "components/navbar.html" -> "components")
            const fileNameParts = result.fileName.split('/');
            const category = fileNameParts.length > 1 ? fileNameParts[0] : '';

            // Category badge
            if (category) {
              const categoryBadge = document.createElement('span');
              categoryBadge.classList.add('search-result-category');
              categoryBadge.textContent = category;
              resultLink.appendChild(categoryBadge);
            }

            // Title
            const title = document.createElement('span');
            title.classList.add('search-result-title');
            title.textContent = result.title || result.fileName;
            resultLink.appendChild(title);

            // Excerpt
            if (result.excerpt) {
              const excerpt = document.createElement('p');
              excerpt.classList.add('search-result-excerpt');
              excerpt.textContent = result.excerpt;
              resultLink.appendChild(excerpt);
            }

            resultItemContainer.appendChild(resultLink);
            searchResultsContainer.appendChild(resultItemContainer);
          });
        }
      }, 200); // 200ms debounce
    });

    // Reset selection when clicking on results
    searchResultsContainer.addEventListener('click', function (e) {
      const clickedItem = e.target.closest('.search-overlay-results-item');
      if (clickedItem) {
        const items = searchResultsContainer.querySelectorAll('.search-overlay-results-item:not(.search-no-results):not(.search-error)');
        selectedIndex = Array.from(items).indexOf(clickedItem);
        updateSelection(items);
      }
    });
  }

  // Helper function to escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
})();
