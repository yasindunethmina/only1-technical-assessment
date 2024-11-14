import { useEffect, useRef } from 'react';

const useInfiniteScroll = (
  onLoadMore: () => void,
  hasNextPage: boolean,
  isLoading: boolean
) => {
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isLoading) {
          onLoadMore();
        }
      },
      { rootMargin: '100px' }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [onLoadMore, hasNextPage, isLoading]);

  return observerTarget;
};

export default useInfiniteScroll;