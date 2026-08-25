'use client';

import { RefObject, useEffect, useState, useSyncExternalStore } from 'react';

type NetworkInformation = EventTarget & {
  saveData?: boolean;
};

type NavigatorWithDeviceHints = Navigator & {
  connection?: NetworkInformation;
  deviceMemory?: number;
};

type ScenePolicyOptions = {
  rootMargin?: string;
};

type IdleWindow = {
  cancelIdleCallback?: (handle: number) => void;
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions,
  ) => number;
};

const subscribeToReducedMotion = (onStoreChange: () => void): (() => void) => {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', onStoreChange);
  return () => query.removeEventListener('change', onStoreChange);
};

const getReducedMotionSnapshot = (): boolean => (
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
);

const subscribeToDocumentVisibility = (onStoreChange: () => void): (() => void) => {
  document.addEventListener('visibilitychange', onStoreChange);
  return () => document.removeEventListener('visibilitychange', onStoreChange);
};

const getDocumentVisibilitySnapshot = (): boolean => !document.hidden;

const getConnection = (): NetworkInformation | undefined => (
  (navigator as NavigatorWithDeviceHints).connection
);

const subscribeToSaveData = (onStoreChange: () => void): (() => void) => {
  const connection = getConnection();
  connection?.addEventListener('change', onStoreChange);
  return () => connection?.removeEventListener('change', onStoreChange);
};

const getSaveDataSnapshot = (): boolean => getConnection()?.saveData === true;

const subscribeToCompactViewport = (onStoreChange: () => void): (() => void) => {
  const query = window.matchMedia('(max-width: 48rem)');
  query.addEventListener('change', onStoreChange);
  return () => query.removeEventListener('change', onStoreChange);
};

const getCompactViewportSnapshot = (): boolean => (
  window.matchMedia('(max-width: 48rem)').matches
);

const getServerFalse = (): boolean => false;

export const usePrefersReducedMotion = (): boolean => useSyncExternalStore(
  subscribeToReducedMotion,
  getReducedMotionSnapshot,
  getServerFalse,
);

const useDocumentVisibility = (): boolean => useSyncExternalStore(
  subscribeToDocumentVisibility,
  getDocumentVisibilitySnapshot,
  getServerFalse,
);

const useSaveData = (): boolean => useSyncExternalStore(
  subscribeToSaveData,
  getSaveDataSnapshot,
  getServerFalse,
);

const useLowQualityDevice = (): boolean => {
  const compactViewport = useSyncExternalStore(
    subscribeToCompactViewport,
    getCompactViewportSnapshot,
    getServerFalse,
  );

  if (typeof navigator === 'undefined') return false;

  const device = navigator as NavigatorWithDeviceHints;
  return compactViewport
    || (device.deviceMemory !== undefined && device.deviceMemory <= 4)
    || navigator.hardwareConcurrency <= 4;
};

const useDeferredReady = (): boolean => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const idleWindow = window as unknown as IdleWindow;

    if (idleWindow.requestIdleCallback) {
      const idleCallback = idleWindow.requestIdleCallback(
        () => setIsReady(true),
        { timeout: 1500 },
      );
      return () => idleWindow.cancelIdleCallback?.(idleCallback);
    }

    const timeout = window.setTimeout(() => setIsReady(true), 250);
    return () => window.clearTimeout(timeout);
  }, []);

  return isReady;
};

export const useScenePolicy = (
  targetRef: RefObject<HTMLElement | null>,
  { rootMargin = '300px' }: ScenePolicyOptions = {},
) => {
  const [hasBeenNearViewport, setHasBeenNearViewport] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const isDeferredReady = useDeferredReady();
  const isDocumentVisible = useDocumentVisibility();
  const prefersReducedMotion = usePrefersReducedMotion();
  const saveData = useSaveData();
  const lowQuality = useLowQualityDevice();

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const IntersectionObserverConstructor = (
      window as unknown as {
        IntersectionObserver?: typeof IntersectionObserver;
      }
    ).IntersectionObserver;

    if (!IntersectionObserverConstructor) {
      const timeout = globalThis.setTimeout(() => {
        setHasBeenNearViewport(true);
        setIsInViewport(true);
      }, 0);
      return () => globalThis.clearTimeout(timeout);
    }

    const nearObserver = new IntersectionObserverConstructor(([entry]) => {
      if (entry.isIntersecting) setHasBeenNearViewport(true);
    }, { rootMargin });
    const visibilityObserver = new IntersectionObserverConstructor(([entry]) => {
      setIsInViewport(entry.isIntersecting);
    }, { threshold: 0.01 });

    nearObserver.observe(target);
    visibilityObserver.observe(target);

    return () => {
      nearObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [rootMargin, targetRef]);

  const shouldMount = isDeferredReady
    && hasBeenNearViewport
    && !prefersReducedMotion
    && !saveData;

  return {
    isActive: shouldMount && isInViewport && isDocumentVisible,
    lowQuality,
    shouldMount,
  };
};
