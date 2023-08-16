import Header from './Header';
import Footer from './Footer';
import Main from './Main';
import { useEffect, useState } from 'react';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import CurrentUserContext from '../contexts/CurrentUserContext';
import { api } from '../utils/Api';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import { Route, Routes } from 'react-router-dom';
import { register, login, auth } from '../utils/register';

import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import Register from './Register';

function App() {
  const [isInfoToolTipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isOk, setIsOk] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [error, setError] = useState('');

  const fetchCards = async () => {
    try {
      const res = await api.getCardList();
      setCards(res);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleRegister = async (password, email) => {
    try {
      await register(password, email);
      setIsOk(true);
      setIsInfoTooltipOpen(true);
    } catch (e) {
      console.warn(e);
      setIsOk(false);
      setIsInfoTooltipOpen(true);
      setError(e.error);
    }
  };

  const handleLogin = async (password, email) => {
    try {
      const { token } = await login(password, email);
      const { data } = await auth(token);
      setUserEmail(data.email);
      setIsLoggedIn(true);
      localStorage.setItem('token', token);
    } catch (e) {
      console.warn(e);
      setIsOk(false);
      setIsInfoTooltipOpen(true);
      setError(e);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUserEmail('');
    setIsLoggedIn(false);
  };

  const checkToken = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { data } = await auth(token);
        setUserEmail(data.email);
        setIsLoggedIn(true);
      } catch (e) {
        console.warn(e);
        setIsLoggedIn(false);
      }
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  const handleCardLike = async (card) => {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    try {
      const resChangeLikeStatus = await api.changeLikeCardStatus(
        card._id,
        !isLiked
      );
      setCards((state) =>
        state.map((c) => (c._id === card._id ? resChangeLikeStatus : c))
      );
    } catch (e) {
      console.warn(e);
    }
  };

  const handleDeleting = async (card) => {
    try {
      await api.removeCard(card._id);
      setCards((newArray) => newArray.filter((item) => card._id !== item._id));
      closeAllPopups();
    } catch (e) {
      console.warn(e);
    }
  };

  const handleUserUpdate = async (obj) => {
    try {
      const changedProfile = await api.setUserInfo(obj);
      setCurrentUser(changedProfile);
      closeAllPopups();
    } catch (e) {
      console.warn(e);
    }
  };

  const handleAvatarUpdate = async (obj) => {
    try {
      const avatarChanged = await api.setUserAvatar(obj);
      setCurrentUser(avatarChanged);
      closeAllPopups();
    } catch (e) {
      console.warn(e);
    }
  };

  const handleAddPlace = async (card) => {
    try {
      const newPlace = await api.addCard(card);
      setCards([newPlace, ...cards]);
      closeAllPopups();
    } catch (e) {
      console.warn(e);
    }
  };

  const fetchData = async () => {
    try {
      const profileObject = await api.getUserInfo();
      setCurrentUser(profileObject);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCards();
  }, []);

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsImageOpen(false);
    setIsInfoTooltipOpen(false);
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
        <Header email={userEmail} logout={logout} />
        <Routes>
          <Route
            path="*"
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                Component={Main}
                onAddPlace={handleAddPlaceClick}
                onEditProfile={handleEditProfileClick}
                onEditAvatar={handleEditAvatarClick}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleDeleting}
                onCardClick={handleCardClick}
                closePopup={closeAllPopups}
              />
            }
          />
          <Route
            path="/sign-up"
            element={
              <Register
                handleRegister={handleRegister}
                isOpen={isInfoToolTipOpen}
                isOk={isOk}
                onClose={closeAllPopups}
                error={error}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="/sign-in"
            element={
              <Login
                handleLogin={handleLogin}
                isLoggedIn={isLoggedIn}
                isOpen={isInfoToolTipOpen}
                isOk={isOk}
                onClose={closeAllPopups}
                error={error}
              />
            }
          />
        </Routes>
        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUserUpdate}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlace}
        />

        <ImagePopup
          onClose={closeAllPopups}
          card={selectedCard}
          isImageOpen={isImageOpen}
        />

        <PopupWithForm
          title={'Вы уверены?'}
          name={'confirm'}
          btnText={'Да'}
        ></PopupWithForm>

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleAvatarUpdate}
        />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
