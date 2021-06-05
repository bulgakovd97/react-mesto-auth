import InfoTooltip from "./InfoTooltip";

function InfoTooltipFail(props) {
  return (
    <InfoTooltip isOpen={props.isOpen} onClose={props.onClose} >
      <div className="popup__register-fail"></div>
      <p className="popup__register-text">Что-то пошло не так! Попробуйте ещё раз.</p>
    </InfoTooltip>
  );
}

export default InfoTooltipFail;
