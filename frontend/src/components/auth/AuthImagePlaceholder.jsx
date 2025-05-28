import Image from 'next/image';

export default function AuthImagePlaceholder() {
  return (
    <div className="w-full md:w-1/2 flex items-center justify-center md:pl-8 lg:pl-10">
      <div className="w-full max-w-md aspect-[1/1] sm:aspect-[4/3] md:aspect-[1/1] lg:aspect-[4/3] bg-input-bg rounded-2xl shadow-md overflow-hidden">
        <Image
          src="/ceostodo_sample_screenshot.png"
          alt="CEOS To-Do App Screenshot Sample"
          width={500}
          height={375}
          className="w-full h-full object-cover" 
          priority
        />
      </div>
    </div>
  );
}
