{{--
    Floating context toolbar.

    Sits at bottom-center on every admin page. Automatically detects:
      - Form "Save changes" button → mirrors as primary button
      - Resource "Create" action button → mirrors as primary button
      - Resource "Export" action button → mirrors as secondary button
      - Filament tabs (role="tablist") → mirrors each tab as an interactive pill
      - Table filters trigger → mirrors filter trigger with active badge
      - Table view mode toggle → toggles between Grid and List view
      - Table search input → mirrors as an inline search field
      - Single selected item → surfaces Edit, View, and Delete toolbar buttons
      - Multiple selected items → surfaces Bulk actions, Delete, and Deselect

    All actions mirror Filament's underlying mechanisms so Livewire lifecycle,
    modals, validation, and authorization run natively and reliably.
--}}
<div
    x-data="gkToolbar()"
    x-init="init()"
    x-cloak
    class="gk-toolbar"
    :class="ready && (hasSave || hasCreate || hasExport || hasFilter || hasTable || tabs.length || hasSearch || bulkCount > 0) ? 'is-ready' : ''"
    aria-label="Page context actions"
>
    {{-- Subsection dropdown menu (replaces scrolling pills to prevent sideways overflow) --}}
    <template x-if="tabs.length">
        <div class="gk-toolbar__group relative" @click.outside="sectionOpen = false">
            <button
                type="button"
                class="gk-toolbar__dropdown-btn"
                @click="sectionOpen = !sectionOpen"
                :class="sectionOpen ? 'is-open' : ''"
                aria-haspopup="true"
                :aria-expanded="sectionOpen"
                title="Switch page subsection"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-brand-red"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
                <span class="gk-toolbar__dropdown-current" x-text="activeTabLabel || (pageLabel ? pageLabel + ' Sections' : 'Sections')"></span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5 gk-toolbar__chevron" :class="sectionOpen ? 'rotate-180' : ''"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>

            {{-- Dropdown popup menu opening upwards from the toolbar --}}
            <div
                x-show="sectionOpen"
                x-transition:enter="transition ease-out duration-150"
                x-transition:enter-start="opacity-0 translate-y-2 scale-95"
                x-transition:enter-end="opacity-100 translate-y-0 scale-100"
                x-transition:leave="transition ease-in duration-100"
                x-transition:leave-start="opacity-100 translate-y-0 scale-100"
                x-transition:leave-end="opacity-0 translate-y-2 scale-95"
                class="gk-toolbar__dropdown-menu"
                style="display: none;"
            >
                <div class="gk-toolbar__dropdown-header">
                    <span class="gk-toolbar__dropdown-title" x-text="pageLabel ? pageLabel + ' Sections' : 'Subsections'"></span>
                    <span class="gk-toolbar__dropdown-count" x-text="tabs.length + ' sections'"></span>
                </div>
                <div class="gk-toolbar__dropdown-list">
                    <template x-for="(t, i) in tabs" :key="i">
                        <button
                            type="button"
                            class="gk-toolbar__dropdown-item"
                            :class="t.active ? 'is-active' : ''"
                            @click="jumpToTab(i); sectionOpen = false"
                        >
                            <span class="gk-toolbar__dropdown-dot" :class="t.active ? 'bg-brand-red' : 'bg-gray-300'"></span>
                            <span class="gk-toolbar__dropdown-item-label" x-text="t.label"></span>
                            <template x-if="t.active">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-brand-red ml-auto"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </template>
                        </button>
                    </template>
                </div>
            </div>
        </div>
    </template>

    {{-- View switching: Grid / List (for listing pages) --}}
    <template x-if="hasTable">
        <div class="gk-toolbar__group gk-toolbar__view-switch" title="Switch view layout">
            <button
                type="button"
                class="gk-toolbar__icon-btn"
                :class="viewMode === 'list' ? 'is-active' : ''"
                @click="setViewMode('list')"
                title="List view"
                aria-label="List view"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
            </button>
            <button
                type="button"
                class="gk-toolbar__icon-btn"
                :class="viewMode === 'grid' ? 'is-active' : ''"
                @click="setViewMode('grid')"
                title="Grid view"
                aria-label="Grid view"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            </button>
        </div>
    </template>

    {{-- Page filters --}}
    <template x-if="hasFilter">
        <div class="gk-toolbar__group">
            <button type="button" class="gk-toolbar__btn" :class="activeFilterCount > 0 ? 'is-active' : ''" @click="triggerFilter()" title="Toggle filters">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                <span>Filter</span>
                <template x-if="activeFilterCount > 0">
                    <span class="gk-toolbar__badge" x-text="activeFilterCount"></span>
                </template>
            </button>
        </div>
    </template>

    {{-- Table search --}}
    <template x-if="hasSearch">
        <div class="gk-toolbar__group">
            <label class="gk-toolbar__search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
                <input type="search" placeholder="Search" x-model="searchTerm" @input="pushSearch()" />
            </label>
        </div>
    </template>

    {{-- Single selection action bar --}}
    <template x-if="bulkCount === 1">
        <div class="gk-toolbar__group">
            <span class="gk-toolbar__label">1 Selected</span>
            <template x-if="hasRowView">
                <button type="button" class="gk-toolbar__btn" @click="triggerViewSelected()" title="View details">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    <span>View</span>
                </button>
            </template>
            <template x-if="hasRowEdit">
                <button type="button" class="gk-toolbar__btn" @click="triggerEditSelected()" title="Edit record">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    <span>Edit</span>
                </button>
            </template>
            <template x-if="hasRowDelete">
                <button type="button" class="gk-toolbar__btn is-danger" @click="triggerDeleteSelected()" title="Delete record">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>
                    <span>Delete</span>
                </button>
            </template>
            <button type="button" class="gk-toolbar__icon-btn" @click="triggerDeselect()" title="Deselect" aria-label="Deselect">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3.5 h-3.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </div>
    </template>

    {{-- Multi-selection action bar --}}
    <template x-if="bulkCount > 1">
        <div class="gk-toolbar__group">
            <span class="gk-toolbar__label" x-text="bulkCount + ' Selected'"></span>
            <button type="button" class="gk-toolbar__btn is-primary" @click="triggerBulk()" title="Bulk actions">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                <span>Bulk actions</span>
            </button>
            <button type="button" class="gk-toolbar__icon-btn" @click="triggerDeselect()" title="Deselect all" aria-label="Deselect all">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3.5 h-3.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </div>
    </template>

    {{-- Primary actions (When nothing is selected) --}}
    <template x-if="bulkCount === 0">
        <div class="gk-toolbar__group">
            <template x-if="hasExport">
                <button type="button" class="gk-toolbar__btn" @click="triggerExport()" title="Export data">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    <span x-text="exportLabel"></span>
                </button>
            </template>

            <template x-if="hasCreate">
                <button type="button" class="gk-toolbar__btn is-primary" @click="triggerCreate()" title="Create new record">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" class="w-4 h-4"><path d="M12 5v14M5 12h14"/></svg>
                    <span x-text="createLabel"></span>
                </button>
            </template>

            <template x-if="hasSave">
                <button type="button" class="gk-toolbar__btn is-primary" @click="triggerSave()" title="Save changes">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>
                    <span>Save changes</span>
                </button>
            </template>
        </div>
    </template>
</div>

<script>
    document.addEventListener('alpine:init', () => {
        window.Alpine.data('gkToolbar', () => ({
            ready: false,
            pageLabel: '',
            tabs: [],
            sectionOpen: false,
            activeTabLabel: '',
            hasSave: false,
            hasCreate: false,
            createLabel: 'Create',
            hasExport: false,
            exportLabel: 'Export',
            hasFilter: false,
            activeFilterCount: 0,
            hasTable: false,
            viewMode: localStorage.getItem('gk_admin_view_mode') || 'list',
            hasSearch: false,
            searchTerm: '',
            hasBulk: false,
            bulkCount: 0,
            hasRowEdit: false,
            hasRowView: false,
            hasRowDelete: false,

            init() {
                this._scanning = false;
                this._scheduled = false;
                this._morphing = false;
                this.scan();

                const schedule = () => {
                    if (this._scheduled || this._scanning || this._morphing) return;
                    this._scheduled = true;
                    // Use setTimeout(0) to defer until AFTER Livewire's morph
                    // completes — requestAnimationFrame fires too early and
                    // hits nodes that haven't been mounted yet.
                    setTimeout(() => {
                        this._scheduled = false;
                        if (this._morphing) return; // skip if another morph started
                        this._scanning = true;
                        try { this.scan(); }
                        catch(e) { /* swallow DOM-state errors during transitions */ }
                        finally { this._scanning = false; }
                    }, 0);
                };

                this._obs = new MutationObserver((entries) => {
                    if (this._morphing) return;
                    const isSelf = entries.every(e => e.target && (e.target.closest?.('.gk-toolbar')));
                    if (isSelf) return;
                    schedule();
                });
                this._obs.observe(document.body, {
                    childList: true,
                    subtree: true,
                });

                // Listen to checkbox changes across the document
                document.addEventListener('change', (e) => {
                    if (e.target && e.target.type === 'checkbox') {
                        schedule();
                    }
                });

                // Pause scanning while Livewire is morphing the DOM
                document.addEventListener('livewire:morph', () => { this._morphing = true; });
                document.addEventListener('livewire:morphed', () => {
                    this._morphing = false;
                    schedule();
                });

                document.addEventListener('livewire:navigated', () => {
                    this._morphing = false;
                    schedule();
                });
                document.addEventListener('livewire:navigating', () => {
                    this._morphing = true;
                });
                document.addEventListener('livewire:load', schedule);
                this.ready = true;
            },

            scan() {
                // ---- Save button
                const saveBtn = document.querySelector('form[wire\\:submit="save"] button[type="submit"], form[wire\\:submit\\.prevent="save"] button[type="submit"]');
                this.hasSave = !!saveBtn;
                this._saveRef = saveBtn;

                // ---- Create action button (resource index pages)
                const createBtn = [...document.querySelectorAll('.fi-header-actions button, button')]
                    .find(b => !b.closest('.gk-toolbar') && /^(create|add|new story|add partner|add a partner)/i.test((b.textContent || '').trim()) && !/export/i.test(b.textContent || ''));
                this.hasCreate = !!createBtn;
                this.createLabel = createBtn ? createBtn.textContent.trim().replace(/^Add a new /i, 'Add ').replace(/^Create /i, 'Add ') : 'Create';
                this._createRef = createBtn;

                // ---- Export action button
                const exportBtn = [...document.querySelectorAll('.fi-header-actions button, button')]
                    .find(b => /export|download csv/i.test(b.textContent || '') && !b.closest('.gk-toolbar'));
                this.hasExport = !!exportBtn;
                this.exportLabel = exportBtn ? exportBtn.textContent.trim() : 'Export';
                this._exportRef = exportBtn;

                // ---- Table presence & view switching
                const tableContainer = document.querySelector('.fi-ta-ctn, .fi-ta-content, table.fi-ta-table, .fi-ta-record-grid');
                this.hasTable = !!tableContainer;
                if (this.hasTable) {
                    this.applyViewMode();
                }

                // ---- Filters trigger
                const filterBtn = document.querySelector(
                    '.fi-ta-filters-dropdown button, ' +
                    '.fi-ta-filters-modal button, ' +
                    '.fi-ta-filters-dialog button, ' +
                    '.fi-ta-filter-trigger, ' +
                    '.fi-ta-filters-trigger, ' +
                    '.fi-ta-header-toolbar button:has(svg), ' +
                    'button[aria-label*="Filter" i], ' +
                    '[data-table-filter-trigger]'
                );
                this.hasFilter = !!filterBtn;
                this._filterRef = filterBtn;
                const filterBadge = filterBtn?.querySelector('.fi-badge, [class*="badge"], span') ||
                    document.querySelector('.fi-ta-filters-dropdown .fi-badge, .fi-ta-filters-modal .fi-badge');
                this.activeFilterCount = filterBadge ? parseInt(filterBadge.textContent.trim(), 10) || 0 : 0;

                // ---- Filament tabs
                const tabButtons = [...document.querySelectorAll('[role="tablist"] [role="tab"]')];
                if (tabButtons.length) {
                    this.tabs = tabButtons.map((t) => {
                        const active = t.getAttribute('aria-selected') === 'true'
                            || t.classList.contains('is-active')
                            || t.getAttribute('data-active') === 'true';
                        return {
                            label: (t.textContent || '').trim(),
                            active,
                            el: t,
                        };
                    });
                    const activeTab = this.tabs.find(t => t.active);
                    this.activeTabLabel = activeTab ? activeTab.label : (this.tabs[0]?.label || '');
                } else {
                    this.tabs = [];
                    this.activeTabLabel = '';
                }
                this._tabRefs = tabButtons;

                // ---- Table search input
                const searchInput = document.querySelector('.fi-ta-search-field input, input[type="search"][wire\\:model]');
                this.hasSearch = !!searchInput;
                this._searchRef = searchInput;

                // ---- Selected rows / records
                const selectedBoxes = document.querySelectorAll(
                    '.fi-ta-row input[type="checkbox"]:checked, ' +
                    '.fi-ta-record input[type="checkbox"]:checked, ' +
                    '.fi-ta-record-checkbox input:checked, ' +
                    'input[type="checkbox"][wire\\:model*="selectedRecords"]:checked'
                );
                this.bulkCount = selectedBoxes.length;

                // Check for single selection actions
                if (this.bulkCount === 1) {
                    const row = selectedBoxes[0].closest('.fi-ta-row, .fi-ta-record, tr');
                    this.hasRowEdit = !!(row?.querySelector('button[wire\\:click*="edit" i], a[href*="edit" i], [data-action-name="edit"]') || document.querySelector('.fi-ta-action[wire\\:click*="edit" i]'));
                    this.hasRowView = !!(row?.querySelector('button[wire\\:click*="view" i], a[href*="view" i], [data-action-name="view"]') || document.querySelector('.fi-ta-action[wire\\:click*="view" i]'));
                    this.hasRowDelete = true;
                } else {
                    this.hasRowEdit = false;
                    this.hasRowView = false;
                    this.hasRowDelete = false;
                }

                const bulkTrigger = document.querySelector('button[x-show*="selectedRecords"], [data-bulk-actions-trigger]');
                const bulkGroupBtn = [...document.querySelectorAll('.fi-ta-selection-indicator + * button, button')]
                    .find(b => /bulk actions/i.test(b.textContent || '') && !b.closest('.gk-toolbar'));
                this.hasBulk = this.bulkCount > 0 && !!(bulkTrigger || bulkGroupBtn);
                this._bulkRef = bulkTrigger || bulkGroupBtn;

                // ---- Page label
                const heading = document.querySelector('.fi-header-heading, h1');
                this.pageLabel = heading ? heading.textContent.trim() : '';
            },

            setViewMode(mode) {
                this.viewMode = mode;
                localStorage.setItem('gk_admin_view_mode', mode);
                this.applyViewMode();
            },

            applyViewMode() {
                const targets = document.querySelectorAll('.fi-ta-ctn, .fi-ta-content, .fi-ta-table');
                targets.forEach(el => {
                    if (this.viewMode === 'grid') {
                        el.classList.add('gk-table-grid');
                        el.classList.remove('gk-table-list');
                    } else {
                        el.classList.add('gk-table-list');
                        el.classList.remove('gk-table-grid');
                    }
                });
            },

            jumpToTab(i) {
                const el = this._tabRefs?.[i];
                if (!el) return;
                el.click();
                this.tabs.forEach((t, idx) => t.active = (idx === i));
                this.activeTabLabel = this.tabs[i]?.label || '';
                this.sectionOpen = false;
                el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            },
            triggerSave() {
                if (this._saveRef) { this._saveRef.click(); return; }
                document.querySelector('form')?.requestSubmit();
            },
            triggerCreate() { this._createRef?.click(); },
            triggerExport() { this._exportRef?.click(); },
            triggerFilter() { this._filterRef?.click(); },
            triggerBulk() { this._bulkRef?.click(); },
            triggerEditSelected() {
                const selectedBox = document.querySelector(
                    '.fi-ta-row input[type="checkbox"]:checked, ' +
                    '.fi-ta-record input[type="checkbox"]:checked, ' +
                    '.fi-ta-record-checkbox input:checked, ' +
                    'input[type="checkbox"][wire\\:model*="selectedRecords"]:checked'
                );
                if (!selectedBox) return;
                const row = selectedBox.closest('.fi-ta-row, .fi-ta-record, tr');
                if (!row) return;
                const editBtn = row.querySelector('button[wire\\:click*="edit" i], a[href*="edit" i], [data-action-name="edit"]');
                if (editBtn) {
                    editBtn.click();
                    return;
                }
                const clickTarget = row.querySelector('.fi-ta-record-title, a, h3, [role="button"]') || row;
                clickTarget.click();
            },
            triggerViewSelected() {
                const selectedBox = document.querySelector(
                    '.fi-ta-row input[type="checkbox"]:checked, ' +
                    '.fi-ta-record input[type="checkbox"]:checked, ' +
                    '.fi-ta-record-checkbox input:checked, ' +
                    'input[type="checkbox"][wire\\:model*="selectedRecords"]:checked'
                );
                if (!selectedBox) return;
                const row = selectedBox.closest('.fi-ta-row, .fi-ta-record, tr');
                if (!row) return;
                const viewBtn = row.querySelector('button[wire\\:click*="view" i], a[href*="view" i], [data-action-name="view"]');
                if (viewBtn) {
                    viewBtn.click();
                    return;
                }
                const clickTarget = row.querySelector('.fi-ta-record-title, a, h3, [role="button"]') || row;
                clickTarget.click();
            },
            triggerDeleteSelected() {
                const selectedBox = document.querySelector(
                    '.fi-ta-row input[type="checkbox"]:checked, ' +
                    '.fi-ta-record input[type="checkbox"]:checked, ' +
                    '.fi-ta-record-checkbox input:checked, ' +
                    'input[type="checkbox"][wire\\:model*="selectedRecords"]:checked'
                );
                if (!selectedBox) return;
                const row = selectedBox.closest('.fi-ta-row, .fi-ta-record, tr');
                if (!row) return;
                const deleteBtn = row.querySelector('button[wire\\:click*="delete" i], a[href*="delete" i], [data-action-name="delete"]');
                if (deleteBtn) {
                    deleteBtn.click();
                    return;
                }
                this.triggerBulk();
            },
            triggerDeselect() {
                const deselectBtn = document.querySelector('.fi-ta-selection-indicator button, button[wire\\:click*="deselectAllRecords"]');
                if (deselectBtn) {
                    deselectBtn.click();
                    return;
                }
                const checked = document.querySelectorAll(
                    '.fi-ta-row input[type="checkbox"]:checked, ' +
                    '.fi-ta-record input[type="checkbox"]:checked, ' +
                    '.fi-ta-record-checkbox input:checked, ' +
                    'input[type="checkbox"][wire\\:model*="selectedRecords"]:checked'
                );
                checked.forEach(cb => cb.click());
            },
            pushSearch() {
                if (!this._searchRef) return;
                const proto = Object.getPrototypeOf(this._searchRef);
                const desc = Object.getOwnPropertyDescriptor(proto, 'value');
                desc.set.call(this._searchRef, this.searchTerm);
                this._searchRef.dispatchEvent(new Event('input', { bubbles: true }));
            },
        }));
    });
</script>

