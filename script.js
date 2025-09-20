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
        'paivitetyt-sivut.md',
        'uuden-sivuston-taustaa.md'
	],
	en: [
		'hello-world.md',
		'renewed-pages.md',
        'history-about-the-pages.md'
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

	updateNavigationText();

	updatePageMeta(titles[currentLanguage], descriptions[currentLanguage], window.location.href);
	updateNavigationText(); 
	handleInitialRoute();
	updatePageTexts();

        if (typeof cookieConsent !== 'undefined' && cookieConsent) {
            cookieConsent.updateLanguage();
        }
	
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
	.map(post => `<li><a href="#post/${post.id}" onclick="showPost('${post.id}'); return false;" style="cursor: pointer; color: var(--accent);" title="${post.title}">${post.title}</a></li>`)
	.join('');
}


// SEO: Generate sitemap data for better indexing
function generateSitemapData() {
    // Creates a client-side sitemap that can be used by crawlers
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
            postsLoaded: 'artikkelia ladattu', loading: 'Ladataan...',
            backButton: '← Takaisin',
            footerLicense: 'Lisensoitu',
            footerLicenseLink: 'MIT-lisenssillä',
            paginationLabel: 'Artikkeleita sivulla:',
            cookiePolicy: 'Evästekäytäntö'
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
            postsLoaded: 'posts loaded', loading: 'Loading...',
            backButton: '← Back',
            footerLicense: 'Licensed under',
            footerLicenseLink: 'The MIT License (MIT)',
            paginationLabel: 'Posts per page:',
            cookiePolicy: 'Cookie Policy'
        }
    };
    
    const t = texts[currentLanguage];
    
    // Update simple text elements (NOT the pagination labels that contain HTML)
    const elements = [
        ['nav-home', t.home], ['nav-posts', t.posts], ['nav-search', t.search], ['nav-about', t.about],
        ['posts-title', t.postsTitle], ['posts-subtitle', t.postsSubtitle],
        ['search-title', t.searchTitle], ['search-label', t.searchLabel],
        ['search-instructions', t.searchInstructions], ['filter-title', t.filterTitle],
        ['clear-button', t.clearButton], ['sidebar-posts-title', t.sidebarPostsTitle],
        ['sidebar-recent-title', t.sidebarRecentTitle],
        ['footer-license-text', t.footerLicense],
        ['footer-license-link', t.footerLicenseLink],
        ['cookie-policy-text', t.cookiePolicy]
    ];
    
    elements.forEach(([id, text]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    });
    
    // Update pagination labels separately without destroying HTML content
    const paginationLabel = document.getElementById('pagination-label');
    if (paginationLabel) {
        // Only update the text, keep the select element
        paginationLabel.childNodes[0].textContent = t.paginationLabel;
    }
    
    const paginationLabelBottom = document.getElementById('pagination-label-bottom');
    if (paginationLabelBottom) {
        paginationLabelBottom.childNodes[0].textContent = t.paginationLabel;
    }
    
    // Update search input placeholder
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.placeholder = t.searchPlaceholder;
    
    // Update back buttons
    document.querySelectorAll('.back-button').forEach(btn => {
        btn.textContent = t.backButton;
    });
}

// Update navigation text based on language
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
                <picture>
                    <source srcset="/assets/profile-150.webp 150w, /assets/profile-300.webp 300w" 
                            sizes="(max-width: 768px) 150px, 300px" 
                            type="image/webp">
                    <img src="/assets/profile.jpg" 
                        alt="${currentLanguage === 'fi' ? 'Profiilikuva' : 'Profile Picture'}" 
                        class="profile-image" 
                        width="150" 
                        height="150" 
                        loading="lazy"
                        onerror="this.style.display='none'">
                </picture>
                <h1>${frontpageData.title || 'Esa P'}</h1>
                <div>${frontpageData.content}</div>
                <div class="social-links">
                    <a href="https://facebook.com/esa.porttila" title="Facebook" target="_blank" rel="noopener">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/></svg>
                        <span class="sr-only">Facebook</span>
                    </a>
                    <a href="https://github.com/eddyshomepages/" title="GitHub" target="_blank" rel="noopener">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
                        <span class="sr-only">GitHub</span>
                    </a>
                    <a href="https://fi.linkedin.com/in/esaporttila/" title="LinkedIn" target="_blank" rel="noopener">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg>
                        <span class="sr-only">LinkedIn</span>
                    </a>
                    <a href="mailto:pikaeetu72@gmail.com" title="Email">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.471A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/></svg>
                        <span class="sr-only">Email</span>
                    </a>
                    <a href="https://mastodontti.fi/@esa_p/" title="Mastodon" target="_blank" rel="noopener">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M11.19 12.195c2.016-.24 3.77-1.475 3.99-2.603.348-1.778.32-4.339.32-4.339 0-3.47-2.286-4.488-2.286-4.488C12.062.238 10.083.017 8.027 0h-.05C5.92.017 3.942.238 2.79.765c0 0-2.285 1.017-2.285 4.488l-.002.662c-.004.64-.007 1.35.011 2.091.083 3.394.626 6.74 3.78 7.57 1.454.383 2.703.463 3.709.408 1.823-.1 2.847-.647 2.847-.647l-.06-1.317s-1.303.41-2.767.36c-1.45-.05-2.98-.156-3.215-1.928a3.614 3.614 0 0 1-.033-.496s1.424.346 3.228.428c1.103.05 2.137-.064 3.188-.189zm1.613-2.47H11.13v-4.08c0-.859-.364-1.295-1.091-1.295-.804 0-1.207.517-1.207 1.541v2.233H7.168V5.89c0-1.024-.403-1.541-1.207-1.541-.727 0-1.091.436-1.091 1.296v4.079H3.197V5.522c0-.859.22-1.541.66-2.046.456-.505 1.052-.764 1.793-.764.856 0 1.504.328 1.933.983L8 4.39l.417-.695c.429-.655 1.077-.983 1.934-.983.74 0 1.336.259 1.791.764.442.505.661 1.187.661 2.046v4.203z"/></svg>
                        <span class="sr-only">Mastodon</span>
                    </a>
                    <a href="https://t.me/esa_p/" title="Telegram" target="_blank" rel="noopener">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z"/></svg>
                        <span class="sr-only">Telegram</span>
                    </a>
                    <a href="#" onclick="downloadRSSFeed(); return false;" title="${currentLanguage === 'fi' ? 'Lataa RSS-syöte' : 'Download RSS Feed'}">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm1.5 2.5c5.523 0 10 4.477 10 10a1 1 0 1 1-2 0 8 8 0 0 0-8-8 1 1 0 0 1 0-2zm0 4a6 6 0 0 1 6 6 1 1 0 1 1-2 0 4 4 0 0 0-4-4 1 1 0 0 1 0-2zm.5 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg>
                        <span class="sr-only">RSS</span>
                    </a>
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
	
	// Set initial search instructions in the correct language
	const initialText = currentLanguage === 'fi' ?
	    'Syötä hakusana tai valitse tagit löytääksesi artikkeleita...' :
	    'Enter a search term or select tags to find posts...';

	document.getElementById('search-results').innerHTML = `<p>${initialText}</p>`;

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

/// Display posts with original styling
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
        mastodon: `https://toot.kytta.dev/?text=${encodedTitle}%20${encodedUrl}`,
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
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/></svg>
            </a>
            <a href="#" class="share-btn twitter" onclick="sharePost('twitter', '${cleanTitle}', '${currentUrl}'); return false;" 
               title="${currentLanguage === 'fi' ? 'Jaa Twitterissä' : 'Share on Twitter'}" aria-label="Twitter">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/></svg>
            </a>
            <a href="#" class="share-btn instagram" onclick="sharePost('instagram', '${cleanTitle}', '${currentUrl}'); return false;" 
               title="${currentLanguage === 'fi' ? 'Jaa Instagramissa' : 'Share on Instagram'}" aria-label="Instagram">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/></svg>
            </a>
            <a href="#" class="share-btn linkedin" onclick="sharePost('linkedin', '${cleanTitle}', '${currentUrl}'); return false;" 
               title="${currentLanguage === 'fi' ? 'Jaa LinkedInissä' : 'Share on LinkedIn'}" aria-label="LinkedIn">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg>
            </a>
            <a href="#" class="share-btn snapchat" onclick="sharePost('snapchat', '${cleanTitle}', '${currentUrl}'); return false;" 
               title="${currentLanguage === 'fi' ? 'Jaa Snapchatissa' : 'Share on Snapchat'}" aria-label="Snapchat">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M15.943 11.526c-.111-.303-.323-.465-.564-.599a1.416 1.416 0 0 0-.123-.064l-.219-.111c-.752-.399-1.339-.902-1.746-1.498a3.387 3.387 0 0 1-.3-.531c-.034-.1-.032-.156-.008-.207a.338.338 0 0 1 .097-.1c.129-.086.262-.173.352-.231.162-.104.289-.187.371-.245.309-.216.525-.446.66-.702a1.397 1.397 0 0 0 .069-1.16c-.205-.538-.713-.872-1.329-.872a1.829 1.829 0 0 0-.487.065c.006-.368-.002-.757-.035-1.139C11.594 1.592 10.151.9 8.5.9c-1.652 0-3.094.691-3.406 3.343-.033.382-.04.772-.035 1.139a1.83 1.83 0 0 0-.487-.065c-.615 0-1.124.335-1.328.873a1.398 1.398 0 0 0 .067 1.161c.136.256.352.486.661.701.082.058.209.141.371.246.09.057.223.144.352.23a.338.338 0 0 1 .097.101c.024.051.026.107-.008.207a3.399 3.399 0 0 1-.3.531c-.407.596-.994 1.099-1.746 1.498L1.329 10.8a.593.593 0 0 0-.123.064c-.241.134-.453.296-.564.599a1.04 1.04 0 0 0-.017.717c.191.558.635.94 1.156 1.029.162.027.332.033.501.033.478 0 .953-.114 1.417-.345l.333-.168a10.418 10.418 0 0 1 .98-.44c.055-.019.11-.035.165-.049.094-.024.198-.011.291.073.204.186.388.543.612.804.093.108.199.22.308.327.319.313.741.517 1.417.517s1.098-.204 1.416-.517c.11-.107.216-.219.309-.327.224-.261.408-.618.612-.804.093-.084.197-.097.291-.073.055.014.11.03.165.049.325.123.659.26.98.44l.333.168c.464.231.939.345 1.417.345.169 0 .339-.006.501-.033.521-.089.965-.471 1.156-1.029a1.04 1.04 0 0 0-.017-.717z"/></svg>
            </a>
            <a href="#" class="share-btn mastodon" onclick="sharePost('mastodon', '${cleanTitle}', '${currentUrl}'); return false;" 
               title="${currentLanguage === 'fi' ? 'Jaa Mastodonissa' : 'Share on Mastodon'}" aria-label="Mastodon">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11.19 12.195c2.016-.24 3.77-1.475 3.99-2.603.348-1.778.32-4.339.32-4.339 0-3.47-2.286-4.488-2.286-4.488C12.062.238 10.083.017 8.027 0h-.05C5.92.017 3.942.238 2.79.765c0 0-2.285 1.017-2.285 4.488l-.002.662c-.004.64-.007 1.35.011 2.091.083 3.394.626 6.74 3.78 7.57 1.454.383 2.703.463 3.709.408 1.823-.1 2.847-.647 2.847-.647l-.06-1.317s-1.303.41-2.767.36c-1.45-.05-2.98-.156-3.215-1.928a3.614 3.614 0 0 1-.033-.496s1.424.346 3.228.428c1.103.05 2.137-.064 3.188-.189zm1.613-2.47H11.13v-4.08c0-.859-.364-1.295-1.091-1.295-.804 0-1.207.517-1.207 1.541v2.233H7.168V5.89c0-1.024-.403-1.541-1.207-1.541-.727 0-1.091.436-1.091 1.296v4.079H3.197V5.522c0-.859.22-1.541.66-2.046.456-.505 1.052-.764 1.793-.764.856 0 1.504.328 1.933.983L8 4.39l.417-.695c.429-.655 1.077-.983 1.934-.983.74 0 1.336.259 1.791.764.442.505.661 1.187.661 2.046v4.203z"/></svg>
            </a>
            <a href="#" class="share-btn telegram" onclick="sharePost('telegram', '${cleanTitle}', '${currentUrl}'); return false;" 
               title="${currentLanguage === 'fi' ? 'Jaa Telegramissa' : 'Share on Telegram'}" aria-label="Telegram">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z"/></svg>
            </a>
            <a href="#" class="share-btn whatsapp" onclick="sharePost('whatsapp', '${cleanTitle}', '${currentUrl}'); return false;" 
               title="${currentLanguage === 'fi' ? 'Jaa WhatsAppissa' : 'Share on WhatsApp'}" aria-label="WhatsApp">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.78-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
            </a>
            <a href="#" class="share-btn email" onclick="sharePost('email', '${cleanTitle}', '${currentUrl}'); return false;" 
               title="${currentLanguage === 'fi' ? 'Jaa sähköpostilla' : 'Share via Email'}" aria-label="Email">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.471A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/></svg>
            </a>
            <a href="#" class="share-btn copy" onclick="copyToClipboard('${currentUrl}'); return false;" 
               title="${currentLanguage === 'fi' ? 'Kopioi linkki' : 'Copy Link'}" aria-label="Copy Link">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/><path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/></svg>
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

// Cookie Consent System - Add this to the END of script.js (before the init call)

class CookieConsent {
    constructor() {
        this.cookiePreferences = {
            necessary: true,
            analytics: false,
            marketing: false,
            functional: false
        };
        
        this.consentGiven = false;
        this.consentKey = 'eddys_homepages_cookie_consent';
        this.preferencesKey = 'eddys_homepages_cookie_preferences';
        
        this.init();
    }
    
    init() {
        this.loadSavedPreferences();
        this.createBanner();
        this.createModal();
        this.checkConsent();
    }
    
    loadSavedPreferences() {
        const savedConsent = localStorage.getItem(this.consentKey);
        const savedPreferences = localStorage.getItem(this.preferencesKey);
        
        if (savedConsent) {
            this.consentGiven = JSON.parse(savedConsent);
        }
        
        if (savedPreferences) {
            this.cookiePreferences = { ...this.cookiePreferences, ...JSON.parse(savedPreferences) };
        }
    }
    
    createBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.className = 'cookie-banner';
        
        const texts = this.getTexts();
        
        banner.innerHTML = `
            <div class="cookie-banner-content">
                <div class="cookie-text">
                    <h3>${texts.title}</h3>
                    <p>${texts.description}</p>
                </div>
                <div class="cookie-buttons">
                    <button class="cookie-btn accept" onclick="cookieConsent.acceptAll()">${texts.acceptAll}</button>
                    <button class="cookie-btn decline" onclick="cookieConsent.declineAll()">${texts.declineAll}</button>
                    <button class="cookie-btn settings" onclick="cookieConsent.showSettings()">${texts.settings}</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(banner);
    }
    
    createModal() {
        const modal = document.createElement('div');
        modal.id = 'cookie-modal';
        modal.className = 'cookie-modal';
        
        const texts = this.getTexts();
        
        modal.innerHTML = `
            <div class="cookie-modal-content">
                <div class="cookie-modal-header">
                    <h2>${texts.settingsTitle}</h2>
                    <button class="cookie-close" onclick="cookieConsent.hideSettings()">×</button>
                </div>
                <div class="cookie-modal-body">
                    <p>${texts.settingsDescription}</p>
                    
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <h3>${texts.necessary.title}</h3>
                            <label class="cookie-toggle">
                                <input type="checkbox" checked disabled>
                                <span class="cookie-slider"></span>
                            </label>
                        </div>
                        <p>${texts.necessary.description}</p>
                    </div>
                    
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <h3>${texts.functional.title}</h3>
                            <label class="cookie-toggle">
                                <input type="checkbox" id="functional-toggle" onchange="cookieConsent.updatePreference('functional', this.checked)">
                                <span class="cookie-slider"></span>
                            </label>
                        </div>
                        <p>${texts.functional.description}</p>
                    </div>
                    
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <h3>${texts.analytics.title}</h3>
                            <label class="cookie-toggle">
                                <input type="checkbox" id="analytics-toggle" onchange="cookieConsent.updatePreference('analytics', this.checked)">
                                <span class="cookie-slider"></span>
                            </label>
                        </div>
                        <p>${texts.analytics.description}</p>
                    </div>
                    
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <h3>${texts.marketing.title}</h3>
                            <label class="cookie-toggle">
                                <input type="checkbox" id="marketing-toggle" onchange="cookieConsent.updatePreference('marketing', this.checked)">
                                <span class="cookie-slider"></span>
                            </label>
                        </div>
                        <p>${texts.marketing.description}</p>
                    </div>
                </div>
                <div class="cookie-modal-footer">
                    <button class="cookie-save-btn" onclick="cookieConsent.savePreferences()">${texts.savePreferences}</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.updateToggleStates();
    }
    
    getTexts() {
        let lang = currentLanguage || 
                   document.getElementById('language-selector')?.value || 
                   localStorage.getItem('preferredLanguage') || 
                   (navigator.language && navigator.language.startsWith('fi') ? 'fi' : 'en');
        
        const texts = {
            fi: {
                title: 'Evästeiden käyttö',
                description: 'Käytämme evästeitä parantaaksemme käyttökokemustasi. Voit hyväksyä kaikki evästeet tai valita asetukset.',
                acceptAll: 'Hyväksy kaikki',
                declineAll: 'Hylkää kaikki',
                settings: 'Asetukset',
                settingsTitle: 'Evästeiden asetukset',
                settingsDescription: 'Voit hallita evästeiden käyttöä valitsemalla alla olevista vaihtoehdoista.',
                savePreferences: 'Tallenna asetukset',
                necessary: {
                    title: 'Välttämättömät evästeet',
                    description: 'Nämä evästeet ovat välttämättömiä sivuston toiminnalle. Ne mahdollistavat perustoiminnot kuten navigoinnin ja pääsyn suojatuille alueille.'
                },
                functional: {
                    title: 'Toiminnalliset evästeet',
                    description: 'Nämä evästeet parantavat sivuston toimivuutta tallentamalla asetuksiasi kuten teema ja kieli.'
                },
                analytics: {
                    title: 'Analytiikkaevästeet',
                    description: 'Nämä evästeet auttavat meitä ymmärtämään, miten käytät sivustoa. Tiedot kerätään anonyymisti.'
                },
                marketing: {
                    title: 'Markkinointievästeet',
                    description: 'Nämä evästeet mahdollistavat kohdennettujen mainosten näyttämisen ja sosiaalisen median integraation.'
                }
            },
            en: {
                title: 'Cookie Usage',
                description: 'We use cookies to improve your browsing experience. You can accept all cookies or customize your settings.',
                acceptAll: 'Accept All',
                declineAll: 'Decline All',
                settings: 'Settings',
                settingsTitle: 'Cookie Settings',
                settingsDescription: 'You can manage cookie usage by selecting from the options below.',
                savePreferences: 'Save Preferences',
                necessary: {
                    title: 'Necessary Cookies',
                    description: 'These cookies are essential for the website to function. They enable basic features like navigation and access to secure areas.'
                },
                functional: {
                    title: 'Functional Cookies',
                    description: 'These cookies enhance website functionality by remembering your preferences like theme and language settings.'
                },
                analytics: {
                    title: 'Analytics Cookies',
                    description: 'These cookies help us understand how you use the website. Data is collected anonymously.'
                },
                marketing: {
                    title: 'Marketing Cookies',
                    description: 'These cookies enable targeted advertising and social media integration.'
                }
            }
        };
        
        return texts[lang] || texts.en;
    }
    
    checkConsent() {
        if (!this.consentGiven) {
            this.showBanner();
        } else {
            this.loadAllowedScripts();
        }
    }
    
    showBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.add('show');
        }
    }
    
    hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.remove('show');
        }
    }
    
    showSettings() {
        const modal = document.getElementById('cookie-modal');
        if (modal) {
            modal.classList.add('show');
            this.updateToggleStates();
        }
    }
    
    hideSettings() {
        const modal = document.getElementById('cookie-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    }
    
    updateToggleStates() {
        const functionalToggle = document.getElementById('functional-toggle');
        const analyticsToggle = document.getElementById('analytics-toggle');
        const marketingToggle = document.getElementById('marketing-toggle');
        
        if (functionalToggle) functionalToggle.checked = this.cookiePreferences.functional;
        if (analyticsToggle) analyticsToggle.checked = this.cookiePreferences.analytics;
        if (marketingToggle) marketingToggle.checked = this.cookiePreferences.marketing;
    }
    
    updatePreference(type, value) {
        this.cookiePreferences[type] = value;
    }
    
    acceptAll() {
        this.cookiePreferences = {
            necessary: true,
            analytics: true,
            marketing: true,
            functional: true
        };
        this.saveConsent();
    }
    
    declineAll() {
        this.cookiePreferences = {
            necessary: true,
            analytics: false,
            marketing: false,
            functional: false
        };
        this.saveConsent();
    }
    
    savePreferences() {
        this.saveConsent();
        this.hideSettings();
    }
    
    saveConsent() {
        this.consentGiven = true;
        localStorage.setItem(this.consentKey, JSON.stringify(this.consentGiven));
        localStorage.setItem(this.preferencesKey, JSON.stringify(this.cookiePreferences));
        
        this.hideBanner();
        this.loadAllowedScripts();
        this.cleanupDisallowedCookies();
    }
    
    loadAllowedScripts() {
        if (this.cookiePreferences.analytics) {
            // Add Google Analytics or other analytics here if needed
            console.log('Analytics cookies accepted');
        }
        
        if (this.cookiePreferences.marketing) {
            // Add marketing scripts here if needed  
            console.log('Marketing cookies accepted');
        }
        
        if (this.cookiePreferences.functional) {
            console.log('Functional cookies accepted');
        }
    }
    
    cleanupDisallowedCookies() {
        if (!this.cookiePreferences.analytics) {
            this.deleteCookiesByPattern(['_ga', '_gid', '_gat']);
        }
        
        if (!this.cookiePreferences.marketing) {
            this.deleteCookiesByPattern(['_fbp', '_fbc', 'fr']);
        }
    }
    
    deleteCookiesByPattern(patterns) {
        const cookies = document.cookie.split(';');
        
        cookies.forEach(cookie => {
            const cookieName = cookie.split('=')[0].trim();
            
            patterns.forEach(pattern => {
                if (cookieName.includes(pattern)) {
                    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
                    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
                }
            });
        });
    }
    
    updateLanguage() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            const wasVisible = banner.classList.contains('show');
            banner.remove();
            this.createBanner();
            if (wasVisible) {
                this.showBanner();
            }
        }
        
        const modal = document.getElementById('cookie-modal');
        if (modal) {
            const wasModalVisible = modal.classList.contains('show');
            modal.remove();
            this.createModal();
            if (wasModalVisible) {
                this.showSettings();
            }
        }
    }
}

// Initialize cookie consent
let cookieConsent;

function initCookieConsent() {
    setTimeout(() => {
        cookieConsent = new CookieConsent();
    }, 100);
}

// Enhanced loadUtterancesComments with cookie consent check
function loadUtterancesComments(postId) {
    if (!cookieConsent || !cookieConsent.consentGiven) {
        const commentsDiv = document.createElement('div');
        commentsDiv.className = 'comments-placeholder';
        commentsDiv.style.marginTop = '3rem';
        commentsDiv.style.padding = '2rem';
        commentsDiv.style.textAlign = 'center';
        commentsDiv.style.background = 'var(--bg-tertiary)';
        commentsDiv.style.borderRadius = '8px';
        commentsDiv.style.border = '1px solid var(--border-color)';
        
        const texts = currentLanguage === 'fi' ? {
            title: 'Kommentit vaativat evästeiden hyväksynnän',
            description: 'Hyväksy evästeet nähdäksesi kommentit ja osallistuaksesi keskusteluun.',
            button: 'Hyväksy evästeet'
        } : {
            title: 'Comments require cookie consent',
            description: 'Accept cookies to view comments and participate in discussions.',
            button: 'Accept cookies'
        };
        
        commentsDiv.innerHTML = `
            <h3 style="color: var(--text-primary); margin-bottom: 1rem;">${texts.title}</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">${texts.description}</p>
            <button onclick="cookieConsent.showSettings()" style="background: var(--accent); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; cursor: pointer;">
                ${texts.button}
            </button>
        `;
        
        document.getElementById('full-post-content').appendChild(commentsDiv);
        return;
    }
    
    // Existing Utterances loading code
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
    
    const loadingDiv = document.createElement('div');
    loadingDiv.textContent = currentLanguage === 'fi' ? 'Ladataan kommentteja...' : 'Loading comments...';
    loadingDiv.style.textAlign = 'center';
    loadingDiv.style.padding = '2rem';
    loadingDiv.style.color = '#666';
    
    commentsDiv.appendChild(loadingDiv);
    commentsDiv.appendChild(script);
    
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
    initCookieConsent();
}

// Preload critical resources for better performance
function preloadCriticalResources() {
    // Preload profile image
    const profileImg = new Image();
    profileImg.src = '/assets/profile.jpg';
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
