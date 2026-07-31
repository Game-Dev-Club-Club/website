import { useState, type Dispatch, type SetStateAction } from "react";

import BallPit from "./BallPit"
import { SPONSOR_INFO } from './sponsorInfo.ts';
import type { Sponsor } from "./types.ts";
import "./Sponsors.css"


type SponsorInfoProps = {
  sponsorInfo: Sponsor[],
  selectedIndex: number,
  setSelectedIndex: Dispatch<SetStateAction<number>>
}

function IndicatorDots({ sponsorInfo, selectedIndex, setSelectedIndex }: SponsorInfoProps) {
  
  return <div className="flex flex-row items-center justify-center gap-3">
    {sponsorInfo.map((_sponsor, i) => (
      <div key={i} className={`h-3 w-3 rounded-full ${selectedIndex === i ? "bg-gray-800" : "bg-gray-400"}`} onClick={() => setSelectedIndex(i)}></div>
    ))}
  </div>
}

function SponsorInfo({ sponsorInfo, selectedIndex, setSelectedIndex }: SponsorInfoProps) {
  const selectedSponsor = sponsorInfo.at(selectedIndex);
  const listLength = sponsorInfo.length;

  return (
    <div className="sponsor-card flex flex-row items-center justify-center gap-10 p-12 pl-3 pr-3 rounded-4xl">
      <div className="text-5xl select-none text-gray-300" onClick={() => setSelectedIndex((selectedIndex-1+listLength) % listLength)}>〈</div>
      <div className="flex flex-col items-center justify-center gap-10">
        <div className="w-full rounded-4xl">
          <h2 className="text-6xl">{selectedSponsor?.info.name}</h2>
          <h4 className="text-2xl">{selectedSponsor?.info.role}</h4>
          <br />
          <p className="text-xl">{selectedSponsor?.info.description}</p>
        </div>
        <IndicatorDots sponsorInfo={sponsorInfo} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
      </div>
      <div className="text-5xl select-none text-gray-300" onClick={() => setSelectedIndex((selectedIndex+1) % listLength)}>〉</div>
    </div>
  )
}


function Sponsors() {
  const [selectedIndex, setSelectedIndex] = useState(0)

  return <div className="sponsor-page">
    <div className="sponsor-jar">
      <BallPit logos={SPONSOR_INFO} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
    </div>
    <SponsorInfo 
      sponsorInfo={SPONSOR_INFO}
      selectedIndex={selectedIndex}
      setSelectedIndex={setSelectedIndex}
    />
  </div>
}


export default Sponsors
