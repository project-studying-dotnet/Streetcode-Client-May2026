import './Sources.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';
import useMobx, { useStreetcodeDataContext } from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';

import SourceItem from './SourceItem/SourceItem.component';
import LeftArrow from '@assets/images/utils/LeftDefaultSliderArrow.svg';
import RightArrow from '@assets/images/utils/RightDefaultSliderArrow.svg';

const SourcesComponent = () => {
    const { sourcesStore } = useMobx();
    const { streetcodeStore: { getStreetCodeId } } = useStreetcodeDataContext();
    const sliderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (getStreetCodeId > 0) {
            sourcesStore.fetchSrcCategoriesByStreetcodeId(getStreetCodeId);
        }
    }, [getStreetCodeId, sourcesStore]);

    const scrollSources = (direction: 'left' | 'right') => {
        sliderRef.current?.scrollBy({
            left: direction === 'right' ? 420 : -420,
            behavior: 'smooth',
        });
    };

    const items = sourcesStore.getSrcCategoriesArray;

    if (items.length === 0) {
        return <></>;
    }

    return (
        <div className="sourcesWrapper container">
            <div className="sourcesContainer">
                <BlockHeading headingText="Для фанатів" />

                <div className="sourceContentContainer">
                    <div className="sourcesSliderWrapper">
                        {items.length > 3 && (
                            <button
                                type="button"
                                className="sourcesSliderArrow sourcesSliderArrow--left"
                                onClick={() => scrollSources('left')}
                                aria-label="Попередні категорії"
                            >
                                <LeftArrow />
                            </button>
                        )}

                        <div className="sourcesHorizontalList" ref={sliderRef}>
                            {items.map((sc) => (
                                <SourceItem
                                    key={`${sc.id}${sc.streetcodeId}`}
                                    srcCategory={sc}
                                />
                            ))}
                        </div>

                        {items.length > 3 && (
                            <button
                                type="button"
                                className="sourcesSliderArrow sourcesSliderArrow--right"
                                onClick={() => scrollSources('right')}
                                aria-label="Наступні категорії"
                            >
                                <RightArrow />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default observer(SourcesComponent);