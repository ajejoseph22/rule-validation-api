export interface IntroductoryObjectData {
  name: string;
  github: string;
  email: string;
  mobile: string;
}

export interface IntroductoryObject {
  message: "My Rule-Validation API";
  status: "success";
  data: IntroductoryObjectData;
}
