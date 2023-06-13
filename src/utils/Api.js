class Api {
  constructor({ address, groupId, token }) {
    this._token = token;
    this._groupId = groupId;
    this._address = address;
  }

  getResponse(res) {
    return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
  }

  getCardList() {
    return fetch(`${this._address}/${this._groupId}/cards`, {
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json',
      },
    }).then(this.getResponse);
  }

  addCard({ name, link }) {
    return fetch(`${this._address}/${this._groupId}/cards`, {
      method: 'POST',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        link,
      }),
    }).then(this.getResponse);
  }

  removeCard(cardID) {
    return fetch(`${this._address}/${this._groupId}/cards/${cardID}`, {
      method: 'DELETE',
      headers: {
        authorization: this._token,
      },
    }).then(this.getResponse);
  }

  getUserInfo() {
    return fetch(`${this._address}/${this._groupId}/users/me`, {
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json',
      },
    }).then(this.getResponse);
  }

  setUserInfo(data) {
    return fetch(`${this._address}/${this._groupId}/users/me`, {
      method: 'PATCH',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      }),
    }).then(this.getResponse);
  }

  setUserAvatar(data) {
    return fetch(`${this._address}/${this._groupId}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    }).then(this.getResponse);
  }

  changeLikeCardStatus(cardID, like) {
    return fetch(`${this._address}/${this._groupId}/cards/likes/${cardID}`, {
      method: like ? 'PUT' : 'DELETE',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json',
      },
    }).then(this.getResponse);
  }
}

export const api = new Api({
  address: 'https://mesto.nomoreparties.co/v1',
  groupId: `cohort-54`,
  token: `d730e139-d019-43cd-8b99-52f07ddaab79`,
});
