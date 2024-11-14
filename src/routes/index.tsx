import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/" as never)({
  component: () => <div>Hello /!</div>,
});
