const yesBtn = document.querySelector(".yes-btn");
const noBtn = document.querySelector(".no-btn");
const question = document.querySelector(".question");
const gif = document.querySelector(".gif");
const questionId = document.querySelector("#question");
 
let successText = "Cảm ơn bé Thi đã say 'Yes'";

const handleButtonClick = async (type) => {
  try {
    // Update the UI based on the action
    if (type === "incrementYes") {
      question.innerHTML = successText;
      gif.src = "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGI1cW5wMWhpaDF5b3pjdTF0OHZrcHJvaGkzOHJteDhmd245OGRnZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Vuw9m5wXviFIQ/giphy.gif";
    } else if (type === "incrementNo") {
      moveNoButton();
    }

    // Fetch the current data from the server
    const data = await buildData(type);

    // Send the updated data to the server
    await sendDataToServer(data);
  } catch (error) {
    console.error("Error handling button click:", error);
  }
};

// Function to move the "No" button to a random position within the wrapper
const moveNoButton = () => {
  const wrapper = document.querySelector(".wrapper");
  const wrapperRect = wrapper.getBoundingClientRect();
  const noBtnRect = noBtn.getBoundingClientRect();

  const maxX = wrapperRect.width - noBtnRect.width;
  const maxY = wrapperRect.height - noBtnRect.height;

  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);

  noBtn.style.position = "absolute";
  noBtn.style.left = randomX + "px";
  noBtn.style.top = randomY + "px";
};

// Event listeners for button clicks
yesBtn.addEventListener("click", () => handleButtonClick("incrementYes"));
noBtn.addEventListener("click", () => handleButtonClick("incrementNo"));

const fetchQuestionData = async () => {
  try {
    const requestOptions = { method: "GET", redirect: "follow" };
    const response = await fetch("https://6766d367410f84999658ac81.mockapi.io/api/v1/data/1", requestOptions);
    const result = await response.json();
    questionId.innerHTML = result.question;
    successText = result.successText;
  } catch (error) {
    console.error("Error fetching question data:", error);
  }
};

fetchQuestionData();

// Function to send data to the server
async function sendDataToServer(data) {
  try {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const response = await fetch("https://6766d367410f84999658ac81.mockapi.io/api/v1/yes-or-no", requestOptions);
    const result = await response.json();
    console.log("Data sent to server successfully:", result);
  } catch (error) {
    console.error("Error sending data to server:", error);
  }
}


async function buildData(type) {
  const currentTimestampMs = Date.now();

  try {
    // Lấy dữ liệu hiện tại từ API
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const response = await fetch("https://6766d367410f84999658ac81.mockapi.io/api/v1/yes-or-no/1", requestOptions);
    const currentData = await response.json();

    // Thu thập headers của thiết bị
    const deviceHeaders = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled,
    };

    const headersStringified = JSON.stringify(deviceHeaders);

    // Xây dựng dữ liệu mới dựa trên dữ liệu hiện tại
    const data = {
      lastDateYes: currentData.lastDateYes || currentTimestampMs,
      lastDateNo: currentData.lastDateNo || currentTimestampMs,
      yes: currentData.yes || 0,
      no: currentData.no || 0,
      headers: headersStringified, // Headers thiết bị stringify
      isYesLast: currentData.isYesLast || false,
      id: currentData.id || 0,
    };

    // Tùy chỉnh dữ liệu theo type nếu cần
    if (type === "incrementYes") {
      data.yes += 1;
      data.isYesLast = true;
      data.lastDateYes = currentTimestampMs;
    } else if (type === "incrementNo") {
      data.no += 1;
      data.isYesLast = false;
      data.lastDateNo = currentTimestampMs;
    }

    // Gửi dữ liệu mới lên server
    await sendDataToServer(data);

    return data;
  } catch (error) {
    console.error("Error fetching current data:", error);
    return null; // hoặc giá trị mặc định trong trường hợp lỗi
  }
}

async function sendDataToServer(data) {
  try {
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const response = await fetch("https://6766d367410f84999658ac81.mockapi.io/api/v1/yes-or-no/1", requestOptions);
    const result = await response.json();
    console.log("Data sent to server successfully:", result);
  } catch (error) {
    console.error("Error sending data to server:", error);
  }
}
