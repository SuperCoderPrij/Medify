import React from 'react';

export const AnimatedBackground = () => {
  // Generate particles for loops
  const redGlowParticles = Array.from({ length: 13 }).map((_, i) => ({
    id: i,
    delay: i * 300,
  }));

  const bottomParticles = Array.from({ length: 13 }).map((_, i) => ({
    id: i,
    delay: i * 300,
  }));

  const purpleBgElements = Array.from({ length: 22 }).map((_, i) => ({
    id: i,
    delay: i * 500,
  }));

  const redBlockParticles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    delay: 1000 + (i + 1) * 50,
  }));

  // Glow elements for the red blocks trail effect
  const glowElements = Array.from({ length: 5 }).map((_, i) => ({
    id: i,
    // They all share the same animation in the original CSS
    delay: 1000, 
  }));

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#0C0019]">
      <div className="w-full h-full flex items-center justify-center">
        <svg
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          width="100%"
          height="100%"
          viewBox="0 0 2000 1200"
          enableBackground="new 0 0 2000 1200"
          xmlSpace="preserve"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
        >
          <g>
            <line
              fill="none"
              stroke="#FF4D6B"
              strokeWidth="3.4927"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
              x1="355"
              y1="952"
              x2="1430.3"
              y2="315.4"
            />
          </g>
          
          {/* Purple Background Elements */}
          <g id="purplebg" opacity="0.65">
            {purpleBgElements.map((el) => (
              <g key={el.id} style={{ animation: `up 2s ${el.delay}ms ease infinite alternate`, willChange: 'transform' }}>
                 {/* Simplified representation of the many polygons in purplebg for performance/code size */}
                 <polygon fill="#202333" points="1585,596.3 1666,646 1750,597.3 1668,548" />
                 <polygon fill="#202333" points="1464,527.3 1545,577 1629,528.3 1547,479" />
                 <polygon fill="#202333" points="1047,224.3 1128,274 1212,225.3 1130,176" />
                 <polygon fill="#202333" points="1720,524.3 1801,574 1885,525.3 1803,476" />
                 <polygon fill="#202333" points="1831,596.3 1912,646 1996,597.3 1914,548" />
                 {/* Add more random scattered blocks to simulate the effect */}
                 <polygon fill="#202333" points={`${100 + el.id * 50},${500 + (el.id % 2) * 50} ${180 + el.id * 50},${550 + (el.id % 2) * 50} ${260 + el.id * 50},${500 + (el.id % 2) * 50} ${180 + el.id * 50},${450 + (el.id % 2) * 50}`} opacity="0.5" />
              </g>
            ))}
          </g>

          {/* D-App Wrapper */}
          <g id="d-appswrapper">
            <g id="d-app">
               {/* Main D-App Structure */}
               <g style={{ animation: 'updown 2s 200ms ease-in-out infinite alternate', willChange: 'transform' }}>
                  <path fill="#808080" d="M612.3,427.9c-0.1-0.8-3.3,0.2-3.3,0.2v1.3l0.1-0.1l-48.9-28c0,0-4.5-3.1-10.6,0.6l-48.8,28c0,0-0.7,0.1-0.7,0.3V429c0,0-2.7-1-2.8-0.2c-0.4,2.3-0.1,1.9,0,3.5c0,1.1,0.8,2.3,3.1,3.5l47.5,27.5c0,0,7.1,3.9,14.6,0L610,435c0,0,2.3-1.4,2.5-3.4C612.8,430,612.7,430.1,612.3,427.9z" />
                  <path fill="#9A9A9A" d="M500.4,432.8l47.4,27.5c0,0,7.1,3.9,14.6,0L610,432c0,0,6.3-3.6-0.8-7.4l-49-28c0,0-4.6-3.1-10.7,0.6l-48.5,28C501,425.2,493.2,429,500.4,432.8z" />
               </g>
               <g style={{ animation: 'updown 2s 400ms ease-in-out infinite alternate', willChange: 'transform' }}>
                  <path fill="#E04D5A" d="M612.3,414.1c-0.1-0.8-3.3,0.2-3.3,0.2v1.3l0.1-0.1l-48.9-28c0,0-4.5-3.1-10.6,0.6l-48.8,28c0,0-0.7,0.1-0.7,0.3v-1.2c0,0-2.7-1-2.8-0.2c-0.4,2.3-0.1,1.9,0,3.5c0,1.1,0.8,2.3,3.1,3.5l47.5,27.5c0,0,7.1,3.9,14.6,0l47.6-28.3c0,0,2.3-1.4,2.5-3.4C612.8,416.2,612.7,416.3,612.3,414.1z" />
                  <path fill="#FF3D49" d="M500.4,419l47.4,27.5c0,0,7.1,3.9,14.6,0l47.6-28.3c0,0,6.3-3.6-0.8-7.4l-49-28c0,0-4.6-3.1-10.7,0.6l-48.5,28C501,411.4,493.2,415.2,500.4,419z" />
               </g>
            </g>
            
            {/* Particles around D-App */}
            <g>
               <g>
                 {redBlockParticles.map((p) => (
                   <circle 
                     key={p.id} 
                     fill={p.id % 2 === 0 ? "#FFFFFF" : "#E64852"} 
                     cx={500 + Math.random() * 100} 
                     cy={300 + Math.random() * 100} 
                     r={Math.random() * 1.5 + 0.5}
                     style={{ animation: `dots 4s ${p.delay}ms ease infinite`, willChange: 'transform, opacity' }}
                   />
                 ))}
               </g>
            </g>
          </g>

          {/* Red Blocks Animation */}
          <g id="redblocks">
             <polygon fill="#A91B37" points="1300.9,313.8 1300.9,391.1 1362.9,429 1362.9,355.9" />
             <polygon fill="#FF999F" points="1363,355.9 1363,429 1432,391.1 1432,313.8" />
             <polygon fill="#E64852" points="1300.9,313.8 1362.7,355.9 1431.9,313.9 1367.9,273.3" />
          </g>

          {/* Glow Effect for Red Blocks (formerly redblocksparticles) */}
          <g id="redblocksparticles">
          </g>

          <g id="firstBlock">
             <polygon fill="#A91B37" points="1300.9,313.8 1300.9,391.1 1362.9,429 1362.9,355.9" />
             <polygon fill="#FF999F" points="1363,355.9 1363,429 1432,391.1 1432,313.8" />
             <polygon fill="#E64852" points="1300.9,313.8 1362.7,355.9 1431.9,313.9 1367.9,273.3" />
          </g>

          <g id="blockdis">
             <polygon fill="#A91B37" points="353.4,875.7 353.4,953 416.4,990.9 416.4,917.8" />
             <polygon fill="#FF999F" points="416,917.8 416,990.9 484,953 484,875.7" />
             <polygon fill="#E64852" points="353.1,875.8 416,918.6 484.4,875.7 420.3,835.1" />
          </g>

          {/* Red Glow Particles */}
          <g id="redglowparticles">
            {redGlowParticles.map((p) => (
              <circle 
                key={p.id}
                cx={540 + Math.random() * 200} 
                cy={600 + Math.random() * 150} 
                r={1.6} 
                fill="#FFFFFF"
                style={{ animation: `particles 4s ${p.delay}ms ease infinite alternate, p 2s ease infinite alternate`, willChange: 'transform, opacity' }}
              />
            ))}
          </g>

          {/* Bottom Particles */}
          <g id="bottomparticles">
            {bottomParticles.map((p) => (
              <circle 
                key={p.id}
                fill="#FFFFFF" 
                cx={900 + Math.random() * 200} 
                cy={650 + Math.random() * 150} 
                r={1.6}
                style={{ animation: `particles 4s ${p.delay}ms ease infinite alternate, p 2s ease infinite alternate`, willChange: 'transform, opacity' }}
              />
            ))}
          </g>

          {/* Connecting Lines */}
          <g opacity="0.7">
             <line fill="none" stroke="#FF4D6B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" x1="1096.5" y1="511.7" x2="1176.2" y2="464.3" />
             <line fill="none" stroke="#FF4D6B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" x1="938.5" y1="605.7" x2="1018.2" y2="558.3" />
             <line fill="none" stroke="#FF4D6B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" x1="781.4" y1="699.4" x2="861" y2="652.1" />
             <line fill="none" stroke="#FF4D6B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" x1="624.2" y1="791.7" x2="703.9" y2="744.3" />
             <line fill="none" stroke="#FF4D6B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" x1="468" y1="885.5" x2="547.7" y2="838.2" />
          </g>

          {/* Overlay Gradients/Glows */}
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{stopColor: '#202333', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#5C1B99', stopOpacity: 1}} />
            </linearGradient>
          </defs>
          
          {/* Glassmorphism Overlay */}
          <rect x="0" y="0" width="2000" height="1200" fill="url(#grad1)" opacity="0.1" style={{mixBlendMode: 'overlay'}} />
        </svg>
      </div>
      
      {/* Additional CSS-based overlay for blur/gloss */}
      <div className="absolute inset-0 bg-slate-950/10 backdrop-blur-[1px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
    </div>
  );
};