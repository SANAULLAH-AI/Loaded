
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchByCompany } from '@/services/api';
import Header from '@/components/Header';
import MovieRow from '@/components/MovieRow';

const brandInfo = {
  disney: {
    name: 'Disney',
    logo: 'https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/FFA0BEBAC1406D88929497501C84019EBBA1B018/scale?width=600&aspectRatio=1.78&format=png',
    video: 'https://vod-bgc-na-east-1.media.dssott.com/bgui/ps01/disney/bgui/2019/08/01/1564674844-disney.mp4',
    description: 'Disney has been the leader in animation and family entertainment for nearly a century. From classic animated films to live-action adventures, Disney brings magic to audiences of all ages.',
    heroImage: 'https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/5A9416D67DC9595496B2666087596EE64DE379272051BB854157C0D938BE2C26/scale?width=1440&aspectRatio=3.91',
    color: 'from-[#3778cf] to-[#4091e6]'
  },
  pixar: {
    name: 'Pixar',
    logo: 'https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/7F4E1A299763030A0A8527227AD70035B14F4F94D560E65534A514E056D2466C/scale?width=600&aspectRatio=1.78&format=png',
    video: 'https://vod-bgc-na-east-1.media.dssott.com/bgui/ps01/disney/bgui/2019/08/01/1564676714-pixar.mp4',
    description: 'Pixar Animation Studios has revolutionized computer animation with its innovative storytelling and groundbreaking technology. Each Pixar film combines technical artistry with heartfelt stories.',
    heroImage: 'https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/5A9416D67DC9595496B2666087596EE64DE379272051BB854157C0D938BE2C26/scale?width=1440&aspectRatio=3.91',
    color: 'from-[#d19a32] to-[#d8bc56]'
  },
  marvel: {
    name: 'Marvel',
    logo: 'https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/C90088DCAB7EA558159C0A79E4839D46B5302B5521BAB1F76D2E807D9E2C6D9A/scale?width=600&aspectRatio=1.78&format=png',
    video: 'https://vod-bgc-na-east-1.media.dssott.com/bgui/ps01/disney/bgui/2019/08/01/1564676115-marvel.mp4',
    description: 'Marvel Studios creates character-driven films filled with action, adventure, humor and boundary-pushing storytelling. The Marvel Cinematic Universe has changed how we experience superhero stories.',
    heroImage: 'https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/5A9416D67DC9595496B2666087596EE64DE379272051BB854157C0D938BE2C26/scale?width=1440&aspectRatio=3.91',
    color: 'from-[#971208] to-[#ea1a38]'
  },
  starwars: {
    name: 'Star Wars',
    logo: 'https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/5A9416D67DC9595496B2666087596EE64DE379272051BB854157C0D938BE2C26/scale?width=600&aspectRatio=1.78&format=png',
    video: 'https://vod-bgc-na-east-1.media.dssott.com/bgui/ps01/disney/bgui/2020/12/17/1608229455-star-wars.mp4',
    description: 'Star Wars is an epic space saga that combines thrilling action with deeply human stories set in a galaxy far, far away. It explores themes of good versus evil, redemption and the power of hope.',
    heroImage: 'https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/5A9416D67DC9595496B2666087596EE64DE379272051BB854157C0D938BE2C26/scale?width=1440&aspectRatio=3.91',
    color: 'from-[#6a6f81] to-[#a7b1cd]'
  },
  natgeo: {
    name: 'National Geographic',
    logo: 'https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/2EF24AA0A1E648E6D1A3B26491F516632137ED87AB22969D153316F8BD670FB5/scale?width=600&aspectRatio=1.78&format=png',
    video: 'https://vod-bgc-na-east-1.media.dssott.com/bgui/ps01/disney/bgui/2019/08/01/1564676296-national-geographic.mp4',
    description: 'National Geographic documentaries explore the wonders of our planet through breathtaking visuals and compelling storytelling. From wildlife to climate science, these films expand our understanding of the world.',
    heroImage: 'https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/5A9416D67DC9595496B2666087596EE64DE379272051BB854157C0D938BE2C26/scale?width=1440&aspectRatio=3.91',
    color: 'from-[#7d944a] to-[#a5d054]'
  }
};

const Brand = () => {
  const { brandId = 'disney' } = useParams<{ brandId: string }>();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const brand = brandInfo[brandId as keyof typeof brandInfo] || brandInfo.disney;

  useEffect(() => {
    const loadBrandMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchByCompany(brandId as any);
        setMovies(data.results);
      } catch (error) {
        console.error('Error loading brand movies:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadBrandMovies();
    
    // Auto-play video and then fade out
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.play().catch(err => console.error("Video play failed:", err));
      
      const timer = setTimeout(() => {
        setVideoPlaying(false);
      }, 10000); // Stop video after 10 seconds
      
      return () => clearTimeout(timer);
    }
  }, [brandId]);

  // Group movies by type
  const popularMovies = movies.slice(0, 6);
  const newReleases = movies.slice(6, 12);
  const originals = movies.slice(12, 18);
  const classics = movies.slice(18);

  return (
    <div className="min-h-screen bg-disney-dark">
      <Header />
      
      {/* Hero Section */}
      <div className="relative pt-16 h-[60vh] overflow-hidden">
        {/* Brand Video */}
        {videoPlaying ? (
          <video 
            ref={videoRef}
            src={brand.video} 
            className="absolute top-0 left-0 w-full h-full object-cover"
            muted
            loop
          />
        ) : (
          <img 
            src={brand.heroImage} 
            alt={brand.name} 
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-disney-dark/50 to-disney-dark" />
        
        {/* Brand Logo */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
          <img 
            src={brand.logo} 
            alt={brand.name} 
            className="max-w-xs md:max-w-md lg:max-w-lg"
          />
          <p className="mt-6 max-w-2xl text-lg text-gray-300">
            {brand.description}
          </p>
        </div>
      </div>
      
      {/* Content Rows */}
      <div className="relative z-10 -mt-20">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-disney-blue"></div>
          </div>
        ) : (
          <>
            <MovieRow title={`${brand.name} Originals`} movies={originals} />
            <MovieRow title="Popular Movies" movies={popularMovies} variant="backdrop" />
            <MovieRow title="New Releases" movies={newReleases} />
            <MovieRow title="Classics" movies={classics} variant="backdrop" />
          </>
        )}
      </div>
    </div>
  );
};

export default Brand;
