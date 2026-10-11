// UI Potion search dialog: a modal <dialog> with a combobox input and a listbox of results
(function () {
  const rootDir = document.querySelector('html').dataset.hrldRoot;
  const postsPath =
    (rootDir && window.location.href.includes(rootDir) ? '/' + rootDir : '') +
    '/potions/';
  const searchToggle = document.querySelector('[data-js-search]');
  const dialog = document.querySelector('[data-js-search-overlay]');
  const closeButton = document.querySelector('[data-js-search-close]');
  const searchInput = document.querySelector('[data-js-search-input]');
  const resultsList = document.querySelector('[data-js-search-results]');
  const messageArea = document.querySelector('[data-js-search-message]');
  const statusRegion = document.querySelector('[data-js-search-status]');

  if (
    !searchToggle ||
    !dialog ||
    !closeButton ||
    !searchInput ||
    !resultsList ||
    !messageArea ||
    !statusRegion ||
    typeof uipotion === 'undefined'
  ) {
    return;
  }

  let selectedIndex = -1; // -1 means no active option; focus stays in the input
  let searchTimeout;
  let returnFocusTo = null;
  let pointerDownOnBackdrop = false;

  // Opens as a modal dialog: the rest of the page becomes inert and Escape closes it
  const openDialog = function () {
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  };

  const closeDialog = function () {
    if (typeof dialog.close === 'function') {
      dialog.close(); // fires the close event, handled below
    } else {
      dialog.removeAttribute('open');
      handleClose();
    }
  };

  const clearResults = function () {
    selectedIndex = -1;
    resultsList.textContent = '';
    resultsList.hidden = true;
    messageArea.textContent = '';
    messageArea.hidden = true;
    searchInput.setAttribute('aria-expanded', 'false');
    searchInput.removeAttribute('aria-activedescendant');
    statusRegion.textContent = '';
  };

  const paragraph = function (text, className) {
    const p = document.createElement('p');
    if (className) {
      p.className = className;
    }
    p.textContent = text;
    return p;
  };

  // Shows a message under the input (loading, error, no results) and announces it
  const renderMessage = function (className, paragraphs, announcement) {
    clearResults();
    const box = document.createElement('div');
    box.className = className;
    paragraphs.forEach(function (p) {
      box.appendChild(p);
    });
    messageArea.appendChild(box);
    messageArea.hidden = false;
    statusRegion.textContent = announcement;
    return box;
  };

  const renderLoading = function () {
    renderMessage('search-no-results', [paragraph('Loading search…')], 'Loading search');
  };

  const renderError = function () {
    // Already shown (typing runs the search again): keep it, so the Try again button
    // isn't replaced under a click or keyboard focus, and the error isn't announced again
    if (messageArea.querySelector('.search-error')) {
      return;
    }
    const box = renderMessage(
      'search-error',
      [
        paragraph("Search couldn't load."),
        paragraph('Check your connection and try again.', 'search-hint'),
      ],
      "Search couldn't load"
    );
    const retryButton = document.createElement('button');
    retryButton.type = 'button';
    retryButton.className = 'button search-retry-btn';
    retryButton.textContent = 'Try again';
    retryButton.addEventListener('click', function () {
      searchInput.focus();
      renderLoading();
      startLoading();
    });
    box.appendChild(retryButton);
  };

  const renderNoResults = function (query) {
    const first = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = query;
    first.append('No potions found matching "', strong, '"');
    renderMessage(
      'search-no-results',
      [first, paragraph('Try different keywords or browse by category.', 'search-hint')],
      'No potions found'
    );
  };

  const renderResults = function (results) {
    clearResults();

    results.forEach(function (result, index) {
      // Each option is the result link itself, so it stays a single interactive element
      const option = document.createElement('a');
      option.id = 'search-overlay-option-' + index;
      option.href = postsPath + result.fileName.replace(/\.html$/, '');
      option.className = 'search-overlay-results-item search-result-link';
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', 'false');
      option.tabIndex = -1; // focus stays in the input; aria-activedescendant points here

      // Extract category from fileName (e.g., "components/navbar.html" -> "components")
      const fileNameParts = result.fileName.split('/');
      const category = fileNameParts.length > 1 ? fileNameParts[0] : '';

      if (category) {
        const categoryBadge = document.createElement('span');
        categoryBadge.classList.add('search-result-category');
        categoryBadge.textContent = category;
        option.appendChild(categoryBadge);
      }

      const title = document.createElement('span');
      title.classList.add('search-result-title');
      title.textContent = result.title || result.fileName;
      option.appendChild(title);

      if (result.excerpt) {
        const excerpt = document.createElement('span');
        excerpt.classList.add('search-result-excerpt');
        excerpt.textContent = result.excerpt;
        option.appendChild(excerpt);
      }

      resultsList.appendChild(option);
    });

    resultsList.hidden = false;
    searchInput.setAttribute('aria-expanded', 'true');
    statusRegion.textContent =
      results.length === 1 ? '1 potion found' : results.length + ' potions found';
  };

  const runSearch = function (query) {
    if (query.length < 2) {
      clearResults();
      return;
    }

    const status = uipotion.getStatus();
    if (status === 'error') {
      renderError();
      return;
    }
    if (status !== 'ready') {
      // startLoading() runs the search again once the index is ready
      renderLoading();
      return;
    }

    const results = uipotion.search(query);
    if (results.length === 0) {
      renderNoResults(query);
    } else {
      renderResults(results);
    }
  };

  // Loads lunr and the search data on first use; later opens reuse them
  const startLoading = function () {
    uipotion.load().then(
      function () {
        if (dialog.open) {
          runSearch(searchInput.value.trim());
        }
      },
      function () {
        if (dialog.open) {
          renderError();
        }
      }
    );
  };

  const updateActiveOption = function () {
    const options = resultsList.querySelectorAll('[role="option"]');
    options.forEach(function (option, index) {
      const isActive = index === selectedIndex;
      option.setAttribute('aria-selected', isActive ? 'true' : 'false');
      if (isActive) {
        option.scrollIntoView({ block: 'nearest' });
      }
    });

    if (selectedIndex >= 0 && options[selectedIndex]) {
      searchInput.setAttribute('aria-activedescendant', options[selectedIndex].id);
    } else {
      searchInput.removeAttribute('aria-activedescendant');
      // Back in the input: scroll it into view if a long result list moved it off screen
      searchInput.scrollIntoView({ block: 'nearest' });
    }
  };

  const openSearch = function () {
    if (dialog.open) {
      return;
    }

    returnFocusTo = document.activeElement;

    // Lock page scroll, compensating for the scrollbar so the layout doesn't shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = scrollbarWidth + 'px';
    }
    document.body.classList.add('js-overflow-y-hidden');

    clearResults();
    openDialog();
    searchInput.focus();
    startLoading();
  };

  // Runs on every close: close button, Escape, backdrop click, or navigation
  const handleClose = function () {
    // The close event fires asynchronously; if search was reopened in the meantime,
    // this cleanup belongs to the previous session and must not touch the new one
    if (dialog.open) {
      return;
    }

    clearTimeout(searchTimeout);
    searchInput.value = '';
    clearResults();
    document.body.classList.remove('js-overflow-y-hidden');
    document.body.style.paddingRight = '';

    // Return focus to whatever opened the search (the toggle button, or the page for Ctrl/Cmd+K)
    if (
      returnFocusTo &&
      returnFocusTo !== document.body &&
      document.contains(returnFocusTo) &&
      typeof returnFocusTo.focus === 'function'
    ) {
      returnFocusTo.focus();
    }
    returnFocusTo = null;
  };

  searchToggle.addEventListener('click', openSearch);
  closeButton.addEventListener('click', closeDialog);
  dialog.addEventListener('close', handleClose);

  // Open search with keyboard shortcut (Ctrl+K / Cmd+K)
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k' && !dialog.open) {
      e.preventDefault();
      openSearch();
    }
  });

  // Close on a click that starts and ends on the overlay itself, so dragging a
  // text selection out of the input doesn't close the dialog
  dialog.addEventListener('pointerdown', function (e) {
    pointerDownOnBackdrop = e.target === dialog;
  });
  dialog.addEventListener('click', function (e) {
    if (e.target === dialog && pointerDownOnBackdrop) {
      closeDialog();
    }
    pointerDownOnBackdrop = false;
  });

  // Keyboard navigation inside the combobox; Escape is handled by the dialog itself
  searchInput.addEventListener('keydown', function (e) {
    // Let Enter confirm text from an input method editor (Safari reports keyCode 229)
    if (e.isComposing || e.keyCode === 229) {
      return;
    }

    const options = resultsList.querySelectorAll('[role="option"]');
    if (options.length === 0) {
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (selectedIndex < options.length - 1) {
        selectedIndex++;
        updateActiveOption();
      }
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (selectedIndex >= 0) {
        selectedIndex--; // from the first option, -1 returns to the input
        updateActiveOption();
      }
      return;
    }

    if (e.key === 'Enter' && selectedIndex >= 0 && options[selectedIndex]) {
      e.preventDefault();
      window.location.href = options[selectedIndex].href;
    }
  });

  // Search input handler
  searchInput.addEventListener('input', function () {
    clearTimeout(searchTimeout);
    const query = searchInput.value.trim();

    if (!query) {
      clearResults();
      return;
    }

    // Debounce search for better performance
    searchTimeout = setTimeout(function () {
      runSearch(query);
    }, 200);
  });
})();
