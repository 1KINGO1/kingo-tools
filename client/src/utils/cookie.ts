export const cookieService = {

  getCookie(name: string) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  },

  setCookie(name: string, value: string, options: any = {}) {

    options = {
      path: '/',
      ...options,
      expires: (new Date(Date.now() + 86400e3 * 7 * 4 * 12)).toUTCString()
    };

    if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
      updatedCookie += "; " + optionKey;
      let optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += "=" + optionValue;
      }
    }

    document.cookie = updatedCookie;
  },

  deleteCookie(name: string) {
    this.setCookie(name, "", {
      'max-age': -1
    })
  }
}