import gdcLogo from '../../assets/logos/GDC_Logo_Chilli.png';

function Scholarship() {
  return (
    <div className="relative z-10 w-full flex justify-center">
      <div className="w-full max-w-screen-4xl bg-(--verdant-faded) py-8 px-4 sm:px-8 shadow-2xl overflow-hidden">
        <div className="relative z-10 w-full flex flex-col bg-white py-8 px-4 sm:px-8 shadow-2xl">

          {/* header */}
          <div className="flex flex-col items-center text-center mb-6">
            <h1 className="font-hiruko text-4xl sm:text-6xl text-(--blackberry)">
              SCHOLARSHIP
            </h1>
            <p className="font-capriola text-(--blueberry) mt-1">
              Details coming soon.
            </p>
          </div>

          {/* content */}
          <section className="font-cascadia text-(--blackberry)">
            {/* TODO: scholarship description etc*/}
            {/* This might be a google form or something idk */}
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
