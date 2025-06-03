'use client'

import React from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import styles from './MixtapeCard.module.css';

// Define interface for mixtape object
export interface Mixtape {
  name: string;
  imageUrl: string;
  shortenedLink: string;
}

const MixtapeCard: React.FC<{ mixtape: Mixtape }> = ({ mixtape }) => {
  return (
    <div className="flex flex-col items-center gap-4 bg-black p-6 rounded-2xl">
      <div className="relative w-full aspect-square">
        <div className={`relative w-full h-full transition-transform duration-1000 ${styles['transform-style-3d']} ${styles['animate-spin-slow']}`}>
          {/* Front face with stacked layers */}
          <div className={`absolute inset-0 w-full h-full ${styles['backface-hidden']} ${styles['transform-style-3d']}`}>
            {/* Stacked layers for depth - behind */}
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className={`absolute inset-0 ${styles['hexagon-clip']} rounded-xl`}
                style={{ 
                  transform: `translateZ(${(i + 1) * -0.8}px)`,
                  backgroundColor: '#000',
                  opacity: 1 - (i * 0.15),
                  zIndex: 1
                }}
              />
            ))}

            {/* Stacked layers for depth - front */}
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className={`absolute inset-0 ${styles['hexagon-clip']} rounded-xl`}
                style={{ 
                  transform: `translateZ(${(i + 1) * 0.8}px)`,
                  backgroundColor: '#000',
                  opacity: 0.1 + (i * 0.15),
                  zIndex: 2
                }}
              />
            ))}

            {/* Front image layer */}
            <div className={`absolute inset-0 ${styles['hexagon-clip']} rounded-xl`} style={{ transform: 'translateZ(6px)', zIndex: 20 }}>
              <div className="w-full h-full relative overflow-hidden">
                <Image
                  src={mixtape.imageUrl}
                  alt={mixtape.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Back face with stacked layers */}
          <div className={`absolute inset-0 w-full h-full ${styles['backface-hidden']} ${styles['rotate-y-180']} ${styles['transform-style-3d']}`}>
            {/* Stacked layers for depth - behind */}
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className={`absolute inset-0 ${styles['hexagon-clip']} rounded-xl`}
                style={{ 
                  transform: `translateZ(${(i + 1) * -0.8}px)`,
                  backgroundColor: '#000',
                  opacity: 1 - (i * 0.15),
                  zIndex: 1
                }}
              />
            ))}

            {/* Stacked layers for depth - front */}
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className={`absolute inset-0 ${styles['hexagon-clip']} rounded-xl`}
                style={{ 
                  transform: `translateZ(${(i + 1) * 0.8}px)`,
                  backgroundColor: '#000',
                  opacity: 0.1 + (i * 0.15),
                  zIndex: 2
                }}
              />
            ))}

            {/* Back image layer */}
            <div className={`absolute inset-0 ${styles['hexagon-clip']} rounded-xl`} style={{ transform: 'translateZ(6px)', zIndex: 20 }}>
              <div className="w-full h-full relative">
                <Image
                  src={mixtape.imageUrl}
                  alt={mixtape.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Text content below hexagon */}
      <div className="text-center">
        <h3 className="text-lg text-white font-bold ">
          {mixtape.name}
        </h3>
        <a
          href={mixtape.shortenedLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[#96ed58] hover:underline"
        >
          Listen Now
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

export default MixtapeCard;