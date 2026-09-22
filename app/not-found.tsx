import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell not-found">
      <p className="eyebrow">404</p>
      <h1>This evidence path does not exist.</h1>
      <p>The URL may have changed, or the project is not ready to be presented publicly.</p>
      <Link className="button button-primary" href="/">Return home</Link>
    </div>
  );
}
