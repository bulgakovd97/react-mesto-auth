import InfoTooltip from "./InfoTooltip";

function InfoTooltipSuccess(props) {
  return (
    <InfoTooltip isOpen={props.isOpen} onClose={props.onClose} >
      <div className="popup__register-success"></div>
      <p className="popup__register-text">Вы успешно зарегистрировались!</p>
    </InfoTooltip>
  );
}

export default InfoTooltipSuccess;
