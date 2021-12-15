const tokenName = "fun-exchange";

export function saveToken(userToken) {
    window.localStorage.setItem(tokenName, JSON.stringify(userToken));
}

export function getToken() {
  const tokenString = window.localStorage.getItem(tokenName);
  const userToken = JSON.parse(tokenString);
  return userToken;
}

export function removeToken() {
    window.localStorage.removeItem(tokenName);
}

export function alreadyLogin() {
    const userToken = getToken();
    return userToken && userToken.address;
}