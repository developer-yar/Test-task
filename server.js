const express = require("express");
var cors = require("cors");
const app = express();
const port = 8080;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.post("/api/data", (req, res) => {
  const { name, phone, email, message } = req.body;

  const isValidEmail =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu.test(
      req.body.email
    );

  if (!name || !phone | !email | !message | !isValidEmail) {
    const error = {
      status: "error",
      fields: {},
    };

    const formatKey = (key) =>
      `input${key[0].toLocaleUpperCase() + key.slice(1)}`;

    Object.keys(req.body).forEach((key) => {
      if (key === "email" && !isValidEmail)
        error.fields[formatKey("email")] = "Некорректный формат email";
      if (!req.body[key]) {
        let fieldName = "";
        switch (key) {
          case "name":
            fieldName = "Имя не должно";
            break;
          case "email":
            fieldName = "Email не должен";
            break;
          case "phone":
            fieldName = "Телефон не должен";
            break;
          case "message":
            fieldName = "Сообщение не должно";
            break;
        }

        error.fields[formatKey(key)] = `${fieldName} быть пустым`;
      }
    });
    res.status(400).send(error);
  } else {
    const success = {
      status: "success",
      msg: "Ваша заявка успешно отправлена",
    };
    res.json(success);
  }
});

app.listen(port, () => {
  console.log(`The server is running on http://localhost:${port}`);
});
