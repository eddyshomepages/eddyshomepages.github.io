//console.log('CLEAN BLOG VERSION 3.0');

function setLinksNewTab() {
	document.querySelectorAll('#full-post-content a, #about-content a, #frontpage-content a').forEach(function(link) {
		if (link.protocol && link.protocol.startsWith('http')) {
			link.setAttribute('target', '_blank');
		}
	});
}

marked.setOptions({ breaks: true, gfm: true });

const aboutFiles = {
	fi: 'about.fi.md',
	en: 'about.en.md'
};

const frontpageFiles = {
	fi: 'frontpage.fi.md',
	en: 'frontpage.en.md'
};

const markdownPosts = {
	fi: [
	'aaniohjauksen-lisaaminen-almond-genie-virtuaaliavustimeen.md',
	'moikka-maailma.md',
	'mita-olen-vuosien-aikana-puuhaillut.md',
	'uuden-upsin-kayttoonotto-ja-nutin-asennuksen-kertaus.md',
	'dockerin-ja-docker-composen-asennus-raspberrypios-kayttojarjestelmaan.md',
	'caddy-web-serverin-asennus-raspberrypios-kayttojarjestelmaan.md',
	'wordpress-org-php-ja-mariadb-asennus-caddy-web-serverille.md',
	'home-assistantin-asennus-docker-composen-avulla.md',
	'baikal-kalenteripalvelimen-asennus-docker-composen-avulla-ja-suojatun-yhteyden-muodostus-caddyn-reverse-proxy-asetuksilla.md',
	'docker-composen-avulla-asennetun-home-assistantin-varmuuskopiointi-duplicatin-avulla.md',
	'mariadb-tietokannan-kayttoonotto-home-assistantissa.md',
	'mosquitto-brokerin-asennus-kayttaen-docker-composea.md',
	'ruuvitag-antureiden-lisaaminen-home-assistantiin-ruuvitag-discoveryn-avulla-mqtt-protokollaa-kayttaen.md',
	'zigbee2mqtt-asentaminen-docker-composen-avulla.md',
	'sivuston-rss-syote-saatavilla.md',
	'oman-streemauspalvelun-rakentaminen.md',
	'energian-hinnan-seurantaa-home-assistantilla.md',
	'sahkon-hinnan-maarittaminen-kvartaaleittain-home-assistantilla.md',
	'almond-genie-virtuaaliavustimen-lisaaminen-home-assistantiin.md',
	'aaniohjauksen-lisaaminen-almond-genie-virtuaaliavustimeen.md',
	'energian-hinnan-seurantaa-home-assistantilla-osa-2.md',
	'mycroft-virtuaaliavustimen-asennus-ja-kayttoonotto.md',
	'auton-lammityspistorasian-kaynnistys-automaattisesti-haluttuun-aikaan.md',
	'alytelevision-aanenvoimakkuuden-rajoittaminen-home-assistantin-avulla.md',
	'raspberrypiosn-asentaminen-ja-kayttoonotto.md',
	'home-assistantin-kaytto-halytysjarjestelmana-osa-1.md',
	'nain-rakennat-oman-kotiautomaatiojarjestelman-raspberrypin-ja-home-assistantin-avulla.md',
	'esphomen-asennus-paatteen-kautta-linux-kayttojarjestelmaan.md',
	'sahkon-kulutuksen-seurantaa-esp8266-esphomen-ja-home-assistantin-avulla.md',
	'raspberrypi-osn-asentaminen-kiosk-tilaan.md',
	'home-assistantin-kaytto-halytysjarjestelmana-osa-2.md',
	'jellyfin-mediapalvelimen-asennus.md',
	'syncthing-synkronointisovelluksen-asennus-ja-kayttoonotto.md',
	'motioneye-kameravalvonta-ohjelmiston-asennus.md',
	'sadevesimittarin-tuunaus-zigbee-verkkoon-sopivaksi.md',
	'huoltokatko.md',
	'ruuvitag-ble-integraation-kayttoonotto-docker-composen-avulla-asennetussa-home-assistantissa.md',
	'eddys-homapages-new-site.md',
	'paivitetyt-sivut.md'
	],
	en: [
		'hello-world.md',
		'renewed-pages.md'
	]
};

let allPosts = [];
let currentPage = 1;
let postsPerPage = 10;
let searchQuery = '';
let activeTagFilters = new Set();
let allTags = [];
let currentTheme = 'light';
let currentLanguage = 'fi';
let previousPage = 1;

// Enhanced YAML Parser
function parseYAML(content) {
	const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
	if (!frontmatterMatch) {
		return { metadata: {}, content: content };
	}
	
	const frontmatter = frontmatterMatch[1];
	const markdownContent = frontmatterMatch[2];
	let metadata = {};
	
	// Parse title
	const titleMatch = frontmatter.match(/title:\s*(?:"([^"]+)"|'([^']+)'|([^\n\r]+))/);
	if (titleMatch) {
		metadata.title = titleMatch[1] || titleMatch[2] || titleMatch[3].trim();
	}
	
	// Parse date
	const dateMatch = frontmatter.match(/date:\s*(?:"([^"]+)"|'([^']+)'|([^\n\r]+))/);
	if (dateMatch) {
		metadata.date = (dateMatch[1] || dateMatch[2] || dateMatch[3]).trim();
	}
	
	// Parse categories
	metadata.categories = [];
	const categoriesMatch = frontmatter.match(/categories:\s*\n((?:\s*-\s*(?:"[^"]*"|'[^']*'|[^\n\r]+)\s*\n)*)/);
	if (categoriesMatch) {
		const categoryLines = categoriesMatch[1].split('\n');
		for (const line of categoryLines) {
			const match = line.match(/\s*-\s*(?:"([^"]*)"|'([^']*)'|([^\n\r]+))/);
			if (match) {
				const category = (match[1] || match[2] || match[3]).trim();
				if (category) metadata.categories.push(category);
			}
		}
	}
	
	// Parse tags
	metadata.tags = [];
	const tagsMatch = frontmatter.match(/tags:\s*\n((?:\s*-\s*(?:"[^"]*"|'[^']*'|[^\n\r]+)\s*\n)*)/);
	if (tagsMatch) {
		const tagLines = tagsMatch[1].split('\n');
		for (const line of tagLines) {
			const match = line.match(/\s*-\s*(?:"([^"]*)"|'([^']*)'|([^\n\r]+))/);
			if (match) {
				const tag = (match[1] || match[2] || match[3]).trim();
				if (tag) metadata.tags.push(tag);
			}
		}
	}
	
	// Also try inline array format
	const inlineTagsMatch = frontmatter.match(/tags:\s*\[([^\]]+)\]/);
	if (inlineTagsMatch && metadata.tags.length === 0) {
		const tagList = inlineTagsMatch[1].split(',').map(tag => 
			tag.replace(/['"]/g, '').trim()
		).filter(tag => tag.length > 0);
		metadata.tags = tagList;
	}
	
	const inlineCategoriesMatch = frontmatter.match(/categories:\s*\[([^\]]+)\]/);
	if (inlineCategoriesMatch && metadata.categories.length === 0) {
		const categoryList = inlineCategoriesMatch[1].split(',').map(cat => 
			cat.replace(/['"]/g, '').trim()
		).filter(cat => cat.length > 0);
		metadata.categories = categoryList;
	}
	
	return { metadata, content: markdownContent };
}

// Change language
async function changeLanguage() {
	const newLanguage = document.getElementById('language-selector').value;
	if (newLanguage === currentLanguage) return;
	
	currentLanguage = newLanguage;
	localStorage.setItem('preferredLanguage', currentLanguage);
	
	await loadPostsForLanguage();
	currentPage = 1;
	
	handleInitialRoute();
}

// Load posts for specific language
async function loadPostsForLanguage() {
	const postsToLoad = markdownPosts[currentLanguage] || [];
	
	try {
	const postPromises = postsToLoad.map(filename => loadPost(filename));
	const loadedPosts = await Promise.all(postPromises);
	allPosts = loadedPosts.filter(post => post !== null).sort((a, b) => new Date(b.date) - new Date(a.date));
	
	document.getElementById('post-count').textContent = `${allPosts.length} posts loaded`;
	updateRecentPosts();
	
	} catch (error) {
	console.error('Error loading posts:', error);
	}
}

// Update recent posts in sidebar
function updateRecentPosts() {
	const recent = allPosts.slice(0, 5);
	document.getElementById('recent-posts').innerHTML = recent
	.map(post => `<li><a onclick="showPost('${post.id}')" style="cursor: pointer; color: var(--accent);">${post.title}</a></li>`)
	.join('');
}

// Initialize theme
function initTheme() {
	const savedTheme = localStorage.getItem('theme') || 'light';
	currentTheme = savedTheme;
	applyTheme(savedTheme);
	updateThemeButton();
}

// Apply theme
function applyTheme(theme) {
	if (theme === 'dark') {
	document.documentElement.setAttribute('data-theme', 'dark');
	} else {
	document.documentElement.removeAttribute('data-theme');
	}
}

// Toggle theme
function toggleTheme() {
	const newTheme = currentTheme === 'light' ? 'dark' : 'light';
	currentTheme = newTheme;
	localStorage.setItem('theme', newTheme);
	applyTheme(newTheme);
	updateThemeButton();
}

// Update theme button icon
function updateThemeButton() {
	const button = document.getElementById('theme-toggle');
	button.textContent = currentTheme === 'light' ? '🌙' : '☀️';
	button.title = currentTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
}

// Load frontpage
async function loadFrontpage() {
	try {
	const frontpageFile = frontpageFiles[currentLanguage] || frontpageFiles.fi;
		const response = await fetch(`/posts/${frontpageFile}`);
	
	if (!response.ok) throw new Error(`HTTP ${response.status}`);
	
	const fileContent = await response.text();
	const { metadata, content } = parseYAML(fileContent);
	
	return {
		title: metadata.title || 'Welcome',
		//content: marked.parse(content)
		content: sanitizeHTML(marked.parse(content))
	};
	} catch (error) {
	console.error('Error loading frontpage:', error);
	return {
		title: 'Welcome',
		content: '<p>Frontpage could not be loaded.</p>'
	};
	}
}

// Load about page
async function loadAboutPage() {
	try {
	const aboutFile = aboutFiles[currentLanguage] || aboutFiles.fi;
		const response = await fetch(`/posts/${aboutFile}`);
	
	if (!response.ok) throw new Error(`HTTP ${response.status}`);
	
	const fileContent = await response.text();
	const { metadata, content } = parseYAML(fileContent);
	
	return {
		title: metadata.title || 'About',
		//content: marked.parse(content)
		content: sanitizeHTML(marked.parse(content))
	};
	} catch (error) {
	console.error('Error loading about page:', error);
	return {
		title: 'About',
		content: '<p>About page could not be loaded.</p>'
	};
	}
}

// Show frontpage
async function showFrontpage() {
	hideAllPages();
	document.getElementById('frontpage-page').style.display = 'block';
	document.body.classList.add('frontpage-active');
	
	window.history.replaceState({page: 'home'}, 'Home', '#home');
	
	const frontpageData = await loadFrontpage();
	document.getElementById('frontpage-content').innerHTML = `
	<div class="frontpage-layout">
		<div class="frontpage-hero">
			<img src="/assets/profile.jpg" alt="Profile Picture" class="profile-image" onerror="this.style.display='none'">
			<h1>${frontpageData.title || 'Esa P'}</h1>
			<div>${frontpageData.content}</div>
			<div class="social-links">
				<a href="https://facebook.com/esa.porttila" title="Facebook" target="_blank"><i class="fab fa-facebook fa-lg"></i></a>
				<a href="https://github.com/esapo/" title="GitHub" target="_blank"><i class="fab fa-github fa-lg"></i></a>
				<a href="https://fi.linkedin.com/in/esaporttila/" title="LinkedIn" target="_blank"><i class="fab fa-linkedin fa-lg"></i></a>
				<a href="mailto:pikaeetu72@gmail.com" title="Email"><i class="fas fa-envelope fa-lg"></i></a>
				<a href="https://mastodontti.fi/@esa_p/" title="Mastodon" target="_blank"><i class="fab fa-mastodon fa-lg"></i></a>
				<a href="https://t.me/esa_p/" title="Telegram" target="_blank"><i class="fab fa-telegram fa-lg"></i></a>
				<a href="#" onclick="downloadRSSFeed(); return false;" title="Download RSS Feed"><i class="fas fa-rss fa-lg"></i></a>
			</div>
		</div>
	</div>
	`;
	
	window.scrollTo(0, 0);
	setLinksNewTab();
}

// Show posts page
function showPosts() {
	hideAllPages();
	document.getElementById('posts-content').style.display = 'block';
	document.body.classList.remove('frontpage-active');
	
	// Ensure sidebar is visible on posts page
	document.querySelector('.sidebar').style.display = 'flex';
	
	window.history.replaceState({page: 'posts'}, 'Posts', '#posts');
	
	if (allPosts.length > 0) {
	displayPosts(allPosts);
	}
	
	window.scrollTo(0, 0);

	// In showPost function, after setting innerHTML, add:
	setTimeout(() => {
		loadUtterancesComments(post.id);
		setLinksNewTab();
	}, 100);
}

// Show search page
function showSearch() {
	hideAllPages();
	document.getElementById('search-page').style.display = 'block';
	document.querySelector('.back-button').style.display = 'block';
	document.body.classList.remove('frontpage-active');
	
	window.history.replaceState({page: 'search'}, 'Search', '#search');
	
	if (allTags.length === 0) {
	generateTagFilters();
	}
}

// Show about page
async function showAbout() {
	hideAllPages();
	document.getElementById('about-page').style.display = 'block';
	document.querySelector('.back-button').style.display = 'block';
	document.body.classList.remove('frontpage-active');
	
	window.history.replaceState({page: 'about'}, 'About', '#about');
	
	const aboutData = await loadAboutPage();
	document.getElementById('about-content').innerHTML = `
	<h1>${aboutData.title}</h1>
	<div>${aboutData.content}</div>
	`;
	
	window.scrollTo(0, 0);
	setLinksNewTab();
}

// Show post
function showPost(postId) {
	const post = allPosts.find(p => p.id === postId);
	if (!post) {
	console.error(`Post not found: ${postId}`);
	return;
	}

	previousPage = currentPage;

	hideAllPages();
	document.getElementById('full-post').style.display = 'block';
	document.querySelector('.back-button').style.display = 'block';
	document.body.classList.remove('frontpage-active');
	
	window.history.replaceState({page: 'post', postId: postId}, post.title, `#post/${postId}`);
	
	document.getElementById('full-post-content').innerHTML = `
		<h1>${post.title}</h1>
		<div class="post-meta" style="margin-bottom: 2rem;">
		<p><strong>Date:</strong> ${post.date}</p>
		<p><strong>Tags:</strong> ${post.tags.join(', ')}</p>
		</div>
		${generateShareButtons(post.title, post.id)}
		<hr style="margin: 2rem 0;">
		<div>${post.content}</div>
`   ;

	window.scrollTo(0, 0);
	setLinksNewTab();
}

// Helper function to hide all pages
function hideAllPages() {
	document.getElementById('frontpage-page').style.display = 'none';
	document.getElementById('posts-content').style.display = 'none';
	document.getElementById('full-post').style.display = 'none';
	document.getElementById('about-page').style.display = 'none';
	document.getElementById('search-page').style.display = 'none';
	document.querySelector('.back-button').style.display = 'none';
}

// Handle initial routing based on URL hash
function handleInitialRoute() {
	const hash = window.location.hash.slice(1);
	
	if (!hash || hash === 'home') {
	showFrontpage();
	} else if (hash === 'posts') {
	showPosts();
	} else if (hash === 'search') {
	showSearch();
	} else if (hash === 'about') {
	showAbout();
	} else if (hash.startsWith('post/')) {
	const postId = hash.replace('post/', '');
	showPost(postId);
	} else {
	showFrontpage();
	}
}

// Generate tag filter buttons
function generateTagFilters() {
	const tagCounts = {};
	allPosts.forEach(post => {
	post.tags.forEach(tag => {
		tagCounts[tag] = (tagCounts[tag] || 0) + 1;
	});
	});
	
	allTags = Object.entries(tagCounts)
	.sort((a, b) => b[1] - a[1]) // Sort by count, most popular first
	.map(([tag, count]) => ({ tag, count }));
	
	const container = document.getElementById('tag-filter-buttons');
	const showLimit = 20;
	const showingAll = container.getAttribute('data-showing-all') === 'true';
	
	const tagsToShow = showingAll ? allTags : allTags.slice(0, showLimit);
	
	let buttonsHTML = tagsToShow.map(({tag, count}) => `
	<button class="tag-filter-button" onclick="toggleTagFilter('${tag}')">
		${tag} (${count})
	</button>
	`).join('');
	
	// Add show more/less button if there are more than showLimit tags
	if (allTags.length > showLimit) {
	if (showingAll) {
		buttonsHTML += `
			<button class="tag-show-toggle" onclick="toggleShowAllTags()">
				Show Less Tags
			</button>
		`;
	} else {
		buttonsHTML += `
			<button class="tag-show-toggle" onclick="toggleShowAllTags()">
				Show All ${allTags.length} Tags
			</button>
		`;
	}
	}
	
	container.innerHTML = buttonsHTML;
}

// Toggle showing all tags
function toggleShowAllTags() {
	const container = document.getElementById('tag-filter-buttons');
	const currentlyShowingAll = container.getAttribute('data-showing-all') === 'true';
	container.setAttribute('data-showing-all', !currentlyShowingAll);
	generateTagFilters();
}

// Toggle tag filter
function toggleTagFilter(tag) {
	const button = event.target;
	
	if (activeTagFilters.has(tag)) {
	activeTagFilters.delete(tag);
	button.classList.remove('active');
	} else {
	activeTagFilters.add(tag);
	button.classList.add('active');
	}
	
	performSearch();
}

// Perform search
function performSearch() {
	searchQuery = document.getElementById('search-input').value.toLowerCase().trim();
	
	let filteredPosts = allPosts.filter(post => {
	const matchesText = !searchQuery || 
		post.title.toLowerCase().includes(searchQuery) ||
		post.excerpt.toLowerCase().includes(searchQuery) ||
		post.tags.some(tag => tag.toLowerCase().includes(searchQuery));
	
	const matchesTags = activeTagFilters.size === 0 ||
		Array.from(activeTagFilters).every(filterTag => post.tags.includes(filterTag));
	
	return matchesText && matchesTags;
	});
	
	displaySearchResults(filteredPosts);
}

// Display search results
function displaySearchResults(posts) {
	const container = document.getElementById('search-results');
	
	if (posts.length === 0) {
	container.innerHTML = '<p>No posts found matching your search criteria.</p>';
	return;
	}
	
	container.innerHTML = `
	<p><strong>${posts.length} post(s) found</strong></p>
	${posts.map(post => `
		<div class="search-result" onclick="showPost('${post.id}')">
			<h3>${highlightText(post.title, searchQuery)}</h3>
			<div class="post-meta">
				<span>📅 ${post.date}</span>
				<span>🏷️ ${post.tags.slice(0, 3).join(', ')}</span>
			</div>
			<p>${highlightText(post.excerpt, searchQuery)}</p>
			<div class="post-tags">
				${post.tags.slice(0, 8).map(tag => `<span class="tag ${activeTagFilters.has(tag) ? 'active' : ''}">${tag}</span>`).join('')}
			</div>
		</div>
	`).join('')}
	`;
}

// Highlight search terms
function highlightText(text, query) {
	if (!query) return text;
	
	const regex = new RegExp(`(${query})`, 'gi');
	return text.replace(regex, '<span class="search-highlight">$1</span>');
}

// Clear search
function clearSearch() {
	document.getElementById('search-input').value = '';
	searchQuery = '';
	activeTagFilters.clear();
	
	document.querySelectorAll('.tag-filter-button').forEach(btn => {
	btn.classList.remove('active');
	});
	
	document.getElementById('search-results').innerHTML = '<p>Enter a search term or select tags to find posts...</p>';
}

// Load post
async function loadPost(filename) {
	try {
		const response = await fetch(`/posts/${currentLanguage}/${filename}`);
		
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}
		
		const fileContent = await response.text();
		const { metadata, content } = parseYAML(fileContent);
		
		const allTags = [...(metadata.categories || []), ...(metadata.tags || [])];
		
		const post = {
			id: filename.replace('.md', ''),
			title: metadata.title || filename.replace('.md', '').replace(/-/g, ' '),
			excerpt: stripMarkdown(content).substring(0, 150) + '...',
			//content: marked.parse(content),
			content: sanitizeHTML(marked.parse(content)),
			date: metadata.date || '2023-01-01',
			tags: allTags,
			filename: filename
		};
		
		return post;
	} catch (error) {
		console.error(`Error loading ${filename}:`, error);
		return null;
	}
}

// Strip markdown formatting for clean excerpts
function stripMarkdown(text) {
	return text
	.replace(/#{1,6}\s+/g, '')
	.replace(/\*\*(.*?)\*\*/g, '$1')
	.replace(/\*(.*?)\*/g, '$1')
	.replace(/__(.*?)__/g, '$1')
	.replace(/_(.*?)_/g, '$1')
	.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
	.replace(/`([^`]+)`/g, '$1')
	.replace(/```[\s\S]*?```/g, '')
	.replace(/>\s+/g, '')
	.replace(/^\s*[-*+]\s+/gm, '')
	.replace(/^\s*\d+\.\s+/gm, '')
	.replace(/\s+/g, ' ')
	.trim();
}

// Security: HTML sanitization function
function sanitizeHTML(html) {
    if (typeof DOMPurify !== 'undefined') {
        return DOMPurify.sanitize(html);
    } else {
        console.warn('DOMPurify not loaded, using fallback sanitization');
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }
}

// Development mode detection for console logging
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' || 
                     window.location.hostname.includes('192.168.');

function debugLog(...args) {
    if (isDevelopment) {
        console.log(...args);
    }
}

// Display posts with pagination
function displayPosts(posts) {
	const startIndex = (currentPage - 1) * postsPerPage;
	const endIndex = startIndex + postsPerPage;
	const paginatedPosts = posts.slice(startIndex, endIndex);
	
	const container = document.getElementById('posts-display');
	container.innerHTML = paginatedPosts.map(post => `
	<div class="post" onclick="showPost('${post.id}')">
		<h2 class="post-title">${post.title}</h2>
		<div class="post-meta">
			<span>📅 ${post.date}</span>
			<span>🏷️ ${post.tags.length} tags</span>
		</div>
		<p class="post-excerpt">${post.excerpt}</p>
		<div class="post-tags">
			${post.tags.slice(0, 8).map(tag => `<span class="tag">${tag}</span>`).join('')}
		</div>
	</div>
	`).join('');
	
	updatePaginationControls(posts.length);
}

// Update pagination controls
function updatePaginationControls(totalPosts) {
	const totalPages = Math.ceil(totalPosts / postsPerPage);
	
	document.getElementById('page-info').textContent = 
		`Page ${currentPage} of ${totalPages} (${totalPosts} posts)`;
	document.getElementById('page-info-bottom').textContent = 
		`Page ${currentPage} of ${totalPages} (${totalPosts} posts)`;

	let buttonsHTML = '';
	
	buttonsHTML += `<button class="page-btn" onclick="goToPage(${currentPage - 1})" 
		${currentPage === 1 ? 'disabled' : ''}>← Previous</button>`;
	
	for (let i = 1; i <= totalPages; i++) {
		if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
			buttonsHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" 
				onclick="goToPage(${i})">${i}</button>`;
		} else if (i === currentPage - 3 || i === currentPage + 3) {
			buttonsHTML += `<span>...</span>`;
		}
	}
	
	buttonsHTML += `<button class="page-btn" onclick="goToPage(${currentPage + 1})" 
		${currentPage === totalPages ? 'disabled' : ''}>Next →</button>`;
	
	document.getElementById('pagination-buttons').innerHTML = buttonsHTML;
	document.getElementById('pagination-buttons-bottom').innerHTML = buttonsHTML;
}

// Go to specific page
function goToPage(page) {
	const totalPages = Math.ceil(allPosts.length / postsPerPage);
	if (page < 1 || page > totalPages) return;
	
	currentPage = page;
	displayPosts(allPosts);
}

// Change posts per page
function changePostsPerPage(selectElement) {
	postsPerPage = parseInt(selectElement.value);
	currentPage = 1;
	displayPosts(allPosts);
	
	const otherSelectId = selectElement.id === 'posts-per-page' ? 'posts-per-page-bottom' : 'posts-per-page';
	document.getElementById(otherSelectId).value = selectElement.value;
}

// Share functions
function sharePost(platform, title, url) {
	const encodedTitle = encodeURIComponent(title);
	const encodedUrl = encodeURIComponent(url);
	
	const shareUrls = {
	facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
	twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
	linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
	telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
	whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
	instagram: `https://www.instagram.com/`, // Instagram doesn't support direct URL sharing
	snapchat: `https://www.snapchat.com/scan?attachmentUrl=${encodedUrl}`,
	mastodon: `https://mastodon.social/share?text=${encodedTitle}%20${encodedUrl}`,
	email: `mailto:?subject=${encodedTitle}&body=${encodedTitle}%0A${encodedUrl}`
	};
	
	if (shareUrls[platform]) {
	window.open(shareUrls[platform], '_blank', 'width=600,height=400');
	}
}

function copyToClipboard(url) {
	navigator.clipboard.writeText(url).then(() => {
	const copyBtn = document.querySelector('.share-btn.copy');
	const originalContent = copyBtn.innerHTML;
	copyBtn.innerHTML = '<i class="fas fa-check"></i>';
	copyBtn.classList.add('copied');
	
	setTimeout(() => {
		copyBtn.innerHTML = originalContent;
		copyBtn.classList.remove('copied');
	}, 2000);
	}).catch(() => {
	// Fallback for older browsers
	const textArea = document.createElement('textarea');
	textArea.value = url;
	document.body.appendChild(textArea);
	textArea.select();
	document.execCommand('copy');
	document.body.removeChild(textArea);
	
	const copyBtn = document.querySelector('.share-btn.copy');
	const originalContent = copyBtn.innerHTML;
	copyBtn.innerHTML = '<i class="fas fa-check"></i>';
	copyBtn.classList.add('copied');
	
	setTimeout(() => {
		copyBtn.innerHTML = originalContent;
		copyBtn.classList.remove('copied');
	}, 2000);
	});
}

function generateShareButtons(postTitle, postId) {
	// Clean the title for URL encoding
	const cleanTitle = postTitle.replace(/'/g, "\\'");
	// Get the base URL and construct the post URL
	const baseUrl = window.location.origin + window.location.pathname.replace(/\/+$/, '');
	const currentUrl = `${baseUrl}/#post/${postId}`;
	
	// Temporary debug logging - remove after testing
	//console.log('Generated URL:', currentUrl);
	//console.log('Post ID:', postId);
	//console.log('Post Title:', postTitle);
	
	
	return `
		<div class="share-buttons">
		<span>Share this post:</span>
		<a href="#" class="share-btn facebook" onclick="sharePost('facebook', '${cleanTitle}', '${currentUrl}'); return false;" title="Share on Facebook">
			<i class="fab fa-facebook-f"></i>
		</a>
		<a href="#" class="share-btn twitter" onclick="sharePost('twitter', '${cleanTitle}', '${currentUrl}'); return false;" title="Share on Twitter">
			<i class="fab fa-twitter"></i>
		</a>
		<a href="#" class="share-btn instagram" onclick="sharePost('instagram', '${cleanTitle}', '${currentUrl}'); return false;" title="Share on Instagram">
			<i class="fab fa-instagram"></i>
		</a>
		<a href="#" class="share-btn linkedin" onclick="sharePost('linkedin', '${cleanTitle}', '${currentUrl}'); return false;" title="Share on LinkedIn">
			<i class="fab fa-linkedin-in"></i>
		</a>
		<a href="#" class="share-btn snapchat" onclick="sharePost('snapchat', '${cleanTitle}', '${currentUrl}'); return false;" title="Share on Snapchat">
			<i class="fab fa-snapchat-ghost"></i>
		</a>
		<a href="#" class="share-btn mastodon" onclick="sharePost('mastodon', '${cleanTitle}', '${currentUrl}'); return false;" title="Share on Mastodon">
			<i class="fab fa-mastodon"></i>
		</a>
		<a href="#" class="share-btn telegram" onclick="sharePost('telegram', '${cleanTitle}', '${currentUrl}'); return false;" title="Share on Telegram">
			<i class="fab fa-telegram-plane"></i>
		</a>
		<a href="#" class="share-btn whatsapp" onclick="sharePost('whatsapp', '${cleanTitle}', '${currentUrl}'); return false;" title="Share on WhatsApp">
			<i class="fab fa-whatsapp"></i>
		</a>
		<a href="#" class="share-btn email" onclick="sharePost('email', '${cleanTitle}', '${currentUrl}'); return false;" title="Share via Email">
			<i class="fas fa-envelope"></i>
		</a>
		<a href="#" class="share-btn copy" onclick="copyToClipboard('${currentUrl}'); return false;" title="Copy Link">
			<i class="fas fa-link"></i>
		</a>
		</div>
	`;
}

// RSS Feed Generation
function generateRSSFeed() {
	const siteUrl = window.location.origin;
	const feedUrl = `${siteUrl}/rss.xml`;
	const currentDate = new Date().toUTCString();
	
	// Sort posts by date (newest first)
	const sortedPosts = [...allPosts].sort((a, b) => new Date(b.date) - new Date(a.date));
	const recentPosts = sortedPosts.slice(0, 20); // Latest 20 posts
	
	let rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
	<title>Eddy's Homepages</title>
	<description>Your guide to Linux systems and Home Assistant automation</description>
	<link>${siteUrl}</link>
	<atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
	<language>${currentLanguage}</language>
	<lastBuildDate>${currentDate}</lastBuildDate>
	<generator>Eddy's Homepages Static Generator</generator>
	<webMaster>pikaeetu72@gmail.com (Esa P)</webMaster>
	<managingEditor>pikaeetu72@gmail.com (Esa P)</managingEditor>
	<category>Technology</category>
	<category>Linux</category>
	<category>Home Automation</category>
`;

	recentPosts.forEach(post => {
	const postUrl = `${siteUrl}/#post/${post.id}`;
	const pubDate = new Date(post.date).toUTCString();
	
	// Clean content for RSS (remove HTML tags for description)
	const cleanExcerpt = post.excerpt.replace(/<[^>]*>/g, '').substring(0, 200) + '...';
	
	rssXml += `
	<item>
		<title><![CDATA[${post.title}]]></title>
		<description><![CDATA[${cleanExcerpt}]]></description>
		<link>${postUrl}</link>
		<guid isPermaLink="true">${postUrl}</guid>
		<pubDate>${pubDate}</pubDate>
		<author>pikaeetu72@gmail.com (Esa P)</author>`;
	
	// Add categories/tags
	post.tags.forEach(tag => {
		rssXml += `
		<category>${tag}</category>`;
	});
	
	rssXml += `
	</item>`;
	});
	
	rssXml += `
	</channel>
</rss>`;
	
	return rssXml;
}

// Download RSS feed
function downloadRSSFeed() {
	const rssContent = generateRSSFeed();
	const blob = new Blob([rssContent], { type: 'application/rss+xml' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = 'rss.xml';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

function loadUtterancesComments(postId) {
    const existingComments = document.querySelector('.utterances');
    if (existingComments) {
        existingComments.remove();
    }
    
    const commentsDiv = document.createElement('div');
    commentsDiv.className = 'comments-section';
    commentsDiv.style.marginTop = '3rem';
    
    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', 'eddyshomepages/eddyshomepages.github.io');
    script.setAttribute('issue-term', `post-${postId}`);
    script.setAttribute('theme', currentTheme === 'dark' ? 'github-dark' : 'github-light');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    
    commentsDiv.appendChild(script);
    document.getElementById('full-post-content').appendChild(commentsDiv);
}

// Initialize
async function init() {
	try {
	//console.log('Initializing blog version 3.0...');
	
	initTheme();
	
	currentLanguage = localStorage.getItem('preferredLanguage') || 'fi';
	document.getElementById('language-selector').value = currentLanguage;
	
	await loadPostsForLanguage();
	
	window.addEventListener('hashchange', handleInitialRoute);
	
	handleInitialRoute();
	
	//console.log('Blog initialization complete');
	
	} catch (error) {

	console.error('Init error:', error);
	document.getElementById('frontpage-content').innerHTML = 
		`<div style="padding: 2rem; text-align: center; color: red;">
			Error loading frontpage: ${error.message}
		</div>`;
	}
}

document.addEventListener('DOMContentLoaded', init);


