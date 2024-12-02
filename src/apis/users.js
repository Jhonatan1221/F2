import axios from "axios";

export const getUser = async (userId) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACK_API}/users/${userId}`
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error getting user: ", error);
  }
};
