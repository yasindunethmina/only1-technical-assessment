import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard' as never)({
  component: () => <div>Hello /dashboard!</div>,
});
