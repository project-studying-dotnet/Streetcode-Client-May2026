import { useCallback } from 'react';
import { message } from 'antd';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import useMobx, { useModalContext } from '@/app/stores/root-store';

import CHRONOLOGY_ADMIN_MESSAGES from './chronology-admin-block.constants';

const useChronologyAdminBlock = (streetcodeId: number) => {
    const { timelineItemStore } = useMobx();
    const { modalStore } = useModalContext();

    useAsync(async () => {
        if (streetcodeId <= 0) {
            return;
        }

        try {
            await timelineItemStore.fetchTimelineItemsByStreetcodeId(streetcodeId);
        } catch {
            message.error(CHRONOLOGY_ADMIN_MESSAGES.LOAD_FAILED);
        }
    }, [streetcodeId, timelineItemStore]);

    const openCreateModal = useCallback(() => {
        modalStore.setModal('adminChronology', undefined, true);
    }, [modalStore]);

    const openEditModal = useCallback((timelineItemId: number) => {
        modalStore.setModal('adminChronology', timelineItemId, true);
    }, [modalStore]);

    const confirmDeleteTimelineItem = useCallback((timelineItemId: number) => {
        modalStore.setConfirmationModal(
            'confirmation',
            async () => {
                try {
                    await timelineItemStore.deleteTimelineItem(timelineItemId);
                    message.success(CHRONOLOGY_ADMIN_MESSAGES.DELETE_SUCCESS);
                } catch {
                    message.error(CHRONOLOGY_ADMIN_MESSAGES.DELETE_FAILED);
                } finally {
                    modalStore.setConfirmationModal('confirmation', undefined, undefined, false);
                }
            },
            CHRONOLOGY_ADMIN_MESSAGES.DELETE_CONFIRM,
            true,
            () => modalStore.setConfirmationModal('confirmation', undefined, undefined, false),
        );
    }, [timelineItemStore, modalStore]);

    return {
        timelineItems: timelineItemStore.getTimelineItemArray,
        openCreateModal,
        openEditModal,
        confirmDeleteTimelineItem,
    };
};

export default useChronologyAdminBlock;