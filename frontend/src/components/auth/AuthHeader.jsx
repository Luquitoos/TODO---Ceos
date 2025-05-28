import Image from 'next/image';

export default function AuthHeader() {
  return (
    <header className="absolute top-0 left-0 p-6 md:p-8 z-10">
      <a
        href="https://ceosjr.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block"
      >
        <Image
          src="/ceostodo_icon.svg"
          alt="CEOS To-Do Icon"
          width={40}
          height={45}
          priority
        />
      </a>
    </header>
  );
}
