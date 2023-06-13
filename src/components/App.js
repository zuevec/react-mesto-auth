import Header from './Header';
import Footer from './Footer';
import Main from './Main';
import { useEffect, useState } from 'react';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import CurrentUserContext from "../contexts/CurrentUserContext";
import { api } from "../utils/Api";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";


function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);


  const fetchCards = async () => {
    try {
      const res = await api.getCardList();
      setCards(res);
    } catch (e) {
      console.warn(e)
    }
  }

  const handleCardLike = async (card) => {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    try {
        const resChangeLikeStatus = await api.changeLikeCardStatus(card._id, !isLiked);
        setCards((state) => state.map((c) => c._id === card._id ? resChangeLikeStatus : c));
    } catch (error) {
        console.warn(error);
    }
}

const handleDeleting = async (card) => {
  try {
      await api.removeCard(card._id);
      setCards((newArray) => newArray.filter((item) => card._id !== item._id))
      closeAllPopups();
  } catch (error) {
      console.warn(error);
  }
}


  const handleUserUpdate = async (obj) => {
    try {
        const changedProfile = await api.setUserInfo(obj);
        setCurrentUser(changedProfile);
        closeAllPopups();
    } catch (e) {
        console.warn(e)
    }
}


  const handleAvatarUpdate = async (obj) => {
        try {
            const avatarChanged = await api.setUserAvatar(obj);
            setCurrentUser(avatarChanged);
            closeAllPopups();
        } catch (e) {
            console.warn(e)
        }
    }

    const handleAddPlace = async (card) => {
      try {
          const newPlace = await api.addCard(card);
          setCards([newPlace, ...cards]);
          closeAllPopups();
      } catch (e) {
          console.warn(e)
      }
  }

  const fetchData = async () => {
    try {
      const profileObject = await api.getUserInfo();
      setCurrentUser(profileObject);
  } catch (error) {
      console.warn(error);
  }
  }

  useEffect(() => {
    fetchData();
    fetchCards();
  }, [])

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsImageOpen(false);
  };
  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };
  const handleEditProfileClick = () => {
    fetchData();
    setIsEditProfilePopupOpen(true);
  };
  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleCardClick = (obj) => {
    setIsImageOpen(true);
    setSelectedCard(obj);
  };




  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
      <Header />
      <Main
        onAddPlace={handleAddPlaceClick}
        onEditProfile={handleEditProfileClick}
        onEditAvatar={handleEditAvatarClick}
        cards={cards}
        onCardLike={handleCardLike}
        onCardDelete={handleDeleting}
        onCardClick={handleCardClick}
      />
      <Footer />

      <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUserUpdate} />
      
      <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlace}/>
      
      <ImagePopup onClose={closeAllPopups} card={selectedCard} isImageOpen={isImageOpen}/>
      
      <PopupWithForm title={'Вы уверены?'} name={'confirm'} btnText={'Да'}></PopupWithForm>
      
      <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleAvatarUpdate} />

      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
