import './Sun.css';

const Sun = (props: { onClickEffect: () => void }) => {
  return (
    <div className="sun-container clickable" onClick={props.onClickEffect}>
      <div className="sun">
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