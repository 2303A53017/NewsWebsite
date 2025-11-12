/* script.js - NewsNow
   Uses NewsAPI key provided by user.
   Features:
   - Filter by country & category
   - Auto-refresh (toggle)
   - Pagination handling
   - API test function
*/

const NEWS_API_KEY = 'c90234f0875a4e0698749ac6e593f78e'; // your key
const BASE = 'https://newsapi.org/v2';
let state = {
  page: 1,
  pageSize: 20,
  totalResults: 0,
  q: '',
  country: 'in',
  category: 'general',
  autoRefresh: true,
  autoRefreshInterval: 60000, // 60s
  autoRefreshTimer: null
};

document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const qInput = document.getElementById('q');
  const countrySel = document.getElementById('country-select');
  const catSel = document.getElementById('category-select');
  const pageSizeSel = document.getElementById('page-size');
  const searchBtn = document.getElementById('search-btn');
  const loadDefaultBtn = document.getElementById('load-default');
  const articlesEl = document.getElementById('articles');
  const statusEl = document.getElementById('status');
  const resultsCount = document.getElementById('results-count');
  const pageNum = document.getElementById('page-num');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const apiTestBtn = document.getElementById('api-test');
  const autoRefreshCheckbox = document.getElementById('auto-refresh');

  // initialize controls
  countrySel.value = state.country || '';
  catSel.value = state.category || '';
  pageSizeSel.value = String(state.pageSize);
  autoRefreshCheckbox.checked = state.autoRefresh;

  // Load default headlines (top-headlines)
  async function load() {
    statusEl.textContent = 'Loading...';
    try {
      const data = await fetchHeadlines();
      renderArticles(data.articles);
      state.totalResults = data.totalResults || 0;
      resultsCount.textContent = `Results: ${state.totalResults}`;
      pageNum.textContent = state.page;
      statusEl.textContent = `Loaded ${data.articles.length} articles`;
    } catch (err) {
      statusEl.textContent = `Error: ${err.message}`;
      articlesEl.innerHTML = `<div class="col-span-full text-red-400">Error fetching news: ${err.message}</div>`;
    }
  }

  // fetch headlines based on state
  async function fetchHeadlines() {
    // Use "top-headlines" when country or category specified; otherwise use "everything"
    const params = new URLSearchParams();
    params.set('page', state.page);
    params.set('pageSize', state.pageSize);
    params.set('apiKey', NEWS_API_KEY);

    let endpoint = `${BASE}/top-headlines`;

    if (state.q && state.q.trim().length > 0) {
      // prefer everything for keyword searches to get more global results
      endpoint = `${BASE}/everything`;
      params.set('q', state.q.trim());
      // for everything endpoint, sort by publishedAt
      params.set('sortBy', 'publishedAt');
    } else {
      // top-headlines supports country & category
      if (state.country) params.set('country', state.country);
      if (state.category) params.set('category', state.category);
    }

    const url = `${endpoint}?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) {
      const body = await res.json().catch(()=>({message: res.statusText}));
      throw new Error(body.message || `HTTP ${res.status}`);
    }
    return res.json();
  }

  function renderArticles(articles) {
    articlesEl.innerHTML = '';
    if (!articles || articles.length === 0) {
      articlesEl.innerHTML = `<div class="col-span-full text-gray-400">No articles found.</div>`;
      return;
    }
    articles.forEach(article => {
      const card = document.createElement('article');
      card.className = 'article-card bg-gray-800 rounded-lg overflow-hidden border border-gray-700 p-0';
      card.innerHTML = `
        ${article.urlToImage ? `<img src="${escapeHtml(article.urlToImage)}" alt="" class="card-img">`
                             : `<div class="img-placeholder">No Image</div>`}
        <div class="p-4">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold"><a href="${escapeHtml(article.url)}" target="_blank" rel="noreferrer" class="hover:underline">${escapeHtml(article.title)}</a></h3>
            <span class="text-xs text-gray-400">${formatDate(article.publishedAt)}</span>
          </div>
          <p class="text-sm text-gray-300 card-desc">${escapeHtml(article.description || article.content || '')}</p>
          <div class="mt-3 flex items-center justify-between">
            <div class="text-xs text-gray-400">${escapeHtml(article.source?.name || '')}</div>
            <a href="${escapeHtml(article.url)}" target="_blank" rel="noreferrer" class="text-blue-400 text-sm">Read</a>
          </div>
        </div>
      `;
      articlesEl.appendChild(card);
    });
  }

  // pagination
  prevBtn.addEventListener('click', () => {
    if (state.page > 1) {
      state.page--;
      load();
      resetAutoRefresh();
    }
  });
  nextBtn.addEventListener('click', () => {
    // rough max page guard
    const maxPage = Math.ceil((state.totalResults || 1000) / state.pageSize);
    if (state.page < maxPage) {
      state.page++;
      load();
      resetAutoRefresh();
    }
  });

  // controls binding
  searchBtn.addEventListener('click', () => {
    state.q = qInput.value;
    state.page = 1;
    load();
    resetAutoRefresh();
  });

  loadDefaultBtn.addEventListener('click', () => {
    state.q = '';
    qInput.value = '';
    state.country = 'in';
    state.category = 'general';
    countrySel.value = state.country;
    catSel.value = state.category;
    state.page = 1;
    load();
    resetAutoRefresh();
  });

  countrySel.addEventListener('change', () => {
    state.country = countrySel.value;
    state.page = 1;
    load();
    resetAutoRefresh();
  });

  catSel.addEventListener('change', () => {
    state.category = catSel.value;
    state.page = 1;
    load();
    resetAutoRefresh();
  });

  pageSizeSel.addEventListener('change', () => {
    state.pageSize = Number(pageSizeSel.value);
    state.page = 1;
    load();
    resetAutoRefresh();
  });

  apiTestBtn.addEventListener('click', async () => {
    apiTestBtn.disabled = true;
    apiTestBtn.textContent = 'Testing...';
    try {
      const ok = await apiTest();
      alert(ok ? 'API OK — keys and network working.' : 'API Test failed — see console.');
    } catch (err) {
      alert('API Test error: ' + err.message);
      console.error(err);
    } finally {
      apiTestBtn.disabled = false;
      apiTestBtn.textContent = 'API Test';
    }
  });

  autoRefreshCheckbox.addEventListener('change', (e) => {
    state.autoRefresh = e.target.checked;
    if (state.autoRefresh) startAutoRefresh();
    else stopAutoRefresh();
  });

  function startAutoRefresh() {
    stopAutoRefresh();
    if (!state.autoRefresh) return;
    state.autoRefreshTimer = setInterval(() => {
      load();
    }, state.autoRefreshInterval);
  }
  function stopAutoRefresh() {
    if (state.autoRefreshTimer) {
      clearInterval(state.autoRefreshTimer);
      state.autoRefreshTimer = null;
    }
  }
  function resetAutoRefresh() {
    if (state.autoRefresh) startAutoRefresh();
  }

  // initial load
  load();
  if (state.autoRefresh) startAutoRefresh();

  // API test helper
  async function apiTest() {
    // Try a small request to top-headlines with pageSize=1
    const url = `${BASE}/top-headlines?country=${state.country || 'us'}&pageSize=1&apiKey=${NEWS_API_KEY}`;
    const res = await fetch(url);
    const json = await res.json();
    console.log('API test response:', json);
    return res.ok && Array.isArray(json.articles);
  }

}); // DOMContentLoaded end

/* --- Utility functions --- */
function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString();
}
function escapeHtml(s='') {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
