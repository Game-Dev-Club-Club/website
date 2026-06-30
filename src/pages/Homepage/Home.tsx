import HomepageFace from './HomepageFace';
import HomepageDescription from './HomepageDescription';
import HomepageModel from './HomepageModel';
import '../../RetroFilters.css'; 
import '../../index.css'

function Home() {
  return (
    <>
    <div className="relative z-10 w-full flex justify-center">
      <div className="w-full max-w-screen-4xl bg-(--verdant-faded) py-8 px-8 shadow-2xl overflow-hidden">
          {/* --- INNER WHITE PANEL --- */}
          <div className="relative z-10 w-full max-w-screen-2xl flex flex-col items-center bg-white py-12 px-6 shadow-2xl">
            
            <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-7xl mx-auto gap-10 mt-4">
              
              {/* Model Wrapper */}
              <div className="w-full md:w-1/3 flex relative overflow-hidden bg-white retro-pixel-text">
                <div className="crt-scanlines"></div>
                <div className="crt-flicker-line"></div>
                <div className="vignette"></div>
                <div className="ml-[0.25rem] z-10000">
                  <HomepageModel/>
                </div>
              </div>

              {/* Face Wrapper (Red burn has been removed!) */}
              <div className="w-full md:w-5/11 flex justify-center relative z-10">
                <HomepageFace />
              </div>
            </div>

            {/* Description */}
            <div className="w-full mt-8 relative z-10 max-w-7xl mx-auto">
              <HomepageDescription />
            </div>

          </div>
      </div>
    </div>
    </>
  );
}

export default Home;