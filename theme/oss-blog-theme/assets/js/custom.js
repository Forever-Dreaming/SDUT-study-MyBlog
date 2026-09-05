/* ============================================================
   SDUT Blog Theme - Custom JavaScript
   基于 Casper 主题的二次开发脚本
   ============================================================ */

(function () {
    'use strict';

    // ===== 工具函数：安全执行包装 =====
    function safeInit(name, fn) {
        try {
            console.log('[SDUT] 初始化:', name);
            fn();
            console.log('[SDUT] 完成:', name);
        } catch (e) {
            console.error('[SDUT] 初始化失败:', name, e);
        }
    }

    // ===== 工具函数：查找文章内容容器 =====
    function findContentElement() {
        // 按优先级尝试多个选择器
        const selectors = [
            '.gh-content',
            '.article-content',
            'article .content',
            '.post-content',
            '.content'
        ];
        for (let i = 0; i < selectors.length; i++) {
            const el = document.querySelector(selectors[i]);
            if (el) {
                console.log('[SDUT] 找到内容容器:', selectors[i]);
                return el;
            }
        }
        console.log('[SDUT] 未找到内容容器');
        return null;
    }

    // ===== 工具函数：查找搜索容器 =====
    function findSearchContainer(input) {
        // 按优先级尝试多个选择器
        const selectors = [
            '.gh-search',
            '.sodo-search',
            '.search-modal',
            '.search-popup'
        ];
        for (let i = 0; i < selectors.length; i++) {
            const container = input.closest(selectors[i]);
            if (container) {
                console.log('[SDUT] 找到搜索容器:', selectors[i]);
                return container;
            }
        }
        // 降级：使用父元素
        console.log('[SDUT] 使用降级搜索容器: input.parentElement');
        return input.parentElement;
    }

    // ===== 工具函数：查找搜索输入框 =====
    function findSearchInput() {
        const selectors = [
            '.gh-search-input',
            '.sodo-search-input',
            '.search-input',
            'input[type="search"]'
        ];
        for (let i = 0; i < selectors.length; i++) {
            const el = document.querySelector(selectors[i]);
            if (el) {
                console.log('[SDUT] 找到搜索输入框:', selectors[i]);
                return el;
            }
        }
        return null;
    }

    // ===== 阅读进度条 =====
    function initReadingProgress() {
        const progressBar = document.getElementById('readingProgressBar');
        if (!progressBar) {
            console.log('[SDUT] 未找到阅读进度条元素，跳过');
            return;
        }

        function updateProgress() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = progress + '%';
        }

        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }

    // ===== 文章目录生成 =====
    function initTableOfContents() {
        const tocContent = document.getElementById('sdutTocContent');
        const tocToggle = document.querySelector('.sdut-toc-toggle');

        if (!tocContent) {
            console.log('[SDUT] 未找到目录容器，跳过');
            return;
        }

        // 使用多选择器查找文章内容
        const content = findContentElement();
        if (!content) {
            tocContent.innerHTML = '<p class="sdut-toc-placeholder">本文暂无目录</p>';
            return;
        }

        // 获取所有标题
        const headings = content.querySelectorAll('h1, h2, h3, h4');

        if (headings.length === 0) {
            tocContent.innerHTML = '<p class="sdut-toc-placeholder">本文暂无目录</p>';
            return;
        }

        console.log('[SDUT] 找到', headings.length, '个标题，正在生成目录');

        // 生成目录列表
        const tocList = document.createElement('ul');
        tocList.className = 'sdut-toc-list';

        const headingMap = [];

        headings.forEach(function (heading, index) {
            const level = parseInt(heading.tagName.charAt(1));
            const text = heading.textContent.trim();
            // 优先使用已有 id，没有则生成
            let id = heading.id;
            if (!id) {
                id = 'sdut-heading-' + index;
                heading.id = id;
            }

            // 创建目录项
            const li = document.createElement('li');
            li.className = 'sdut-toc-item h' + level + '-item';

            const a = document.createElement('a');
            a.href = '#' + id;
            a.textContent = text;
            a.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.getElementById(id);
                if (target) {
                    const offset = 100;
                    const top = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top: top, behavior: 'smooth' });
                }
            });

            li.appendChild(a);
            tocList.appendChild(li);

            headingMap.push({ id: id, element: heading, tocItem: li });
        });

        tocContent.innerHTML = '';
        tocContent.appendChild(tocList);

        // 目录收起/展开
        if (tocToggle) {
            tocToggle.addEventListener('click', function () {
                tocContent.classList.toggle('collapsed');
                tocToggle.textContent = tocContent.classList.contains('collapsed') ? '展开' : '收起';
            });
        }

        // 滚动高亮当前章节
        function highlightToc() {
            const scrollPos = window.scrollY + 150;
            let current = null;

            headingMap.forEach(function (item) {
                if (item.element.offsetTop <= scrollPos) {
                    current = item;
                }
            });

            headingMap.forEach(function (item) {
                item.tocItem.classList.remove('active');
            });

            if (current) {
                current.tocItem.classList.add('active');
            }
        }

        window.addEventListener('scroll', highlightToc, { passive: true });
        highlightToc();
    }

    // ===== 搜索增强 - 最近搜索记录 =====
    function initSearchHistory() {
        const searchButtons = document.querySelectorAll('[data-ghost-search], [data-sodo-search]');
        if (searchButtons.length === 0) {
            console.log('[SDUT] 未找到搜索按钮，跳过搜索历史');
            return;
        }

        console.log('[SDUT] 找到', searchButtons.length, '个搜索按钮');

        // 监听搜索输入
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === 'childList') {
                    const searchInput = findSearchInput();
                    if (searchInput && !searchInput.dataset.sdutEnhanced) {
                        searchInput.dataset.sdutEnhanced = 'true';
                        try {
                            enhanceSearch(searchInput);
                        } catch (e) {
                            console.error('[SDUT] 增强搜索功能失败:', e);
                        }
                    }
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function enhanceSearch(input) {
        const STORAGE_KEY = 'sdut_search_history';
        const MAX_HISTORY = 5;

        console.log('[SDUT] 搜索历史功能已启用');

        // 获取历史记录
        function getHistory() {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            } catch (e) {
                console.warn('[SDUT] 读取搜索历史失败:', e);
                return [];
            }
        }

        // 保存历史记录
        function saveHistory(term) {
            try {
                let history = getHistory();
                history = history.filter(function (item) { return item !== term; });
                history.unshift(term);
                if (history.length > MAX_HISTORY) {
                    history = history.slice(0, MAX_HISTORY);
                }
                localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
            } catch (e) {
                console.warn('[SDUT] 保存搜索历史失败:', e);
            }
        }

        // 添加历史记录面板 - 使用多选择器查找容器
        const searchContainer = findSearchContainer(input);
        if (!searchContainer) {
            console.warn('[SDUT] 未找到搜索容器，历史记录面板无法显示');
            return;
        }

        // 监听搜索提交
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && input.value.trim()) {
                saveHistory(input.value.trim());
            }
        });

        // 显示历史记录（当输入框为空且获得焦点时）
        input.addEventListener('focus', function () {
            if (!input.value) {
                showHistoryPanel();
            }
        });

        input.addEventListener('input', function () {
            if (input.value) {
                hideHistoryPanel();
            } else {
                showHistoryPanel();
            }
        });

        function showHistoryPanel() {
            const history = getHistory();
            if (history.length === 0) return;

            let panel = document.getElementById('sdutSearchHistory');
            if (!panel) {
                panel = document.createElement('div');
                panel.id = 'sdutSearchHistory';
                panel.className = 'sdut-search-history';
                searchContainer.appendChild(panel);
            }

            panel.innerHTML = '<div class="sdut-search-history-title">最近搜索</div>' +
                history.map(function (term) {
                    return '<div class="sdut-search-history-item" data-term="' + term + '">' +
                        '<span class="sdut-search-history-icon">⏱</span>' +
                        '<span class="sdut-search-history-text">' + term + '</span>' +
                        '</div>';
                }).join('');

            // 点击历史记录
            panel.querySelectorAll('.sdut-search-history-item').forEach(function (item) {
                item.addEventListener('click', function () {
                    input.value = item.dataset.term;
                    input.dispatchEvent(new Event('input'));
                    input.focus();
                });
            });
        }

        function hideHistoryPanel() {
            const panel = document.getElementById('sdutSearchHistory');
            if (panel) {
                panel.remove();
            }
        }
    }

    // ===== 平滑滚动 =====
    function initSmoothScroll() {
        // 点击锚点平滑滚动
        const anchors = document.querySelectorAll('a[href^="#"]');
        if (anchors.length === 0) return;

        anchors.forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href').substring(1);
                if (!targetId || targetId === '/') return;

                const target = document.getElementById(targetId);
                if (target) {
                    e.preventDefault();
                    const offset = 80;
                    const top = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top: top, behavior: 'smooth' });
                }
            });
        });
    }

    // ===== 图片懒加载优化 =====
    function initImageLazyLoad() {
        if (!('IntersectionObserver' in window)) {
            console.log('[SDUT] 浏览器不支持 IntersectionObserver，跳过懒加载优化');
            return;
        }

        const imageObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        if (lazyImages.length > 0) {
            console.log('[SDUT] 找到', lazyImages.length, '张懒加载图片');
        }
        lazyImages.forEach(function (img) {
            imageObserver.observe(img);
        });
    }

    // ===== 返回顶部按钮 =====
    function initBackToTop() {
        // 防止重复创建
        if (document.getElementById('sdutBackToTop')) {
            console.log('[SDUT] 返回顶部按钮已存在，跳过');
            return;
        }

        // 创建按钮
        const btn = document.createElement('button');
        btn.id = 'sdutBackToTop';
        btn.innerHTML = '↑';
        btn.setAttribute('aria-label', '返回顶部');
        btn.style.cssText = [
            'position: fixed',
            'bottom: 30px',
            'right: 30px',
            'width: 44px',
            'height: 44px',
            'border-radius: 50%',
            'background: var(--sdut-primary, #3b82f6)',
            'color: white',
            'border: none',
            'font-size: 20px',
            'cursor: pointer',
            'opacity: 0',
            'visibility: hidden',
            'transition: all 0.3s ease',
            'box-shadow: 0 4px 12px rgba(0,0,0,0.15)',
            'z-index: 1000',
            'display: flex',
            'align-items: center',
            'justify-content: center'
        ].join(';');

        document.body.appendChild(btn);
        console.log('[SDUT] 返回顶部按钮已创建');

        // 滚动显示/隐藏
        function toggleBtn() {
            if (window.scrollY > 300) {
                btn.style.opacity = '1';
                btn.style.visibility = 'visible';
            } else {
                btn.style.opacity = '0';
                btn.style.visibility = 'hidden';
            }
        }

        window.addEventListener('scroll', toggleBtn, { passive: true });

        // 点击返回顶部
        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // 悬停效果
        btn.addEventListener('mouseenter', function () {
            btn.style.transform = 'translateY(-3px)';
            btn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
        });

        btn.addEventListener('mouseleave', function () {
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        });
    }

    // ===== 初始化 =====
    document.addEventListener('DOMContentLoaded', function () {
        console.log('[SDUT] ===== 开始初始化 SDUT Blog 主题 =====');

        safeInit('阅读进度条', initReadingProgress);
        safeInit('文章目录', initTableOfContents);
        safeInit('搜索历史记录', initSearchHistory);
        safeInit('平滑滚动', initSmoothScroll);
        safeInit('图片懒加载优化', initImageLazyLoad);
        safeInit('返回顶部按钮', initBackToTop);

        console.log('[SDUT] ===== SDUT Blog 主题初始化完成 =====');
    });

    // 暴露给全局（方便调试）
    window.SDUT = {
        initReadingProgress: initReadingProgress,
        initTableOfContents: initTableOfContents,
        initBackToTop: initBackToTop,
        initSearchHistory: initSearchHistory,
        initSmoothScroll: initSmoothScroll,
        initImageLazyLoad: initImageLazyLoad,
        findContentElement: findContentElement,
        findSearchInput: findSearchInput
    };

})();
