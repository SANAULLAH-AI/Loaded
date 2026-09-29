
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const brands = [
  {
    id: 'disney',
    name: 'Disney',
    image: 'https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/FFA0BEBAC1406D88929497501C84019EBBA1B018/scale?width=600&aspectRatio=1.78&format=png',
    video: 'https://vod-bgc-na-east-1.media.dssott.com/bgui/ps01/disney/bgui/2019/08/01/1564674844-disney.mp4',
    color: 'from-[#3778cf] to-[#4091e6]'
  },
  {
    id: 'pixar',
    name: 'Pixar',
    image: 'https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/7F4E1A299763030A0A8527227AD70035B14F4F94D560E65534A514E056D2466C/scale?width=600&aspectRatio=1.78&format=png',
    video: 'https://vod-bgc-na-east-1.media.dssott.com/bgui/ps01/disney/bgui/2019/08/01/1564676714-pixar.mp4',
    color: 'from-[#d19a32] to-[#d8bc56]'
  },
  {
    id: 'marvel',
    name: 'Marvel',
    image: 'https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/C90088DCAB7EA558159C0A79E4839D46B5302B5521BAB1F76D2E807D9E2C6D9A/scale?width=600&aspectRatio=1.78&format=png',
    video: 'https://vod-bgc-na-east-1.media.dssott.com/bgui/ps01/disney/bgui/2019/08/01/1564676115-marvel.mp4',
    color: 'from-[#971208] to-[#ea1a38]'
  },
  {
    id: 'starwars',
    name: 'Star Wars',
    image: 'https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/5A9416D67DC9595496B2666087596EE64DE379272051BB854157C0D938BE2C26/scale?width=600&aspectRatio=1.78&format=png',
    video: 'https://vod-bgc-na-east-1.media.dssott.com/bgui/ps01/disney/bgui/2020/12/17/1608229455-star-wars.mp4',
    color: 'from-[#6a6f81] to-[#a7b1cd]'
  },
  {
    id: 'natgeo',
    name: 'National Geographic',
    image: 'https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/2EF24AA0A1E648E6D1A3B26491F516632137ED87AB22969D153316F8BD670FB5/scale?width=600&aspectRatio=1.78&format=png',
    video: 'https://vod-bgc-na-east-1.media.dssott.com/bgui/ps01/disney/bgui/2019/08/01/1564676296-national-geographic.mp4',
    color: 'from-[#7d944a] to-[#a5d054]'
  }
];

const BrandSection = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-6 my-8">
      {brands.map((brand) => (
        <BrandCard key={brand.id} brand={brand} />
      ))}
    </div>
  );
};

interface BrandCardProps {
  brand: {
    id: string;
    name: string;
    image: string;
    video: string;
    color: string;
  };
}

const BrandCard = ({ brand }: BrandCardProps) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (isHovered) {
        videoElement.play().catch(error => console.error("Video play failed:", error));
      } else {
        videoElement.pause();
        videoElement.currentTime = 0;
      }
    }
  }, [isHovered]);

  return (
    <Link
      to={`/brand/${brand.id}`}
      className={cn(
        "relative rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105",
        "border-[3px] border-gray-800 hover:border-gray-700"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-full aspect-video">
        {/* Static Image */}
        <img
          src={brand.image}
          alt={brand.name}
          className={cn(
            "w-full h-full object-cover",
            isHovered ? "opacity-0" : "opacity-100"
          )}
        />

        {/* Video (hidden until hover) */}
        <video
          ref={videoRef}
          src={brand.video}
          className={cn(
            "absolute top-0 left-0 w-full h-full object-cover",
            isHovered ? "opacity-100" : "opacity-0"
          )}
          muted
          loop
        />

        {/* Overlay Gradient */}
        <div 
          className={cn(
            "absolute inset-0 bg-gradient-to-r opacity-0 hover:opacity-30 transition-opacity",
            brand.color
          )}
        />
      </div>
    </Link>
  );
};

export default BrandSection;
