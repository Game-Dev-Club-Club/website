import { useState, type Dispatch, type SetStateAction } from "react";

import BallPit from "./BallPit"
import { SPONSOR_INFO } from './sponsorInfo.ts';
import type { Sponsor } from "./types.ts";
import "./Sponsors.css"
import jarLid from "../../assets/img/jar-lid.svg"


type SponsorInfoProps = {
  sponsorInfo: Sponsor[],
  selectedIndex: number,
  setSelectedIndex: Dispatch<SetStateAction<number>>
}

function IndicatorDots({ sponsorInfo, selectedIndex, setSelectedIndex }: SponsorInfoProps) {
  
  return <div className="flex flex-row items-center justify-center gap-3">
    {sponsorInfo.map((_sponsor, i) => (
      <div key={i} className={`h-3 w-3 rounded-full ${selectedIndex === i ? "bg-gray-900" : "bg-gray-500"}`} onClick={() => setSelectedIndex(i)}></div>
    ))}
  </div>
}

function SponsorLogo({ sponsor }: { sponsor: Sponsor }) {
  const logo = <img className="sponsor-card-logo" src={sponsor.src} alt={sponsor.alt} draggable={false} />;
  const { url } = sponsor.info;

  return url
    ? <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${sponsor.info.name}`}>{logo}</a>
    : logo;
}

function SponsorInfo({ sponsorInfo, selectedIndex, setSelectedIndex }: SponsorInfoProps) {
  const selectedSponsor = sponsorInfo.at(selectedIndex);
  const listLength = sponsorInfo.length;

  return (
    <div className="sponsor-card flex flex-row items-center justify-center gap-10 pt-12 pb-12 rounded-4xl">
      <div className="text-5xl select-none text-gray-600" onClick={() => setSelectedIndex((selectedIndex-1+listLength) % listLength)}>〈</div>
      <div className="flex flex-col items-center justify-center gap-10">
        {/* for the slide anims */}
        <div key={selectedIndex} className="sponsor-card-slide flex flex-col items-center justify-center gap-10">
          <div className="w-full rounded-4xl">
            <h2 className="text-4xl font-hiruko">{selectedSponsor?.info.name}</h2>
            <h4 className="text-2xl font-capriola">{selectedSponsor?.info.role}</h4>
            <br />
            <p className="text-xl font-capriola">{selectedSponsor?.info.description}</p>
          </div>
          {selectedSponsor && <SponsorLogo sponsor={selectedSponsor} />}
        </div>
        <IndicatorDots sponsorInfo={sponsorInfo} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
      </div>
      <div className="text-5xl select-none text-gray-600" onClick={() => setSelectedIndex((selectedIndex+1) % listLength)}>〉</div>
    </div>
  )
}


// module evel so the logo list stays across renders
const RIGID_SPONSORS = SPONSOR_INFO.filter((sponsor) => sponsor.rigid);
const PIT_SPONSORS = SPONSOR_INFO.filter((sponsor) => !sponsor.rigid);

function Sponsors() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedSponsor = SPONSOR_INFO.at(selectedIndex)

  return <div className="sponsor-page">
    <div className="sponsor-jar">
      <div className="sponsor-jar-body">
        <div className="sponsor-jar-shelf">
          {RIGID_SPONSORS.map((sponsor) => (
            <img
              key={sponsor.id}
              className={`sponsor-jar-shelf-logo ${sponsor === selectedSponsor ? "selected" : ""}`}
              src={sponsor.src}
              alt={sponsor.alt}
              draggable={false}
              onClick={() => setSelectedIndex(SPONSOR_INFO.indexOf(sponsor))}
            />
          ))}
        </div>
        <BallPit
          logos={PIT_SPONSORS}
          selectedIndex={selectedSponsor ? PIT_SPONSORS.indexOf(selectedSponsor) : -1}
          onSelect={(i) => setSelectedIndex(SPONSOR_INFO.indexOf(PIT_SPONSORS[i]))}
        />
      </div>
      <img className="sponsor-jar-lid" src={jarLid} />
    </div>
    <SponsorInfo 
      sponsorInfo={SPONSOR_INFO}
      selectedIndex={selectedIndex}
      setSelectedIndex={setSelectedIndex}
    />
  </div>
}


export default Sponsors
