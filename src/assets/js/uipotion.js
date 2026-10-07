// UI Potion search index: loads lunr and the search data on first use, then searches them
const uipotion = (function () {
  const rootDir = document.querySelector('html').dataset.hrldRoot;
  const basePath =
    rootDir && window.location.href.includes(rootDir) ? '/' + rootDir : '';
  const postsJsonDataPath = basePath + '/jsonData/posts.json';
  const lunrScriptPath = basePath + '/assets/js/vendor/lunr-2.3.9.min.js';

  let searchIndex = null;
  let postsMap = {};
  let status = 'idle'; // idle | loading | ready | error
  let loadPromise = null;

  // Loads the vendored lunr build from the site itself
  const loadLunr = () => {
    if (typeof lunr !== 'undefined') {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = lunrScriptPath;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        script.remove();
        reject(new Error('Failed to load the search library'));
      };
      document.head.appendChild(script);
    });
  };

  // Loads data for search index
  const fetchPostsJsonData = () => {
    return fetch(postsJsonDataPath).then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch search data');
      }
      return response.json();
    });
  };

  // Builds search index using json data and lunr library
  const buildSearchIndex = (data) => {
    postsMap = {};
    data.forEach((post) => {
      postsMap[post.fileName] = post;
    });

    searchIndex = lunr(function () {
      this.ref('fileName');
      this.field('title', { boost: 3 }); // Boost title matches
      this.field('excerpt', { boost: 2 }); // Boost excerpt matches
      this.field('body', { boost: 1 }); // Body has normal weight
      this.field('tags', { boost: 1.5 }); // Boost tags matches

      data.forEach((doc) => {
        this.add(
          Object.assign({}, doc, {
            tags: Array.isArray(doc.tags) ? doc.tags.join(' ') : '',
            body: doc.body ? doc.body.replace(/(<([^>]+)>)/gi, '') : '', // Strip HTML tags
            excerpt: doc.excerpt || '',
            title: doc.title || '',
          })
        );
      }, this);
    });
  };

  // Loads lunr and the search data once. Concurrent calls share one promise,
  // and calling load() again after a failure retries.
  const load = () => {
    if (status === 'ready' || status === 'loading') {
      return loadPromise;
    }

    status = 'loading';
    loadPromise = Promise.all([loadLunr(), fetchPostsJsonData()])
      .then(([, data]) => {
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('Search data is empty');
        }
        buildSearchIndex(data);
        status = 'ready';
      })
      .catch((error) => {
        console.error('Error loading search:', error);
        searchIndex = null;
        status = 'error';
        throw error;
      });

    return loadPromise;
  };

  const getStatus = () => status;

  // Search function; returns an empty list until load() has finished
  const search = (phrase) => {
    if (!searchIndex || !phrase || phrase.trim().length < 2) {
      return [];
    }

    try {
      // Return results in the order of search relevance (as returned by lunr)
      return searchIndex
        .search(phrase)
        .map((result) => postsMap[result.ref])
        .filter((item) => item !== undefined);
    } catch (error) {
      // lunr throws on some query syntax, for example a trailing colon
      console.error('Error performing search:', error);
      return [];
    }
  };

  return {
    load,
    getStatus,
    search,
  };
})();
