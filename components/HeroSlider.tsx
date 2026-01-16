import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Banner } from '../types';
import { useStoreData } from '../context/StoreDataContext';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import './HeroSlider.css';

interface HeroSliderProps {
    banners: Banner[];
}

// Default timing configuration
const DEFAULT_TIMING = {
    dwell: 3000,    // Time slide stays visible
    charOut: 180,   // Hero image fade out
    fade: 220,      // Crossfade between slides
    post: 140,      // Pause after crossfade
    charIn: 260,    // Hero image slide in
};

const HeroSlider: React.FC<HeroSliderProps> = ({ banners }) => {
    const { settings } = useStoreData();
    const [activeIndex, setActiveIndex] = useState(0);
    const [slideStates, setSlideStates] = useState<Record<number, string[]>>({});
    const [isLocked, setIsLocked] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isPausedRef = useRef(false);

    // Use settings for dwell time if available
    const dwellTime = settings?.bannerInterval || DEFAULT_TIMING.dwell;
    const TIMING = { ...DEFAULT_TIMING, dwell: dwellTime };

    // Check for reduced motion preference
    const prefersReducedMotion = typeof window !== 'undefined'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Filter active banners
    const activeBanners = banners.filter(b => b.active);

    // Fallback banner if none exist
    const displayBanners = activeBanners.length > 0 ? activeBanners : [{
        id: 'default',
        title: 'Цифровое будущее',
        description: 'Магазин цифровых товаров и подписок. Мгновенный доступ к премиум-сервисам.',
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
        linkUrl: '/catalog',
        buttonText: 'Перейти в каталог',
        sortOrder: 0,
        active: true
    }];

    const scheduleNext = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (displayBanners.length <= 1) return;

        timerRef.current = setTimeout(() => {
            if (!isPausedRef.current) {
                goTo((activeIndex + 1) % displayBanners.length);
            }
        }, TIMING.dwell);
    }, [activeIndex, displayBanners.length, TIMING.dwell]);

    const goTo = useCallback((nextIndex: number) => {
        if (isLocked || nextIndex === activeIndex) return;

        // Reduced motion: instant switch
        if (prefersReducedMotion) {
            setActiveIndex(nextIndex);
            setSlideStates({});
            scheduleNext();
            return;
        }

        setIsLocked(true);
        const currentIdx = activeIndex;

        // Phase A: Hero out (current slide)
        setSlideStates(prev => ({
            ...prev,
            [currentIdx]: ['is-active', 'is-char-exiting']
        }));

        setTimeout(() => {
            // Phase B: Crossfade - prep next, activate next
            // NOTE: We keep 'is-char-exiting' on current so hero image stays hidden during fade
            setSlideStates(prev => ({
                ...prev, // Keep current state
                [nextIndex]: ['is-active', 'is-char-prep']
            }));

            // Explicitly remove is-active from current to trigger fade out
            setSlideStates(prev => {
                const newState = { ...prev };
                if (newState[currentIdx]) {
                    newState[currentIdx] = ['is-char-exiting']; // Removed 'is-active'
                }
                return newState;
            });

            setTimeout(() => {
                // Cleanup current completely
                setSlideStates(prev => {
                    const newState = { ...prev };
                    delete newState[currentIdx];
                    return newState;
                });

                setActiveIndex(nextIndex);

                // Phase C → D: Hero in
                setTimeout(() => {
                    setSlideStates(prev => ({
                        ...prev,
                        [nextIndex]: ['is-active', 'is-char-entering']
                    }));

                    // Use requestAnimationFrame to ensure browser has painted
                    requestAnimationFrame(() => {
                        // Remove is-char-prep is redundant if we overwrite, but good practice if toggling classes
                        setSlideStates(prev => ({
                            ...prev,
                            [nextIndex]: ['is-active', 'is-char-entering']
                        }));
                    });

                    setTimeout(() => {
                        // Complete - remove animation classes, keep only is-active
                        setSlideStates(prev => ({
                            ...prev,
                            [nextIndex]: ['is-active']
                        }));
                        setIsLocked(false);
                        scheduleNext();
                    }, TIMING.charIn);

                }, TIMING.post);

            }, TIMING.fade);

        }, TIMING.charOut);
    }, [isLocked, activeIndex, prefersReducedMotion, scheduleNext, TIMING]);

    // Start auto-advance on mount
    useEffect(() => {
        scheduleNext();
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [scheduleNext]);

    // Handle dot click
    const handleDotClick = (index: number) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        goTo(index);
    };

    // Handle nav buttons
    const handlePrev = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        goTo((activeIndex - 1 + displayBanners.length) % displayBanners.length);
    };

    const handleNext = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        goTo((activeIndex + 1) % displayBanners.length);
    };

    // Pause on hover/focus
    const handleMouseEnter = () => {
        isPausedRef.current = true;
        if (timerRef.current) clearTimeout(timerRef.current);
    };

    const handleMouseLeave = () => {
        isPausedRef.current = false;
        scheduleNext();
    };

    // Get classes for a slide
    const getSlideClasses = (index: number): string => {
        const states = slideStates[index];
        if (states) return states.join(' ');
        // Default state fallback
        return index === activeIndex ? 'is-active' : '';
    };

    if (displayBanners.length === 0) return null;

    return (
        <section
            className="hero-slider"
            aria-label="Промо баннер"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="hero-slider__viewport">
                <div className="hero-slider__stack">
                    {displayBanners.map((banner, index) => (
                        <article
                            key={banner.id}
                            className={`hero-slide ${getSlideClasses(index)}`}
                            data-index={index}
                        >
                            {/* Background */}
                            <div className="hero-slide__bg" aria-hidden="true">
                                {banner.imageUrl && banner.imageUrl.match(/\.(mp4|webm|mov)(?:\?.*)?$/i) ? (
                                    <video
                                        src={banner.imageUrl}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src={banner.imageUrl}
                                        alt=""
                                        loading={index === 0 ? 'eager' : 'lazy'}
                                    />
                                )}
                            </div>

                            {/* Overlay */}
                            <div className="hero-slide__overlay" aria-hidden="true" />

                            {/* Layout */}
                            <div className="hero-slide__layout">
                                {/* Left content */}
                                <div className="hero-slide__content">
                                    <div className="hero-slide__badge">
                                        <span className="hero-slide__badge-dot" />
                                        Digi Deal
                                    </div>
                                    <h1 className="hero-slide__title">{banner.title}</h1>
                                    {banner.description && (
                                        <p className="hero-slide__subtitle">{banner.description}</p>
                                    )}
                                    <Link
                                        to={banner.linkUrl || '/catalog'}
                                        className="hero-slide__cta"
                                    >
                                        {banner.buttonText || 'Подробнее'}
                                        <ArrowRight />
                                    </Link>
                                </div>

                                {/* Right hero image */}
                                {banner.heroImageUrl && (
                                    <div className="hero-slide__hero" aria-hidden="true">
                                        {banner.heroImageUrl.match(/\.(mp4|webm|mov)(?:\?.*)?$/i) ? (
                                            <video
                                                className="hero-slide__hero-img"
                                                src={banner.heroImageUrl}
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                            />
                                        ) : (
                                            <img
                                                className="hero-slide__hero-img"
                                                src={banner.heroImageUrl}
                                                alt=""
                                                loading={index === 0 ? 'eager' : 'lazy'}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}
                </div>

                {/* Pagination dots */}
                {displayBanners.length > 1 && (
                    <div className="hero-slider__pagination" aria-label="Переключение слайдов">
                        {displayBanners.map((_, index) => (
                            <button
                                key={index}
                                className={`hero-slider__dot ${index === activeIndex ? 'is-active' : ''}`}
                                type="button"
                                onClick={() => handleDotClick(index)}
                                aria-current={index === activeIndex ? 'true' : 'false'}
                                aria-label={`Слайд ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Navigation arrows */}
                {displayBanners.length > 1 && (
                    <div className="hero-slider__nav">
                        <button
                            className="hero-slider__nav-btn"
                            onClick={handlePrev}
                            aria-label="Предыдущий слайд"
                        >
                            <ChevronLeft />
                        </button>
                        <button
                            className="hero-slider__nav-btn"
                            onClick={handleNext}
                            aria-label="Следующий слайд"
                        >
                            <ChevronRight />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default HeroSlider;
