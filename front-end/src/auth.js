import axios from "axios";
import Cookies from "js-cookie";

// Test login URL
const loginUrl = "http://localhost:8080/authenticate";
// const loginUrl = "http://blogservice.herokuapp.com/api/login";
// const account_username = "demo_1"; // HARD CODE USERNAME FOR TESTING

class Auth {
  constructor() {
    this.role = null;
    this.username = null;
  }

  async login(username, password, role, callback) {
    const user = { username, password, role };
    const loginRequest = async (callback) => {
      try {
        const { data } = await axios.post(loginUrl, user);

        // Store in cookies
        const expiresInSixMins = 60 * 60 * 100;
        const expiresInOneHour = 60 * 60 * 1000;
        const cookiesExpire = new Date(new Date().getTime() + expiresInOneHour);

        Cookies.set("access_token", data.jwt, { expires: cookiesExpire });
        Cookies.set("role", role, { expires: cookiesExpire });
        Cookies.set("username", data.username, { expires: cookiesExpire });
        // Call the cb function
        callback();
        return true;
      } catch (error) {
        // console.log("error: ", error.response.status);
        return false;
      }
    };

    const loginSuccess = await loginRequest(callback);
    return loginSuccess;
  }

  /**
   * Remove access_token from Cookies and log the user out
   * @param {function} cb
   */
  logout(cb) {
    this.username = null;
    this.role = null;
    // Clear local storage and cookies
    // localStorage.clear();
    Cookies.remove("access_token");
    Cookies.remove("role");
    Cookies.remove("username");
    cb();
  }

  /**
   * Check whether or not the access_token is
   * still valid
   */
  isAuthenticated() {
    return !!Cookies.get("access_token");
  }

  /**
   * Return the role of the currently logged in user
   */
  getRole() {
    if (this.isAuthenticated()) {
      this.role = Cookies.get("role");
      return this.role;
    }
    return null;
  }

  /**
   * Return the username of the currently logged in user
   */
  getUsername() {
    return Cookies.get("username");
  }
}

export default new Auth(); // Export an instance of Auth
