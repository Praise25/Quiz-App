const results = await axios
    .get(
      "https://opentdb.com/api.php?amount=10&category=15&difficulty=easy&type=multiple"
    )
    .then((res) => {
      return res.data.results;
    })
    .catch((e) => {
      console.log("Error retrieving quiz questions...");
    });