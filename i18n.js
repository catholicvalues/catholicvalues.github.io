"use strict";

const setCookie = (name, value, exp) => {
  const date = new Date();
  date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);
  document.cookie =
    name + "=" + value + ";expires=" + date.toUTCString() + ";path=/";
};

const getCookie = (name) => {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    if (cookie.startsWith(name)) {
      const chosenCookie = cookie.split("=");
      return chosenCookie[1];
    }
  }
};

const langPicker = document.getElementById("langPicker");
const langElements = document.querySelectorAll("[data-i18n]");
let userLang = getCookie("lang") || navigator.language;

const l10nList = {};

const addl10n = (code, data) => {
  const opt = document.createElement("option");
  opt.setAttribute("value", code);
  opt.innerText = data.language;
  if (!(opt in langPicker.options)) {
    langPicker.add(opt);
  }
  l10nList[code] = data;
  if (code === userLang) {
    langPicker.value = code;
  }
};

const showTranslation = async (code) => {
  langElements.forEach((element) => {
    const value = element.getAttribute("data-i18n");
    element.innerHTML = l10nList[code][value];
  });
};

const getTranslation = async (code) => {
  const url = `./i18n/${code}.json`;
  await fetch(url)
    .then((response) => response.json())
    .then((data) => addl10n(code, data))
    .catch((err) => console.log(err));
};

async function loadi18n() {
  return Promise.all([
    getTranslation("ko")
  ])
    .then(() => {
      if (!(userLang in l10nList)) {
        userLang = "ko";
      }
      showTranslation(userLang);
      if (langPicker) {
        langPicker.onchange = () => {
          setCookie(
            "lang",
            langPicker.options[langPicker.selectedIndex].value,
            7
          );
          window.location.reload();
        };
      }
    });
}
