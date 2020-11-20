export class StorageUtils {
  public static login(username: string, password: string) {
    localStorage.setItem("CL_API_USERNAME", username);
    localStorage.setItem("CL_API_TOKEN", password);
  }

  public static logout() {
    localStorage.removeItem("CL_API_USERNAME");
    localStorage.removeItem("CL_API_TOKEN");
  }

  public static getLoginData() {
    const loginData: { username: string; password: string } = {
      username: localStorage.getItem("CL_API_USERNAME") || "",
      password: localStorage.getItem("CL_API_TOKEN") || "",
    };
    return loginData;
  }

  public static isLoggedIn() {
    const loginData = StorageUtils.getLoginData();
    return loginData.username.length >= 1 || loginData.password.length >= 1;
  }

  public static saveAuthorName(author: string) {
    localStorage.setItem("CL_API_AUTHOR", author);
  }

  public static getAuthorName() {
    return localStorage.getItem("CL_API_AUTHOR") || "";
  }
}
