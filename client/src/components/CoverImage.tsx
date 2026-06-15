type CoverImageProps = {
  src: string;
  title: string;
  artist: string;
  className?: string;
};

export function CoverImage({ src, title, artist, className = '' }: CoverImageProps) {
  return <img className={`coverImage ${className}`} src={src} alt={`${title} by ${artist}`} loading="lazy" />;
}
