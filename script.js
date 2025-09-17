// SEO-Enhanced Script with Meta Management
function setLinksNewTab() {
    document.querySelectorAll('#full-post-content a, #about-content a, #frontpage-content a').forEach(function(link) {
        // Only modify external links (http/https) and exclude share buttons, navigation, and internal functionality
        if (link.protocol && link.protocol.startsWith('http') && 
            !link.classList.contains('share-btn') && 
            !link.hasAttribute('onclick')) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            
            // Remove any onclick handlers that might interfere
            link.removeAttribute('onclick');
            
            // Make sure the link uses the href attribute
            if (!link.href || link.href === '#') {
                // If it's a malformed link, try to extract URL from text content
                const urlMatch = link.textContent.match(/(https?:\/\/[^\s]+)/);
                if (urlMatch) {
                    link.href = urlMatch[0];
                }
            }
        }
    });
}

/*function setLinksNewTab() {
	document.querySelectorAll('#full-post-content a, #about-content a, #frontpage-content a').forEach(function(link) {
		if (link.protocol && link.protocol.startsWith('http')) {
			link.setAttribute('target', '_blank');
			link.setAttribute('rel', 'noopener'); // Security enhancement
		}
	});
}*/

// SEO: Dynamic meta tag management
function updatePageMeta(title, description, canonicalUrl, ogType = 'website', keywords = '') {
    // Update title
    document.title = title;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.content = description;
    }
    
    // Update keywords if provided
    if (keywords) {
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            metaKeywords.content = keywords;
        }
    }
    
    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
        canonical.href = canonicalUrl;
    }
    
    // Update Open Graph tags
    updateOGTags(title, description, canonicalUrl, ogType);
    
    // Update Twitter Card tags
    updateTwitterTags(title, description);
}

function updateOGTags(title, description, url, type = 'website') {
    const ogTags = [
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: url },
        { property: 'og:type', content: type }
    ];
    
    ogTags.forEach(tag => {
        let element = document.querySelector(`meta[property="${tag.property}"]`);
        if (element) {
            element.content = tag.content;
        }
    });
}

function updateTwitterTags(title, description) {
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    let twitterDescription = document.querySelector('meta[name="twitter:description"]');
    
    if (twitterTitle) twitterTitle.content = title;
    if (twitterDescription) twitterDescription.content = description;
}

// SEO: Update breadcrumb structured data
function updateBreadcrumbSchema(items) {
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
        }))
    };
    
    let breadcrumbScript = document.getElementById('breadcrumb-schema');
    if (breadcrumbScript) {
        breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);
    }
}

// SEO: Generate article structured data
function generateArticleSchema(post) {
    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "datePublished": post.date,
        "dateModified": post.date,
        "author": {
            "@type": "Person",
            "name": "Esa P",
            "url": "https://eddyshomepages.fi/#person"
        },
        "publisher": {
            "@type": "Person",
            "name": "Esa P",
            "url": "https://eddyshomepages.fi/"
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://eddyshomepages.fi/#post/${post.id}`
        },
        "url": `https://eddyshomepages.fi/#post/${post.id}`,
        "keywords": post.tags.join(", "),
        "articleSection": post.tags[0] || "Technology",
        "inLanguage": currentLanguage === 'fi' ? 'fi-FI' : 'en-US'
    };
}

// Enhanced initialization
marked.setOptions({ 
    breaks: true, 
    gfm: true,
    headerIds: true,
    mangle: false
});

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

// Enhanced YAML Parser with better error handling
function parseYAML(content) {
	const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
	if (!frontmatterMatch) {
		return { metadata: {}, content: content };
	}
	
	const frontmatter = frontmatterMatch[1];
	const markdownContent = frontmatterMatch[2];
	let metadata = {};
	
	try {
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
        
        // Parse description/excerpt
        const descMatch = frontmatter.match(/description:\s*(?:"([^"]+)"|'([^']+)'|([^\n\r]+))/);
        if (descMatch) {
            metadata.description = descMatch[1] || descMatch[2] || descMatch[3].trim();
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
    } catch (error) {
        console.error('Error parsing YAML frontmatter:', error);
    }
	
	return { metadata, content: markdownContent };
}

// SEO: Change language with proper meta updates
async function changeLanguage() {
	const newLanguage = document.getElementById('language-selector').value;
	if (newLanguage === currentLanguage) return;
	
	currentLanguage = newLanguage;
	localStorage.setItem('preferredLanguage', currentLanguage);
	
	// Update HTML lang attribute for SEO
	document.documentElement.lang = currentLanguage === 'fi' ? 'fi' : 'en';
	
	await loadPostsForLanguage();
	currentPage = 1;
	
	// Update meta tags for new language
	const titles = {
	    fi: 'Eddy\'s Homepages — Linux-järjestelmät ja Home Assistant -oppaat',
	    en: 'Eddy\'s Homepages — Linux Systems & Home Assistant Guides'
	};
	
	const descriptions = {
	    fi: 'Askel askeleelta -oppaat Linux-järjestelmistä, Raspberry Pi:stä, Dockerista ja Home Assistant automaatiosta.',
	    en: 'Step-by-step guides on Linux systems, Raspberry Pi, Docker, and Home Assistant automation.'
	};
	
	//updatePageMeta(titles[currentLanguage], descriptions[currentLanguage], window.location.href);
	
	//handleInitialRoute();
	// **ADD THIS LINE** at the end of the existing changeLanguage() function, before handleInitialRoute():
	updateNavigationText();

	// So the end of changeLanguage() function should look like:
	// ...existing code...
	updatePageMeta(titles[currentLanguage], descriptions[currentLanguage], window.location.href);
	updateNavigationText(); // **ADD THIS LINE**
	handleInitialRoute();
	updatePageTexts();
	
        if (document.getElementById('search-page').style.display !== 'none') {
            generateTagFilters();
        }

}

// Load posts for specific language
async function loadPostsForLanguage() {
	const postsToLoad = markdownPosts[currentLanguage] || [];
	
	try {
        const postPromises = postsToLoad.map(filename => loadPost(filename));
        const loadedPosts = await Promise.all(postPromises);
        allPosts = loadedPosts.filter(post => post !== null).sort((a, b) => new Date(b.date) - new Date(a.date));
        
        const t = currentLanguage === 'fi' ? 'artikkelia ladattu' : 'posts loaded';
	document.getElementById('post-count').textContent = `${allPosts.length} ${t}`;
        updateRecentPosts();
        
        // Generate sitemap data for search engines
        generateSitemapData();
        
	} catch (error) {
        console.error('Error loading posts:', error);
	}
}

// Update recent posts in sidebar
function updateRecentPosts() {
	const recent = allPosts.slice(0, 5);
	document.getElementById('recent-posts').innerHTML = recent
	.map(post => `<li><a onclick="showPost('${post.id}')" style="cursor: pointer; color: var(--accent);" title="${post.title}">${post.title}</a></li>`)
	.join('');
}


// SEO: Generate sitemap data for better indexing
function generateSitemapData() {
    // This creates a client-side sitemap that can be used by crawlers
    const sitemapData = {
        pages: [
            { url: window.location.origin + '/#home', changefreq: 'weekly', priority: '1.0' },
            { url: window.location.origin + '/#posts', changefreq: 'daily', priority: '0.8' },
            { url: window.location.origin + '/#about', changefreq: 'monthly', priority: '0.6' }
        ],
        posts: allPosts.map(post => ({
            url: window.location.origin + `/#post/${post.id}`,
            lastmod: post.date,
            changefreq: 'monthly',
            priority: '0.7'
        }))
    };
    
    // Store in window for potential sitemap generation
    window.sitemapData = sitemapData;
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
        // Update theme-color meta tag
        let themeColor = document.querySelector('meta[name="theme-color"]');
        if (themeColor) themeColor.content = '#1a1a1a';
	} else {
        document.documentElement.removeAttribute('data-theme');
        let themeColor = document.querySelector('meta[name="theme-color"]');
        if (themeColor) themeColor.content = '#2c3e50';
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
	button.setAttribute('aria-label', currentTheme === 'light' ? 
	    (currentLanguage === 'fi' ? 'Vaihda tumma teema' : 'Switch to dark theme') : 
	    (currentLanguage === 'fi' ? 'Vaihda vaalea teema' : 'Switch to light theme'));
}

// **ADD THIS ENTIRE FUNCTION TO YOUR SCRIPT.JS**
// Update all page texts based on current language
function updatePageTexts() {
    const texts = {
        fi: {
            home: 'Etusivu', posts: 'Artikkelit', search: 'Haku', about: 'Tietoja',
            postsTitle: 'Blogiartikkelit',
            postsSubtitle: 'Oppaasi Linux-järjestelmiin ja Home Assistant automaatioon',
            searchTitle: 'Hae artikkeleita',
            searchPlaceholder: 'Hae artikkeleita otsikon, sisällön tai tagien perusteella...',
            searchLabel: 'Hakusana', searchInstructions: 'Kirjoita hakusana löytääksesi artikkeleita',
            filterTitle: 'Suodata tageilla:', clearButton: 'Tyhjennä kaikki',
            sidebarPostsTitle: 'Artikkelit', sidebarRecentTitle: 'Viimeisimmät artikkelit',
            postsLoaded: 'artikkelia ladattu', loading: 'Ladataan...', // ADDED MISSING COMMA
            backButton: '← Takaisin',
            backToHome: '← Takaisin',
            backToPosts: '← Takaisin'
            footerLicense: 'Lisensoitu',
            footerLicenseLink: 'MIT-lisenssillä',
            paginationLabel: 'Artikkeleita sivulla:'
        },
        en: {
            home: 'Home', posts: 'Posts', search: 'Search', about: 'About',
            postsTitle: 'Blog Posts',
            postsSubtitle: 'Your guide to Linux systems and Home Assistant automation',
            searchTitle: 'Search Posts',
            searchPlaceholder: 'Search posts by title, content, or tags...',
            searchLabel: 'Search term', searchInstructions: 'Type search term to find posts',
            filterTitle: 'Filter by tags:', clearButton: 'Clear All',
            sidebarPostsTitle: 'Posts', sidebarRecentTitle: 'Recent Posts',
            postsLoaded: 'posts loaded', loading: 'Loading...', // ADDED MISSING COMMA
            backButton: '← Back',
            backToHome: '← Back', 
            backToPosts: '← Back'
            footerLicense: 'Licensed under',
            footerLicenseLink: 'The MIT License (MIT)',
            paginationLabel: 'Posts per page:'
        }
    };
    
    // MOVED THIS LINE BEFORE using 't' variable
    const t = texts[currentLanguage];
    
    // Update all elements if they exist
    const elements = [
        ['nav-home', t.home], ['nav-posts', t.posts], ['nav-search', t.search], ['nav-about', t.about],
        ['posts-title', t.postsTitle], ['posts-subtitle', t.postsSubtitle],
        ['search-title', t.searchTitle], ['search-label', t.searchLabel],
        ['search-instructions', t.searchInstructions], ['filter-title', t.filterTitle],
        ['clear-button', t.clearButton], ['sidebar-posts-title', t.sidebarPostsTitle],
        ['sidebar-recent-title', t.sidebarRecentTitle]
        ['footer-license-text', t.footerLicense],
        ['footer-license-link', t.footerLicenseLink],
        ['pagination-label', t.paginationLabel],
        ['pagination-label-bottom', t.paginationLabel]
    ];
    
    elements.forEach(([id, text]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    });
    
    // Update search input placeholder
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.placeholder = t.searchPlaceholder;
    
    // Update back buttons (SIMPLIFIED TO ONE VERSION)
    document.querySelectorAll('.back-button').forEach(btn => {
        btn.textContent = t.backButton;
        btn.setAttribute('aria-label', currentLanguage === 'fi' ? 'Takaisin' : 'Back');
    });
}

/*function updatePageTexts() {
    const texts = {
        fi: {
            // Navigation
            home: 'Etusivu',
            posts: 'Artikkelit', 
            search: 'Haku',
            about: 'Tietoja',
            // Posts page
            postsTitle: 'Blogiartikkelit',
            postsSubtitle: 'Oppaasi Linux-järjestelmiin ja Home Assistant automaatioon',
            // Search page
            searchTitle: 'Hae artikkeleita',
            searchPlaceholder: 'Hae artikkeleita otsikon, sisällön tai tagien perusteella...',
            searchLabel: 'Hakusana',
            searchInstructions: 'Kirjoita hakusana löytääksesi artikkeleita',
            filterTitle: 'Suodata tageilla:',
            clearButton: 'Tyhjennä kaikki',
            // Sidebar
            sidebarPostsTitle: 'Artikkelit',
            sidebarRecentTitle: 'Viimeisimmät artikkelit',
            // Other
            postsLoaded: 'artikkelia ladattu',
            loading: 'Ladataan...'
        },
        en: {
            // Navigation
            home: 'Home',
            posts: 'Posts',
            search: 'Search', 
            about: 'About',
            // Posts page
            postsTitle: 'Blog Posts',
            postsSubtitle: 'Your guide to Linux systems and Home Assistant automation',
            // Search page
            searchTitle: 'Search Posts',
            searchPlaceholder: 'Search posts by title, content, or tags...',
            searchLabel: 'Search term',
            searchInstructions: 'Type search term to find posts',
            filterTitle: 'Filter by tags:',
            clearButton: 'Clear All',
            // Sidebar
            sidebarPostsTitle: 'Posts',
            sidebarRecentTitle: 'Recent Posts',
            // Other
            postsLoaded: 'posts loaded',
            loading: 'Loading...'
        }
    };
    
    const t = texts[currentLanguage];
    
    // Update navigation
    document.getElementById('nav-home').textContent = t.home;
    document.getElementById('nav-posts').textContent = t.posts;
    document.getElementById('nav-search').textContent = t.search;
    document.getElementById('nav-about').textContent = t.about;
    
    // Update posts page
    const postsTitle = document.getElementById('posts-title');
    const postsSubtitle = document.getElementById('posts-subtitle');
    if (postsTitle) postsTitle.textContent = t.postsTitle;
    if (postsSubtitle) postsSubtitle.textContent = t.postsSubtitle;
    
    // Update search page
    const searchTitle = document.getElementById('search-title');
    const searchInput = document.getElementById('search-input');
    const searchLabel = document.getElementById('search-label');
    const searchInstructions = document.getElementById('search-instructions');
    const filterTitle = document.getElementById('filter-title');
    const clearButton = document.getElementById('clear-button');
    
    if (searchTitle) searchTitle.textContent = t.searchTitle;
    if (searchInput) searchInput.placeholder = t.searchPlaceholder;
    if (searchLabel) searchLabel.textContent = t.searchLabel;
    if (searchInstructions) searchInstructions.textContent = t.searchInstructions;
    if (filterTitle) filterTitle.textContent = t.filterTitle;
    if (clearButton) clearButton.textContent = t.clearButton;
    
    // Update sidebar
    const sidebarPostsTitle = document.getElementById('sidebar-posts-title');
    const sidebarRecentTitle = document.getElementById('sidebar-recent-title');
    if (sidebarPostsTitle) sidebarPostsTitle.textContent = t.sidebarPostsTitle;
    if (sidebarRecentTitle) sidebarRecentTitle.textContent = t.sidebarRecentTitle;
}*/

// **NEW FUNCTION** - Update navigation text based on language
function updateNavigationText() {
    const navTexts = {
        fi: {
            home: 'Etusivu',
            posts: 'Artikkelit', 
            search: 'Haku',
            about: 'Tietoja'
        },
        en: {
            home: 'Home',
            posts: 'Posts',
            search: 'Search', 
            about: 'About'
        }
    };
    
    const texts = navTexts[currentLanguage];
    document.getElementById('nav-home').textContent = texts.home;
    document.getElementById('nav-posts').textContent = texts.posts;
    document.getElementById('nav-search').textContent = texts.search;
    document.getElementById('nav-about').textContent = texts.about;
}

// Load frontpage with SEO improvements
async function loadFrontpage() {
	try {
        const frontpageFile = frontpageFiles[currentLanguage] || frontpageFiles.fi;
        const response = await fetch(`/posts/${frontpageFile}`);
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const fileContent = await response.text();
        const { metadata, content } = parseYAML(fileContent);
        
        return {
            title: metadata.title || (currentLanguage === 'fi' ? 'Tervetuloa' : 'Welcome'),
            description: metadata.description || '',
            content: sanitizeHTML(marked.parse(content))
        };
	} catch (error) {
        console.error('Error loading frontpage:', error);
        return {
            title: currentLanguage === 'fi' ? 'Tervetuloa' : 'Welcome',
            description: '',
            content: `<p>${currentLanguage === 'fi' ? 'Etusivua ei voitu ladata.' : 'Frontpage could not be loaded.'}</p>`
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
            title: metadata.title || (currentLanguage === 'fi' ? 'Tietoja' : 'About'),
            description: metadata.description || '',
            content: sanitizeHTML(marked.parse(content))
        };
	} catch (error) {
        console.error('Error loading about page:', error);
        return {
            title: currentLanguage === 'fi' ? 'Tietoja' : 'About',
            description: '',
            content: `<p>${currentLanguage === 'fi' ? 'Tietoja-sivua ei voitu ladata.' : 'About page could not be loaded.'}</p>`
        };
	}
}

// Show frontpage with SEO enhancements
async function showFrontpage() {
	hideAllPages();
	document.getElementById('frontpage-page').style.display = 'block';
	document.body.classList.add('frontpage-active');
	
	// SEO: Update URL and meta tags
	const baseUrl = window.location.origin + window.location.pathname.replace(/\/+$/, '');
	window.history.replaceState({page: 'home'}, '', baseUrl + '/#home');
	
	const frontpageData = await loadFrontpage();
	
	// SEO: Update meta tags for frontpage
	const title = currentLanguage === 'fi' ? 
	    'Eddy\'s Homepages — Linux-järjestelmät ja Home Assistant -oppaat' :
	    'Eddy\'s Homepages — Linux Systems & Home Assistant Guides';
	const description = frontpageData.description || (currentLanguage === 'fi' ? 
	    'Askel askeleelta -oppaat Linux-järjestelmistä, Raspberry Pi:stä, Dockerista ja Home Assistant automaatiosta.' :
	    'Step-by-step guides on Linux systems, Raspberry Pi, Docker, and Home Assistant automation.');
	
	updatePageMeta(title, description, baseUrl + '/', 'website');
	
	// Update breadcrumb
	updateBreadcrumbSchema([{
	    name: currentLanguage === 'fi' ? 'Etusivu' : 'Home',
	    url: baseUrl + '/'
	}]);
	
	document.getElementById('frontpage-content').innerHTML = `
        <div class="frontpage-layout">
            <div class="frontpage-hero">
                <img src="/assets/profile.jpg" alt="${currentLanguage === 'fi' ? 'Profiilikuva' : 'Profile Picture'}" class="profile-image" onerror="this.style.display='none'">
                <h1>${frontpageData.title || 'Esa P'}</h1>
                <div>${frontpageData.content}</div>
                <div class="social-links">
                    <a href="https://facebook.com/esa.porttila" title="Facebook" target="_blank" rel="noopener"><i class="fab fa-facebook fa-lg" aria-hidden="true"></i><span class="sr-only">Facebook</span></a>
                    <a href="https://github.com/eddyshomepages/" title="GitHub" target="_blank" rel="noopener"><i class="fab fa-github fa-lg" aria-hidden="true"></i><span class="sr-only">GitHub</span></a>
                    <a href="https://fi.linkedin.com/in/esaporttila/" title="LinkedIn" target="_blank" rel="noopener"><i class="fab fa-linkedin fa-lg" aria-hidden="true"></i><span class="sr-only">LinkedIn</span></a>
                    <a href="mailto:pikaeetu72@gmail.com" title="Email"><i class="fas fa-envelope fa-lg" aria-hidden="true"></i><span class="sr-only">Email</span></a>
                    <a href="https://mastodontti.fi/@esa_p/" title="Mastodon" target="_blank" rel="noopener"><i class="fab fa-mastodon fa-lg" aria-hidden="true"></i><span class="sr-only">Mastodon</span></a>
                    <a href="https://t.me/esa_p/" title="Telegram" target="_blank" rel="noopener"><i class="fab fa-telegram fa-lg" aria-hidden="true"></i><span class="sr-only">Telegram</span></a>
                    <a href="#" onclick="downloadRSSFeed(); return false;" title="${currentLanguage === 'fi' ? 'Lataa RSS-syöte' : 'Download RSS Feed'}"><i class="fas fa-rss fa-lg" aria-hidden="true"></i><span class="sr-only">RSS</span></a>
                </div>
            </div>
        </div>
	`;
	
	window.scrollTo(0, 0);
	setLinksNewTab();
}

// Show posts page with SEO improvements
function showPosts() {
	hideAllPages();
	document.getElementById('posts-content').style.display = 'block';
	document.body.classList.remove('frontpage-active');
	
	// Ensure sidebar is visible on posts page
	document.querySelector('.sidebar').style.display = 'flex';
	
	// SEO: Update URL and meta tags
	const baseUrl = window.location.origin + window.location.pathname.replace(/\/+$/, '');
	window.history.replaceState({page: 'posts'}, '', baseUrl + '/#posts');
	
	const title = currentLanguage === 'fi' ? 
	    'Blogiartikkelit — Eddy\'s Homepages' :
	    'Blog Posts — Eddy\'s Homepages';
	const description = currentLanguage === 'fi' ?
	    `Selaa ${allPosts.length} artikkelia Linux-järjestelmistä, Home Assistantista ja kotiautomaatiosta.` :
	    `Browse ${allPosts.length} articles about Linux systems, Home Assistant and home automation.`;
	
	updatePageMeta(title, description, baseUrl + '/#posts');
	
	// Update breadcrumb
	updateBreadcrumbSchema([
	    { name: currentLanguage === 'fi' ? 'Etusivu' : 'Home', url: baseUrl + '/' },
	    { name: currentLanguage === 'fi' ? 'Artikkelit' : 'Posts', url: baseUrl + '/#posts' }
	]);
	
	if (allPosts.length > 0) {
        displayPosts(allPosts);
	}
	
	window.scrollTo(0, 0);
}

// Show search page with SEO improvements
function showSearch() {
	hideAllPages();
	document.getElementById('search-page').style.display = 'block';
	document.querySelector('.back-button').style.display = 'block';
	document.body.classList.remove('frontpage-active');
	
	// SEO: Update URL and meta tags
	const baseUrl = window.location.origin + window.location.pathname.replace(/\/+$/, '');
	window.history.replaceState({page: 'search'}, '', baseUrl + '/#search');
	
	const title = currentLanguage === 'fi' ? 
	    'Hae artikkeleita — Eddy\'s Homepages' :
	    'Search Posts — Eddy\'s Homepages';
	const description = currentLanguage === 'fi' ?
	    'Hae artikkeleita otsikon, sisällön tai tagien perusteella.' :
	    'Search articles by title, content or tags.';
	
	updatePageMeta(title, description, baseUrl + '/#search');
	
	// Update breadcrumb
	updateBreadcrumbSchema([
	    { name: currentLanguage === 'fi' ? 'Etusivu' : 'Home', url: baseUrl + '/' },
	    { name: currentLanguage === 'fi' ? 'Haku' : 'Search', url: baseUrl + '/#search' }
	]);
	
	if (allTags.length === 0) {
        generateTagFilters();
	}
}

// Show about page with SEO improvements
async function showAbout() {
	hideAllPages();
	document.getElementById('about-page').style.display = 'block';
	document.querySelector('.back-button').style.display = 'block';
	document.body.classList.remove('frontpage-active');
	
	// SEO: Update URL and meta tags
	const baseUrl = window.location.origin + window.location.pathname.replace(/\/+$/, '');
	window.history.replaceState({page: 'about'}, '', baseUrl + '/#about');
	
	const aboutData = await loadAboutPage();
	
	const title = currentLanguage === 'fi' ? 
	    `${aboutData.title} — Eddy's Homepages` :
	    `${aboutData.title} — Eddy's Homepages`;
	const description = aboutData.description || (currentLanguage === 'fi' ?
	    'Tietoja Esa P:stä ja Linux-asiantuntemuksesta.' :
	    'About Esa P and Linux expertise.');
	
	updatePageMeta(title, description, baseUrl + '/#about');
	
	// Update breadcrumb
	updateBreadcrumbSchema([
	    { name: currentLanguage === 'fi' ? 'Etusivu' : 'Home', url: baseUrl + '/' },
	    { name: aboutData.title, url: baseUrl + '/#about' }
	]);
	
	document.getElementById('about-content').innerHTML = `
        <h1>${aboutData.title}</h1>
        <div>${aboutData.content}</div>
	`;
	
	window.scrollTo(0, 0);
	setLinksNewTab();
}

// Show post with comprehensive SEO enhancements
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
	
	// SEO: Update URL and comprehensive meta tags
	const baseUrl = window.location.origin + window.location.pathname.replace(/\/+$/, '');
	const postUrl = baseUrl + `/#post/${postId}`;
	
	window.history.replaceState({page: 'post', postId: postId}, post.title, postUrl);
	
	// SEO: Comprehensive meta tag updates for the post
	const postTitle = `${post.title} — Eddy's Homepages`;
	const postDescription = post.description || post.excerpt;
	const postKeywords = post.tags.join(', ');
	
	updatePageMeta(postTitle, postDescription, postUrl, 'article', postKeywords);
	
	// SEO: Add article structured data
	const articleSchema = generateArticleSchema(post);
	let existingSchema = document.getElementById('article-schema');
	if (!existingSchema) {
	    existingSchema = document.createElement('script');
	    existingSchema.type = 'application/ld+json';
	    existingSchema.id = 'article-schema';
	    document.head.appendChild(existingSchema);
	}
	existingSchema.textContent = JSON.stringify(articleSchema);
	
	// Update breadcrumb
	updateBreadcrumbSchema([
	    { name: currentLanguage === 'fi' ? 'Etusivu' : 'Home', url: baseUrl + '/' },
	    { name: currentLanguage === 'fi' ? 'Artikkelit' : 'Posts', url: baseUrl + '/#posts' },
	    { name: post.title, url: postUrl }
	]);
	
	// Enhanced article content with better semantic HTML
	document.getElementById('full-post-content').innerHTML = `
	    <header class="post-header">
	        <h1 itemprop="headline">${post.title}</h1>
	        <div class="post-meta" style="margin-bottom: 2rem;">
	            <p><strong>${currentLanguage === 'fi' ? 'Päivämäärä' : 'Date'}:</strong> 
	                <time datetime="${post.date}" itemprop="datePublished">${post.date}</time>
	            </p>
	            <p><strong>${currentLanguage === 'fi' ? 'Tagit' : 'Tags'}:</strong> 
	                <span itemprop="keywords">${post.tags.join(', ')}</span>
	            </p>
	        </div>
	        ${generateShareButtons(post.title, post.id)}
	        <hr style="margin: 2rem 0;">
	    </header>
	    <div itemprop="articleBody">${post.content}</div>
	`;

	setTimeout(() => {
	    loadUtterancesComments(post.id);
	    setLinksNewTab();
	}, 100);

	window.scrollTo(0, 0);
	setLinksNewTab();
}

function hideAllPages() {
	document.getElementById('frontpage-page').style.display = 'none';
	document.getElementById('posts-content').style.display = 'none';
	document.getElementById('full-post').style.display = 'none';
	document.getElementById('about-page').style.display = 'none';
	document.getElementById('search-page').style.display = 'none';
	document.querySelector('.back-button').style.display = 'none';
	
	// Remove any existing article schema when hiding pages
	const articleSchema = document.getElementById('article-schema');
	if (articleSchema) {
	    articleSchema.remove();
	}
}

// Handle initial routing based on URL hash with SEO improvements
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
        // Handle unknown routes - redirect to frontpage
        showFrontpage();
	}
}

// Enhanced tag filter generation
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
        <button class="tag-filter-button" onclick="toggleTagFilter('${tag}')" 
                aria-pressed="false" title="${currentLanguage === 'fi' ? 'Suodata tagilla' : 'Filter by tag'} ${tag}">
            ${tag} (${count})
        </button>
	`).join('');
	
	// Add show more/less button if there are more than showLimit tags
	if (allTags.length > showLimit) {
	if (showingAll) {
	    buttonsHTML += `
		<button class="tag-show-toggle" onclick="toggleShowAllTags()">
		    ${currentLanguage === 'fi' ? 'Näytä vähemmän tageja' : 'Show Less Tags'}
		</button>
	    `;
	} else {
	    buttonsHTML += `
		<button class="tag-show-toggle" onclick="toggleShowAllTags()">
		    ${currentLanguage === 'fi' ? `Näytä kaikki ${allTags.length} tagia` : `Show All ${allTags.length} Tags`}
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

// Enhanced tag filter toggle
function toggleTagFilter(tag) {
	const button = event.target;
	
	if (activeTagFilters.has(tag)) {
        activeTagFilters.delete(tag);
        button.classList.remove('active');
        button.setAttribute('aria-pressed', 'false');
	} else {
        activeTagFilters.add(tag);
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');
	}
	
	performSearch();
}

// Perform search with better UX
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

// Display search results with better accessibility
function displaySearchResults(posts) {
	const container = document.getElementById('search-results');
	
	if (posts.length === 0) {
        container.innerHTML = `<p>${currentLanguage === 'fi' ? 'Hakuehdoillasi ei löytynyt artikkeleita.' : 'No posts found matching your search criteria.'}</p>`;
        return;
	}
	
	const resultText = currentLanguage === 'fi' ? 
	    `${posts.length} artikkeli${posts.length !== 1 ? 'a' : ''} löytyi` :
	    `${posts.length} post${posts.length !== 1 ? 's' : ''} found`;
	
	container.innerHTML = `
        <p><strong>${resultText}</strong></p>
        ${posts.map(post => `
            <article class="search-result" onclick="showPost('${post.id}')" role="button" tabindex="0" onkeypress="if(event.key==='Enter')showPost('${post.id}')">
                <h3>${highlightText(post.title, searchQuery)}</h3>
                <div class="post-meta">
                    <span>📅 ${post.date}</span>
                    <span>🏷️ ${post.tags.slice(0, 3).join(', ')}</span>
                </div>
                <p>${highlightText(post.excerpt, searchQuery)}</p>
                <div class="post-tags">
                    ${post.tags.slice(0, 8).map(tag => `<span class="tag ${activeTagFilters.has(tag) ? 'active' : ''}">${tag}</span>`).join('')}
                </div>
            </article>
        `).join('')}
	`;
}

// Highlight search terms
function highlightText(text, query) {
	if (!query) return text;
	
	const regex = new RegExp(`(${query})`, 'gi');
	return text.replace(regex, '<mark class="search-highlight">$1</mark>');
}

// Clear search with proper ARIA updates
function clearSearch() {
	document.getElementById('search-input').value = '';
	searchQuery = '';
	activeTagFilters.clear();
	
	document.querySelectorAll('.tag-filter-button').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
	});
	
	const clearText = currentLanguage === 'fi' ?
	    'Syötä hakusana tai valitse tagit löytääksesi artikkeleita...' :
	    'Enter a search term or select tags to find posts...';
	
	document.getElementById('search-results').innerHTML = `<p>${clearText}</p>`;
}

// Enhanced post loading with better error handling and SEO data
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
            description: metadata.description || stripMarkdown(content).substring(0, 160) + '...',
            excerpt: stripMarkdown(content).substring(0, 150) + '...',
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

// Enhanced markdown stripping
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

// Enhanced HTML sanitization
function sanitizeHTML(html) {
    if (typeof DOMPurify !== 'undefined') {
        return DOMPurify.sanitize(html, {
            ADD_TAGS: ['mark'], // Allow search highlights
            ADD_ATTR: ['itemscope', 'itemtype', 'itemprop'] // Allow schema.org attributes
        });
    } else {
        console.warn('DOMPurify not loaded, using fallback sanitization');
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }
}

// Development mode detection
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' || 
                     window.location.hostname.includes('192.168.');

function debugLog(...args) {
    if (isDevelopment) {
        console.log(...args);
    }
}

// Enhanced posts display with better semantic HTML
// Display posts with original styling
function displayPosts(posts) {
	const startIndex = (currentPage - 1) * postsPerPage;
	const endIndex = startIndex + postsPerPage;
	const paginatedPosts = posts.slice(startIndex, endIndex);
	
	const container = document.getElementById('posts-display');
	container.innerHTML = paginatedPosts.map(post => `
        <div class="post" onclick="showPost('${post.id}')" role="button" tabindex="0" onkeypress="if(event.key==='Enter')showPost('${post.id}')">
            <h2 class="post-title">${post.title}</h2>
            <div class="post-meta">
                <span>📅 ${post.date}</span>
                <span>🏷️ ${post.tags.length} ${currentLanguage === 'fi' ? 'tagia' : 'tags'}</span>
            </div>
            <p class="post-excerpt">${post.excerpt}</p>
            <div class="post-tags">
                ${post.tags.slice(0, 8).map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
	`).join('');
	
	updatePaginationControls(posts.length);
}

// Enhanced pagination with better accessibility
function updatePaginationControls(totalPosts) {
	const totalPages = Math.ceil(totalPosts / postsPerPage);
	
	const pageText = currentLanguage === 'fi' ?
	    `Sivu ${currentPage}/${totalPages} (${totalPosts} artikkelia)` :
	    `Page ${currentPage} of ${totalPages} (${totalPosts} posts)`;
	
	document.getElementById('page-info').textContent = pageText;
	document.getElementById('page-info-bottom').textContent = pageText;

	let buttonsHTML = '';
	
	// Previous button
	const prevText = currentLanguage === 'fi' ? '← Edellinen' : '← Previous';
	buttonsHTML += `<button class="page-btn" onclick="goToPage(${currentPage - 1})" 
        ${currentPage === 1 ? 'disabled aria-disabled="true"' : ''} 
        aria-label="${currentLanguage === 'fi' ? 'Edellinen sivu' : 'Previous page'}">${prevText}</button>`;
	
	// Page numbers with better logic for large page counts
	for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            const isCurrentPage = i === currentPage;
            buttonsHTML += `<button class="page-btn ${isCurrentPage ? 'active' : ''}" 
                onclick="goToPage(${i})" ${isCurrentPage ? 'aria-current="page"' : ''}
                aria-label="${currentLanguage === 'fi' ? `Sivu ${i}` : `Page ${i}`}">${i}</button>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            buttonsHTML += `<span aria-hidden="true">...</span>`;
        }
	}
	
	// Next button
	const nextText = currentLanguage === 'fi' ? 'Seuraava →' : 'Next →';
	buttonsHTML += `<button class="page-btn" onclick="goToPage(${currentPage + 1})" 
        ${currentPage === totalPages ? 'disabled aria-disabled="true"' : ''}
        aria-label="${currentLanguage === 'fi' ? 'Seuraava sivu' : 'Next page'}">${nextText}</button>`;
	
	document.getElementById('pagination-buttons').innerHTML = buttonsHTML;
	document.getElementById('pagination-buttons-bottom').innerHTML = buttonsHTML;
}

// Enhanced page navigation
function goToPage(page) {
	const totalPages = Math.ceil(allPosts.length / postsPerPage);
	if (page < 1 || page > totalPages) return;
	
	currentPage = page;
	displayPosts(allPosts);
	
	// Scroll to top of posts for better UX
	document.getElementById('posts-display').scrollIntoView({ behavior: 'smooth' });
}

// Change posts per page
function changePostsPerPage(selectElement) {
	postsPerPage = parseInt(selectElement.value);
	currentPage = 1;
	displayPosts(allPosts);
	
	const otherSelectId = selectElement.id === 'posts-per-page' ? 'posts-per-page-bottom' : 'posts-per-page';
	document.getElementById(otherSelectId).value = selectElement.value;
}

// Enhanced share functions with better error handling
function sharePost(platform, title, url) {
	const encodedTitle = encodeURIComponent(title);
	const encodedUrl = encodeURIComponent(url);
	
	const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
        whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
        instagram: `https://www.instagram.com/`,
        snapchat: `https://www.snapchat.com/scan?attachmentUrl=${encodedUrl}`,
        mastodon: `https://mastodon.social/share?text=${encodedTitle}%20${encodedUrl}`,
        email: `mailto:?subject=${encodedTitle}&body=${encodedTitle}%0A${encodedUrl}`
	};
	
	if (shareUrls[platform]) {
        try {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400,noopener,noreferrer');
        } catch (error) {
            console.error('Error opening share window:', error);
            // Fallback: navigate to the share URL
            window.open(shareUrls[platform], '_blank');
        }
	}
}

// Enhanced clipboard copy with better feedback
function copyToClipboard(url) {
	if (navigator.clipboard && window.isSecureContext) {
        // Modern async clipboard API
        navigator.clipboard.writeText(url).then(() => {
            showCopyFeedback(true);
        }).catch(() => {
            fallbackCopyToClipboard(url);
        });
	} else {
        // Fallback for older browsers or non-secure contexts
        fallbackCopyToClipboard(url);
	}
}

function fallbackCopyToClipboard(url) {
	const textArea = document.createElement('textarea');
	textArea.value = url;
	textArea.style.position = 'fixed';
	textArea.style.left = '-999999px';
	textArea.style.top = '-999999px';
	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();
	
	try {
        const successful = document.execCommand('copy');
        showCopyFeedback(successful);
	} catch (error) {
        console.error('Error copying to clipboard:', error);
        showCopyFeedback(false);
	} finally {
        document.body.removeChild(textArea);
	}
}

function showCopyFeedback(success) {
	const copyBtn = document.querySelector('.share-btn.copy');
	if (!copyBtn) return;
	
	const originalContent = copyBtn.innerHTML;
	const feedbackText = success ? 
	    (currentLanguage === 'fi' ? 'Kopioitu!' : 'Copied!') :
	    (currentLanguage === 'fi' ? 'Virhe!' : 'Error!');
	
	copyBtn.innerHTML = success ? '<i class="fas fa-check"></i>' : '<i class="fas fa-times"></i>';
	copyBtn.classList.add(success ? 'copied' : 'error');
	copyBtn.title = feedbackText;
	
	setTimeout(() => {
        copyBtn.innerHTML = originalContent;
        copyBtn.classList.remove('copied', 'error');
        copyBtn.title = currentLanguage === 'fi' ? 'Kopioi linkki' : 'Copy Link';
	}, 2000);
}

// Enhanced share buttons generation
function generateShareButtons(postTitle, postId) {
	const cleanTitle = postTitle.replace(/'/g, "\\'");
	const baseUrl = window.location.origin + window.location.pathname.replace(/\/+$/, '');
	const currentUrl = `${baseUrl}/#post/${postId}`;
	
	const shareText = currentLanguage === 'fi' ? 'Jaa tämä artikkeli:' : 'Share this post:';
	
	return `
        <div class="share-buttons" role="group" aria-label="${shareText}">
            <span>${shareText}</span>
            <a href="#" class="share-btn facebook" onclick="sharePost('facebook', '${cleanTitle}', '${currentUrl}'); return false;" 
               title="${currentLanguage === 'fi' ? 'Jaa Facebookissa' : 'Share on Facebook'}" aria-label="Facebook">
                <i class="fab fa-facebook-f" aria-hidden="true"></i>
            </a>
            <a href="#" class="share-btn twitter" onclick="sharePost('twitter', '${cleanTitle}', '${currentUrl}'); return false;" 
               title="${currentLanguage === 'fi' ? 'Jaa Twitterissä' : 'Share on Twitter'}" aria-label="Twitter">
                <i class="fab fa-twitter" aria-hidden="true"></i>
            </a>
            <a href="#" class="share-btn instagram" onclick="sharePost('instagram', '${cleanTitle}', '${currentUrl}'); return false;" 
               title="${currentLanguage === 'fi' ? 'Jaa Instagramissa' : 'Share on Instagram'}" aria-label="Instagram">
                <i class="fab fa-instagram" aria-hidden="true"></i>
            </a>
            <a href="#" class="share-btn linkedin" onclick="sharePost('linkedin', '${cleanTitle}', '${currentUrl}'); return false;" 
               title="${currentLanguage === 'fi' ? 'Jaa LinkedInissä' : 'Share on LinkedIn'}" aria-label="LinkedIn">
                <i class="fab fa-linkedin-in" aria-hidden="true"></i>
            </a>
            <a href="#" class="share-btn snapchat" onclick="sharePost('snapchat', '${cleanTitle}', '${currentUrl}'); return false;" 
               title="${currentLanguage === 'fi' ? 'Jaa Snapchatissa' : 'Share on Snapchat'}" aria-label="Snapchat">
                <i class="fab fa-snapchat-ghost" aria-hidden="true"></i>
            </a>
            <a href="#" class="share-btn mastodon" onclick="sharePost('mastodon', '${cleanTitle}', '${currentUrl}'); return false;" 
               title="${currentLanguage === 'fi' ? 'Jaa Mastodonissa' : 'Share on Mastodon'}" aria-label="Mastodon">
                <i class="fab fa-mastodon" aria-hidden="true"></i>
            </a>
            <a href="#" class="share-btn telegram" onclick="sharePost('telegram', '${cleanTitle}', '${currentUrl}'); return false;" 
               title="${currentLanguage === 'fi' ? 'Jaa Telegramissa' : 'Share on Telegram'}" aria-label="Telegram">
                <i class="fab fa-telegram-plane" aria-hidden="true"></i>
            </a>
            <a href="#" class="share-btn whatsapp" onclick="sharePost('whatsapp', '${cleanTitle}', '${currentUrl}'); return false;" 
               title="${currentLanguage === 'fi' ? 'Jaa WhatsAppissa' : 'Share on WhatsApp'}" aria-label="WhatsApp">
                <i class="fab fa-whatsapp" aria-hidden="true"></i>
            </a>
            <a href="#" class="share-btn email" onclick="sharePost('email', '${cleanTitle}', '${currentUrl}'); return false;" 
               title="${currentLanguage === 'fi' ? 'Jaa sähköpostilla' : 'Share via Email'}" aria-label="Email">
                <i class="fas fa-envelope" aria-hidden="true"></i>
            </a>
            <a href="#" class="share-btn copy" onclick="copyToClipboard('${currentUrl}'); return false;" 
               title="${currentLanguage === 'fi' ? 'Kopioi linkki' : 'Copy Link'}" aria-label="Copy Link">
                <i class="fas fa-link" aria-hidden="true"></i>
            </a>
        </div>
	`;
}

// Enhanced RSS Feed Generation with proper XML formatting
function generateRSSFeed() {
	const baseUrl = window.location.origin;
	const feedUrl = `${baseUrl}/rss.xml`;
	const currentDate = new Date().toUTCString();
	const language = currentLanguage === 'fi' ? 'fi-FI' : 'en-US';
	
	const sortedPosts = [...allPosts].sort((a, b) => new Date(b.date) - new Date(a.date));
	const recentPosts = sortedPosts.slice(0, 20);
	
	let rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
    <channel>
        <title><![CDATA[Eddy's Homepages]]></title>
        <description><![CDATA[${currentLanguage === 'fi' ? 'Oppaasi Linux-järjestelmiin ja Home Assistant automaatioon' : 'Your guide to Linux systems and Home Assistant automation'}]]></description>
        <link>${baseUrl}</link>
        <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
        <language>${language}</language>
        <lastBuildDate>${currentDate}</lastBuildDate>
        <generator>Eddy's Homepages Static Generator</generator>
        <webMaster>pikaeetu72@gmail.com (Esa P)</webMaster>
        <managingEditor>pikaeetu72@gmail.com (Esa P)</managingEditor>
        <category>Technology</category>
        <category>Linux</category>
        <category>Home Automation</category>
        <ttl>1440</ttl>
        <image>
            <url>${baseUrl}/assets/profile.jpg</url>
            <title>Eddy's Homepages</title>
            <link>${baseUrl}</link>
        </image>
`;

	recentPosts.forEach(post => {
        const postUrl = `${baseUrl}/#post/${post.id}`;
        const pubDate = new Date(post.date).toUTCString();
        const cleanExcerpt = post.excerpt.replace(/<[^>]*>/g, '').substring(0, 200) + '...';
        const cleanContent = post.content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        
        rssXml += `
        <item>
            <title><![CDATA[${post.title}]]></title>
            <description><![CDATA[${cleanExcerpt}]]></description>
            <content:encoded><![CDATA[${cleanContent}]]></content:encoded>
            <link>${postUrl}</link>
            <guid isPermaLink="true">${postUrl}</guid>
            <pubDate>${pubDate}</pubDate>
            <author>pikaeetu72@gmail.com (Esa P)</author>`;
        
        post.tags.forEach(tag => {
            rssXml += `
            <category><![CDATA[${tag}]]></category>`;
        });
        
        rssXml += `
        </item>`;
	});
	
	rssXml += `
    </channel>
</rss>`;
	
	return rssXml;
}

// Enhanced sitemap generation
function generateSitemap() {
    const baseUrl = window.location.origin;
    const currentDate = new Date().toISOString().split('T')[0];
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
    <url>
        <loc>${baseUrl}/</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
        <xhtml:link rel="alternate" hreflang="fi" href="${baseUrl}/"/>
        <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en"/>
    </url>
    <url>
        <loc>${baseUrl}/#posts</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${baseUrl}/#about</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    <url>
        <loc>${baseUrl}/#search</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.5</priority>
    </url>`;

    // Add individual posts
    allPosts.forEach(post => {
        const postDate = new Date(post.date).toISOString().split('T')[0];
        sitemap += `
    <url>
        <loc>${baseUrl}/#post/${post.id}</loc>
        <lastmod>${postDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>`;
    });

    sitemap += `
</urlset>`;

    return sitemap;
}

// Download RSS feed
function downloadRSSFeed() {
	const rssContent = generateRSSFeed();
	const blob = new Blob([rssContent], { type: 'application/rss+xml;charset=utf-8' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = 'rss.xml';
	a.style.display = 'none';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

// Enhanced Utterances comments loading
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
    
    // Add loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.textContent = currentLanguage === 'fi' ? 'Ladataan kommentteja...' : 'Loading comments...';
    loadingDiv.style.textAlign = 'center';
    loadingDiv.style.padding = '2rem';
    loadingDiv.style.color = '#666';
    
    commentsDiv.appendChild(loadingDiv);
    commentsDiv.appendChild(script);
    
    // Remove loading indicator after script loads
    script.onload = () => {
        setTimeout(() => {
            if (loadingDiv.parentNode) {
                loadingDiv.remove();
            }
        }, 1000);
    };
    
    document.getElementById('full-post-content').appendChild(commentsDiv);
}

// Enhanced initialization with error handling and performance improvements
async function init() {
	try {
        debugLog('Initializing blog version 3.0 with SEO enhancements...');
        
        initTheme();
        
        // Set language from localStorage or browser preference
        const browserLanguage = navigator.language || navigator.userLanguage;
        const preferredLanguage = localStorage.getItem('preferredLanguage') || 
            (browserLanguage.startsWith('fi') ? 'fi' : 'en');
            
        currentLanguage = preferredLanguage;
        document.getElementById('language-selector').value = currentLanguage;
        document.documentElement.lang = currentLanguage === 'fi' ? 'fi' : 'en';
        
        await loadPostsForLanguage();
        
        currentLanguage = preferredLanguage;
        document.getElementById('language-selector').value = currentLanguage;
        document.documentElement.lang = currentLanguage === 'fi' ? 'fi' : 'en';
        updatePageTexts();
        
        // Enhanced browser back/forward handling
        window.addEventListener('hashchange', handleInitialRoute);
        window.addEventListener('popstate', handleInitialRoute);
        
        // Handle initial route
        handleInitialRoute();
        
        // Performance: Preload critical resources
        preloadCriticalResources();
        
        debugLog('Blog initialization complete');
        
	} catch (error) {
        console.error('Init error:', error);
        
        // Enhanced error display
        const errorMessage = currentLanguage === 'fi' ?
            `Virhe ladattaessa sivustoa: ${error.message}` :
            `Error loading site: ${error.message}`;
            
        document.getElementById('frontpage-content').innerHTML = 
            `<div style="padding: 2rem; text-align: center; color: #e74c3c; background: #fdf2f2; border: 1px solid #f5c6cb; border-radius: 4px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <h2>${currentLanguage === 'fi' ? 'Latausvirhe' : 'Loading Error'}</h2>
                <p>${errorMessage}</p>
                <button onclick="location.reload()" style="padding: 0.5rem 1rem; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 1rem;">
                    ${currentLanguage === 'fi' ? 'Yritä uudelleen' : 'Try Again'}
                </button>
            </div>`;
	}
}

// Preload critical resources for better performance
function preloadCriticalResources() {
    // Preload profile image
    const profileImg = new Image();
    profileImg.src = '/assets/profile.jpg';
    
    // Preload most common post images (if any)
    // This could be extended based on your content
}

// Enhanced error handling for global errors
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    
    if (isDevelopment) {
        // Show error details in development
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'position:fixed;top:10px;right:10px;background:red;color:white;padding:1rem;border-radius:4px;z-index:9999;max-width:300px;';
        errorDiv.innerHTML = `<strong>Error:</strong> ${e.error?.message || 'Unknown error'}`;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => errorDiv.remove(), 5000);
    }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
