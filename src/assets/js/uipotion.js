// UI Potion search index builder and search functionality
const uipotion = (function () {
  let searchIndex;
  let postsJSON;
  const rootDir = document.querySelector('html').dataset.hrldRoot;
  const postsJsonDataPath =
    (rootDir && window.location.href.includes(rootDir) ? '/' + rootDir : '') +
    '/jsonData/posts.json';

  // Loads data for search index
  const fetchPostsJsonData = () => {
    return fetch(postsJsonDataPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch posts data');
        }
        return response.json();
      })
      .then((data) => {
        postsJSON = data;
        return data;
      })
      .catch((error) => {
        console.error('Error loading posts data:', error);
        postsJSON = [];
        return [];
      });
  };

  // Builds search index using json data and lunr library
  const buildSearchIndexWithLunr = () => {
    fetchPostsJsonData().then((data) => {
      if (!data || data.length === 0) {
        console.warn('No posts data available for search index');
        return;
      }

      if (typeof lunr === 'undefined') {
        console.error('Lunr.js is not loaded. Search functionality will not work.');
        return;
      }

      try {
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
      } catch (error) {
        console.error('Error building search index:', error);
      }
    });
  };

  // Search function
  const search = (phrase) => {
    if (!searchIndex) {
      console.warn('Search index is not ready yet. Please wait a moment and try again.');
      return [];
    }

    if (!phrase || phrase.trim().length < 2) {
      return [];
    }

    try {
      const searchResults = searchIndex.search(phrase);
      // Create a map for quick lookup
      const postsMap = {};
      postsJSON.forEach((post) => {
        postsMap[post.fileName] = post;
      });
      
      // Return results in the order of search relevance (as returned by lunr)
      return searchResults
        .map((result) => postsMap[result.ref])
        .filter((item) => item !== undefined);
    } catch (error) {
      console.error('Error performing search:', error);
      return [];
    }
  };

  // Initialize whole UI Potion app javascript logic
  const init = () => {
    buildSearchIndexWithLunr();
  };

  return {
    init,
    search,
  };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', uipotion.init);
} else {
  uipotion.init();
}
