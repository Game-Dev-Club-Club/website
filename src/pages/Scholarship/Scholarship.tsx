import gdcLogo from '../../assets/logos/GDC_Logo_Chilli.png';

function Scholarship() {
  return (
    <div className="relative z-10 w-full flex justify-center">
      <div className="w-full max-w-screen-4xl bg-(--verdant-faded) py-8 px-4 sm:px-8 shadow-2xl overflow-hidden">
        <div className="relative z-10 w-full flex flex-col bg-white py-8 px-4 sm:px-8 shadow-2xl">

          {/* header */}
          <div className="flex flex-col items-center text-center mb-6">
            <h1 className="font-hiruko text-xl sm:text-6xl text-(--blackberry)">
              SCHOLARSHIP
            </h1>
            <p className="font-capriola text-(--blueberry) mt-1">
              Game Dev Club Club x GDC 2027
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
              <h2 className="text-2xl mb-3">Save the date: January 3rd</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                Thanks to our partnership with GDC, we will host another game jam
                 on January 3rd with Festival passes as rewards! This game jam will support students from
                underrepresented backgrounds and provide a safe space to learn new skills
                in game development. We will award X passes to the winners of the game
                jam, and distribute the rest via an application-based raffle to other
                participants. We'll prioritize participants who need support attending
                GDC and can bring a diverse perspective to the conference.
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
            <img
              src={gdcLogo}
              alt="GDC Festival of Gaming"
              className="h-24 w-auto transition-transform duration-300 ease-out hover:scale-110"
            />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Scholarship;
