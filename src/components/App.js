import React from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import api from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { CardsContext } from "../contexts/CardsContext";
import AddPlacePopup from "./AddPlacePopup";
import DeleteCardPopup from "./DeleteCardPopup";

function App() {
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(
    false
  );

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(
    false
  );

  const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] = React.useState(
    false
  );

  const [selectedCard, setSelectedCard] = React.useState(null);

  const [deletedCard, setDeletedCard] = React.useState(null);

  const [currentUser, setCurrentUser] = React.useState({});

  const [cards, setCards] = React.useState([]);

  React.useEffect(() => {
    api
      .getInitialData()
      .then((data) => {
        const [userData, cardsData] = data;

        setCurrentUser(userData);
        setCards(cardsData);
      })
      .catch((err) => console.log("Ошибка загрузки начальных данных - " + err));
  }, []);

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleCardDeleteClick(card) {
    setIsDeleteCardPopupOpen(true);

    setDeletedCard(card);
  }

  function closeAllPopups() {
    setIsAddPlacePopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsDeleteCardPopupOpen(false);
    setSelectedCard(null);
    setDeletedCard(null);
  }

  React.useEffect(() => {
    document.addEventListener("keyup", handleEscUp);
    document.addEventListener("click", handleOverlayClick);

    return () => {
      document.removeEventListener("keyup", handleEscUp);
      document.removeEventListener("click", handleOverlayClick);
    };
  }, []);

  function handleEscUp(evt) {
    if (evt.key === "Escape") {
      setIsAddPlacePopupOpen(false);
      setIsEditProfilePopupOpen(false);
      setIsEditAvatarPopupOpen(false);
      setIsDeleteCardPopupOpen(false);
      setSelectedCard(null);
      setDeletedCard(null);
    }
  }

  function handleOverlayClick(evt) {
    if (evt.target.classList.contains("popup_opened")) {
      setIsAddPlacePopupOpen(false);
      setIsEditProfilePopupOpen(false);
      setIsEditAvatarPopupOpen(false);
      setIsDeleteCardPopupOpen(false);
      setSelectedCard(null);
      setDeletedCard(null);
    }
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log("Ошибка постановки лайка/дизлайка - " + err));
  }

  function handleUpdateUser({ name, about }) {
    api
      .setUserInfo(name, about)
      .then((userData) => {
        setCurrentUser(userData);

        closeAllPopups();
      })
      .catch((err) =>
        console.log("Ошибка обновления данных пользователя - " + err)
      );
  }

  function handleUpdateAvatar({ avatar }) {
    api
      .changeAvatar(avatar)
      .then((userData) => {
        setCurrentUser(userData);

        closeAllPopups();
      })
      .catch((err) =>
        console.log("Ошибка обновления аватара пользователя - " + err)
      );
  }

  function handleAddPlaceSubmit({ name, link }) {
    api
      .addCard(name, link)
      .then((cardsData) => {
        setCards([cardsData, ...cards]);

        closeAllPopups();
      })
      .catch((err) => console.log("Ошибка добавления новой карточки - " + err));
  }

  function handleDeleteCardSubmit(id) {
    api
      .removeCard(id)
      .then(() => {
        setCards((cardsData) => cardsData.filter((card) => id !== card._id));

        closeAllPopups();
      })
      .catch((err) => console.log("Ошибка удаления карточки - " + err));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <CardsContext.Provider value={cards}>
        <div className="page">
          <div className="container">
            <Header />

            <Main
              onEditAvatar={handleEditAvatarClick}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onCardPreview={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDeleteClick}
            />

            <Footer />

            <EditProfilePopup
              isOpen={isEditProfilePopupOpen}
              onClose={closeAllPopups}
              onUpdateUser={handleUpdateUser}
            />

            <AddPlacePopup
              isOpen={isAddPlacePopupOpen}
              onClose={closeAllPopups}
              onAddPlace={handleAddPlaceSubmit}
            />

            <EditAvatarPopup
              isOpen={isEditAvatarPopupOpen}
              onClose={closeAllPopups}
              onUpdateAvatar={handleUpdateAvatar}
            />

            <DeleteCardPopup
              card={deletedCard}
              isOpen={isDeleteCardPopupOpen}
              onClose={closeAllPopups}
              onCardDelete={handleDeleteCardSubmit}
            />

            <ImagePopup card={selectedCard} onClose={closeAllPopups} />
          </div>
        </div>
      </CardsContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
