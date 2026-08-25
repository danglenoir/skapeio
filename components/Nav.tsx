'use client';
import {
  PointerEvent as ReactPointerEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import { nav } from '@/app/i18n';
import NavItem from '@/components/NavItem';

import styles from '@/components/Nav.module.css';

const MAX_POINTER_DISTANCE = 150;

type ItemGeometry = {
  element: HTMLAnchorElement,
  centerY: number,
};

const Nav = (): ReactNode => {
  const navRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const pointerYRef = useRef(0);
  const itemGeometryRef = useRef<ItemGeometry[]>([]);

  const measureItems = useCallback(() => {
    if (!navRef.current) return;

    itemGeometryRef.current = Array.from(
      navRef.current.querySelectorAll<HTMLAnchorElement>('[data-nav-item]')
    ).map((element) => {
      const bounds = element.getBoundingClientRect();

      return {
        element,
        centerY: bounds.top + bounds.height / 2,
      };
    });
  }, []);

  const resetItems = () => {
    itemGeometryRef.current.forEach(({ element }) => {
      element.style.removeProperty('--nav-scale');
      element.style.removeProperty('--nav-opacity');
    });
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return;

    pointerYRef.current = event.clientY;
    if (frameRef.current !== null) return;

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;

      itemGeometryRef.current.forEach(({ element, centerY }) => {
        const distance = Math.abs(pointerYRef.current - centerY);
        const proximity = Math.max(0, 1 - distance / MAX_POINTER_DISTANCE);

        element.style.setProperty('--nav-scale', String(1 + proximity * 1.25));
        element.style.setProperty('--nav-opacity', String(0.3 + proximity * 0.7));
      });
    });
  };

  const handlePointerLeave = () => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    resetItems();
  };

  useEffect(() => {
    measureItems();
    window.addEventListener('resize', measureItems);

    return () => {
      window.removeEventListener('resize', measureItems);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [measureItems]);

  return (
    <nav
      ref={navRef}
      aria-label="Section navigation"
      className={styles.Nav}
      onPointerEnter={measureItems}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {nav.map((item) => (
        <NavItem
          key={item.id}
          item={item}
        />
      ))}
    </nav>
  );
};

export default Nav;
