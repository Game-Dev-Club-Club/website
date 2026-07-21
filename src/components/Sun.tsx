import { useState } from 'react';
import './Sun.css';

const Sun = (props: { onClickEffect: () => void }) => {
  const [pulseKey, setPulseKey] = useState(0);

  const handleClick = () => {
    setPulseKey(k => k + 1);
    props.onClickEffect();
  };

  return (
    <div className="sun-container clickable" onClick={handleClick}>
      <div className="sun">
        <span key={pulseKey} className="sun-pulse-ring" />
        <span className="sun-label mt-2.5">

          Contact
          <br />
          Us

        </span>
      </div>
    </div>
  );
};

export default Sun;