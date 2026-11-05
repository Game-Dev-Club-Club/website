import gdcLogo from '../../assets/logos/GDC_Logo_Chilli.png';

function Scholarship() {
  return (
    <div className="relative z-10 w-full flex justify-center">
      <div className="w-full max-w-screen-4xl bg-(--verdant-faded) py-8 px-4 sm:px-8 shadow-2xl overflow-hidden">
        <div className="relative z-10 w-full flex flex-col bg-white py-8 px-4 sm:px-8 shadow-2xl">

          {/* header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex items-center justify-center gap-3 sm:gap-6">
              <img
                src="/logo/GDCCLOGO_Strawberry.png"
                alt=""
                aria-hidden="true"
                className="h-8 sm:h-16 w-auto"
              />
              <h1 className="font-hiruko text-xl sm:text-6xl text-(--blackberry)">
                GDCC Scholarship
              </h1>
              <img
                src="/logo/GDCCLOGO_Strawberry.png"
                alt=""
                aria-hidden="true"
                className="h-8 sm:h-16 w-auto -scale-x-100"
              />
            </div>
            <p className="font-capriola text-(--blueberry) mt-1">
              GDC 2027 x Game Dev Club Club
            </p>
          </div>

          {/* content */}
          <section className="w-full max-w-4xl mx-auto flex flex-col gap-8 font-cascadia text-(--blackberry) text-center">
            <div>
              <p className="text-sm sm:text-base leading-relaxed">
                Game Dev Club Club's scholarship initiative empowers student developers,
                artists, and musicians of all backgrounds by providing accessible and
                inclusive environments to learn game development as a unified community
                of schools. GDCC’s formal scholarship programming centers around
                structured game jam and community-building events, with an emphasis on
                serving first-generation university students and developers from
                underrepresented backgrounds.
              </p>
            </div>

            <div>
              {/* <h2 className="text-2xl mb-3">Save the date: <b>Early January</b></h2> */}
              <p className="text-sm sm:text-base leading-relaxed">
                Thanks to our partnership with GDC Festival of Gaming, we will host another game jam
                 in early January with Festival passes as rewards! This game jam and its passes will support students from
                underrepresented backgrounds and provide a safe space to learn new skills
                in game development. We'll prioritize participants who need support attending
                GDC Festival of Gaming and can bring a diverse perspective to the conference in March. <b>Stay tuned!</b>
              </p>
            </div>
            {/* TODO: application link (google form?) */}
          </section>

          {/* GDC Festival of Gaming partnership! */}
          <a
            href="https://gdconf.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex justify-center relative z-10"
          >
            <div className="flex items-center gap-3 sm:gap-6 transition-transform duration-300 ease-out hover:scale-110">
              <img
                src={gdcLogo}
                alt="GDC Festival of Gaming"
                className="h-14 sm:h-24 w-auto"
              />
              <div className="self-stretch my-3 sm:my-5 w-px bg-(--blackberry)" aria-hidden="true"></div>
              <div className="font-figtree font-medium uppercase text-(--blackberry) text-xs sm:text-xl leading-snug sm:leading-normal">
                <p>1 - 4 March 2027</p>
                <p>San Francisco</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Scholarship;
