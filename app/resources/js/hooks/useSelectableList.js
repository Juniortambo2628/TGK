import { useState, useCallback, useMemo } from 'react';
import { router } from '@inertiajs/react';
import toast from 'react-hot-toast';

export function useSelectableList(filteredItems, { routeName, confirmMessage, onSuccess, skipIds = [] } = {}) {
    const [selectedIds, setSelectedIds] = useState([]);

    const toggleSelect = useCallback((id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    }, []);

    const toggleSelectAll = useCallback(() => {
        if (selectedIds.length === filteredItems.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredItems.map((item) => item.id));
        }
    }, [selectedIds.length, filteredItems]);

    const handleBulkDelete = useCallback(() => {
        if (!confirm(`Delete ${selectedIds.length} ${confirmMessage}?`)) return;
        selectedIds.forEach((id) => {
            if (skipIds.includes(id)) return;
            router.delete(route(routeName, id), { preserveScroll: true });
        });
        setSelectedIds([]);
        toast.success(`Selected ${confirmMessage} deleted.`);
        onSuccess?.();
    }, [selectedIds, confirmMessage, routeName, skipIds, onSuccess]);

    const clearSelection = useCallback(() => setSelectedIds([]), []);

    const selectAllProps = useMemo(() => ({
        checked: selectedIds.length === filteredItems.length && filteredItems.length > 0,
        onChange: toggleSelectAll,
    }), [selectedIds.length, filteredItems.length, toggleSelectAll]);

    return {
        selectedIds,
        toggleSelect,
        toggleSelectAll,
        handleBulkDelete,
        clearSelection,
        selectAllProps,
        selectedCount: selectedIds.length,
    };
}
