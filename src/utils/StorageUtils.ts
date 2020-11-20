export class StorageUtils {
  public static login(username: string, password: string, name: string) {
    localStorage.setItem("CL_API_USERNAME", username);
    localStorage.setItem("CL_API_TOKEN", password);
    localStorage.setItem("CL_API_NAME", name);
  }

  public static logout() {
    localStorage.removeItem("CL_API_USERNAME");
    localStorage.removeItem("CL_API_TOKEN");
    localStorage.removeItem("CL_API_NAME");
  }

  public static getLoginData() {
    const loginData: { username: string; password: string } = {
      username: localStorage.getItem("CL_API_USERNAME") || "",
      password: localStorage.getItem("CL_API_TOKEN") || "",
    };
    return loginData;
  }

  public static getName() {
    return localStorage.getItem("CL_API_NAME");
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
