import { useCallback, useEffect } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { message } from 'antd';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import useMobx, { useModalContext } from '@/app/stores/root-store';

import INTERESTING_FACTS_ADMIN_MESSAGES from './interesting-facts-admin-block.constants';

const useAdminFactsBlock = (streetcodeId: number) => {
    const { factsStore } = useMobx();
    const { modalStore } = useModalContext();

    useEffect(() => {
        factsStore.setAdminStreetcodeId(streetcodeId);
        return () => factsStore.setAdminStreetcodeId(null);
    }, [streetcodeId, factsStore]);

    useAsync(async () => {
        if (streetcodeId <= 0) {
            return;
        }

        try {
            await factsStore.fetchAdminFactsWithImages(streetcodeId);
        } catch {
            message.error(factsStore.lastError ?? INTERESTING_FACTS_ADMIN_MESSAGES.LOAD_FAILED);
        }
    }, [streetcodeId, factsStore]);

    const openCreateModal = useCallback(() => {
        modalStore.setModal('adminFacts', undefined, true);
    }, [modalStore]);

    const openEditModal = useCallback((factId: number) => {
        modalStore.setModal('adminFacts', factId, true);
    }, [modalStore]);

    const confirmDeleteFact = useCallback((factId: number) => {
        modalStore.setConfirmationModal(
            'confirmation',
            async () => {
                try {
                    await factsStore.deleteAdminFact(factId);
                    message.success(INTERESTING_FACTS_ADMIN_MESSAGES.DELETE_SUCCESS);
                } catch {
                    message.error(factsStore.lastError ?? INTERESTING_FACTS_ADMIN_MESSAGES.DELETE_FAILED);
                } finally {
                    modalStore.setConfirmationModal('confirmation', undefined, undefined, false);
                }
            },
            INTERESTING_FACTS_ADMIN_MESSAGES.DELETE_CONFIRM,
            true,
            () => modalStore.setConfirmationModal('confirmation', undefined, undefined, false),
        );
    }, [factsStore, modalStore]);

    const handleDragEnd = useCallback(async (result: DropResult) => {
        if (!result.destination) {
            return;
        }

        const { source, destination } = result;
        if (source.index === destination.index) {
            return;
        }

        const reordered = factsStore.reorderFacts(source.index, destination.index);
        if (!reordered) {
            return;
        }

        const saved = await factsStore.persistFactsOrder();
        if (!saved) {
            message.error(
                factsStore.lastError ?? INTERESTING_FACTS_ADMIN_MESSAGES.REORDER_FAILED,
            );
        }
    }, [factsStore]);

    return {
        facts: factsStore.getFactArray,
        isLoading: factsStore.isLoading,
        isSaving: factsStore.isSaving,
        openCreateModal,
        openEditModal,
        confirmDeleteFact,
        handleDragEnd,
    };
};

export default useAdminFactsBlock;
