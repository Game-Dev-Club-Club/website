import HomepageFace from './HomepageFace';
import HomepageDescription from './HomepageDescription';
import HomepageModel from './HomepageModel';
import gdcLogo from '../../assets/logos/GDC Festival of Gaming Logo_Chilli_RGB.png';
import './RetroFilters.css';
import '../../index.css'

function Home() {
  return (
    <>
    <div className="relative z-10 w-full flex justify-center align-center">
      <div className="w-full max-w-screen-4xl bg-(--verdant-faded) py-8 px-8 shadow-2xl overflow-hidden">
          {/* --- INNER WHITE PANEL --- */}
          <div className="relative z-10 w-full max-w-screen-2xl flex flex-col items-center bg-white py-6 px-6 shadow-2xl">
            
            <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-7xl mx-auto gap-10 mt-4">
              
              {/* Model Wrapper */}
              <div className="w-full md:w-1/3 relative flex items-center justify-center overflow-visible bg-white retro-pixel-text">
                
                {/* CRT Effects */}
                <div className="crt-scanlines pointer-events-none z-10 absolute inset-0"></div>
                <div className="vignette pointer-events-none z-10 absolute inset-0"></div>
                <div className="relative z-[9999] ml-[0.5rem] mt-[-3rem]">
                    <HomepageModel/>
                </div>
              </div>

              {/* Face Wrapper (Red burn has been removed!) */}
              <div className="w-full md:w-auto flex justify-center relative z-10">
                <HomepageFace />
              </div>
            </div>

            {/* Description */}
            <div className="w-full mt-8 relative z-10 max-w-7xl mx-auto">
              <HomepageDescription />
            </div>

            {/* GDC Festival of Gaming partnership! */}
            <a
              href="https://gdconf.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0 flex justify-center relative z-10"
            >
              <img
                src={gdcLogo}
                alt="GDC Festival of Gaming"
                className="h-24 w-auto transition-transform duration-300 ease-out hover:scale-110"
              />
            </a>

          </div>
      </div>
    </div>
    </>
  );
}

export default Home;