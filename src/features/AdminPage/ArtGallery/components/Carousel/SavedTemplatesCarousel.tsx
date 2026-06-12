import { observer } from 'mobx-react-lite';
import { useMemo, useRef, useState, useEffect } from 'react';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableTemplateCard } from './SortableTemplateCard';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';

import './SavedTemplatesCarousel.styles.scss';

export const SavedTemplatesCarousel = observer(
    ({ savedTemplates, onEdit, onSaveToDb }: any) => {
        const rowRef = useRef<HTMLDivElement>(null);
        const [activeIndex, setActiveIndex] = useState(0);
        const [isScrollable, setIsScrollable] = useState(false);

        const checkScrollable = () => {
            const el = rowRef.current;
            if (el) {
                setIsScrollable(el.scrollWidth > el.clientWidth);
            }
        };

        useEffect(() => {
            const el = rowRef.current;
            if (!el) return;

            const observer = new ResizeObserver(checkScrollable);
            observer.observe(el);

            return () => observer.disconnect();
        }, [savedTemplates]);


        const scrollToIndex = (index: number) => {
            const el = rowRef.current;
            if (!el) return;

            const items = el.querySelectorAll('.template-slide') as NodeListOf<HTMLElement>;
            const target = items[index];

            if (!target) return;

            target.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start',
            });

            setActiveIndex(index);
        };

        const scroll = (dir: 'left' | 'right') => {
            const container = rowRef.current;
            const list = container?.querySelector('.templates-list-carousel') as HTMLElement;

            if (!container || !list) return;

            const scrollAmount = 50;
            const totalWidth = list.scrollWidth;
            const visibleWidth = container.clientWidth;

            const currentScroll = container.scrollLeft;

            let newScrollLeft = dir === 'left'
                ? currentScroll - scrollAmount
                : currentScroll + scrollAmount;

            newScrollLeft = Math.max(0, Math.min(newScrollLeft, totalWidth - visibleWidth));

            container.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth',
            });
        };

        const onScroll = () => {
            const el = rowRef.current;
            if (!el) return;

            const items = el.querySelectorAll('.template-slide') as NodeListOf<HTMLElement>;

            let closestIndex = 0;
            let min = Infinity;
            const center = el.scrollLeft + el.clientWidth / 2;

            items.forEach((item, i) => {
                const itemCenter = item.offsetLeft + item.offsetWidth / 2;
                const diff = Math.abs(center - itemCenter);
                if (diff < min) {
                    min = diff;
                    closestIndex = i;
                }
            });

            if (activeIndex !== closestIndex) {
                setActiveIndex(closestIndex);
            }
        };

        const pagination = useMemo(() => {
            return savedTemplates.map((_: any, i: number) => (
                <button
                    key={i}
                    className={`splide__pagination__page ${i === activeIndex ? 'is-active' : ''
                        }`}
                    onClick={() => scrollToIndex(i)}
                />
            ));
        }, [savedTemplates, activeIndex]);


        console.log("savedTemplates", savedTemplates);
        return (
            <div className="templates-list-container">
                {savedTemplates && savedTemplates.length > 0 && (
                    <BlockHeading headingText="Арт-галерея" />
                )}
                <div className="templates-carousel-wrapper">
                    {isScrollable && (
                        <button
                            className="splide__arrow splide__arrow--prev"
                            onClick={() => scroll('left')}
                            disabled={activeIndex === 0}
                        />
                    )}
                    <div
                        className="templates-scroll"
                        ref={rowRef}
                        onScroll={onScroll}
                    >
                        <SortableContext
                            items={savedTemplates.map((t: any) => `tmpl_${t.id}`)}
                            strategy={horizontalListSortingStrategy}
                        >
                            <div className="templates-list-carousel">
                                {savedTemplates.map((template: any) => (
                                    <div className="template-slide" key={template.id}>
                                        <SortableTemplateCard
                                            template={template}
                                            onSaveToDb={onSaveToDb}
                                            onEdit={onEdit}
                                        />
                                    </div>
                                ))}
                            </div>
                        </SortableContext>
                    </div>
                    {isScrollable && (
                        <button
                            className="splide__arrow splide__arrow--next"
                            onClick={() => scroll('right')}
                            disabled={activeIndex === savedTemplates.length - 1}
                        />
                    )}
                </div>
                {isScrollable && (
                    <div className="splide__pagination-wrap">
                        <ul className="splide__pagination">
                            {pagination}
                        </ul>
                    </div>
                )}

                {savedTemplates?.length > 0 && (
                    <button
                        className="streetcode-custom-button"
                        onClick={() => onSaveToDb(savedTemplates)}
                    >
                        Зберегти
                    </button>
                )}
            </div>
        );
    }
);