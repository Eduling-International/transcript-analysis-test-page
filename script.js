async function analyze() {
  try {
    // clean table
    document
      .querySelectorAll("#analysis-table > tbody > tr")
      .forEach((item) => item.remove());

    const txt_area = document.getElementById("transcript");
    if (txt_area) {
      const value = String(txt_area.value.trim());
      if (value.length > 0) {
        // call api
        const response = await fetch(
          "https://api.develop.eduling.org/api/v1/vocabulary-analysis/test/analyze-text",
          {
            method: "POST",
            body: JSON.stringify({
              Transcript: value,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // success
        const resJson = await response.json();
        // parse to table
        console.log(resJson?.HighFrequency)
        let highFreqMap = "", middleFreqMap = "", lowFreqMap = "", unknownWord = "";
        if (resJson?.HighFrequency && resJson?.HighFrequency?.length > 0) {
            resJson.HighFrequency.forEach((item) => {
                highFreqMap = highFreqMap.concat(`${item.Occurrences} - ${item.Words.join(",")}\n`)
            })
        }
        if (resJson?.MiddleFrequency && resJson?.MiddleFrequency?.length > 0) {
            resJson.MiddleFrequency.forEach((item) => {
                middleFreqMap = middleFreqMap.concat(`${item.Occurrences} - ${item.Words.join(",")}\n`)
            })
        }
        if (resJson?.LowFrequency && resJson?.LowFrequency?.length > 0) {
            resJson.LowFrequency.forEach((item) => {
                lowFreqMap = lowFreqMap.concat(`${item.Occurrences} - ${item.Words.join(",")}\n`)
            })
        }
        if (resJson?.UnknownWord && resJson?.UnknownWord?.length > 0) {
            resJson.UnknownWord.forEach((item) => {
                unknownWord = unknownWord.concat(`${item.Occurrences} - ${item.Words.join(",")}\n`)
            })
        }
        let table = document.getElementById("analysis-table");
        let row = table.insertRow(-1); // insert at the end of the table

        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);

        cell1.innerHTML = highFreqMap.replace(/\n/g, "<br>");
        cell2.innerHTML = middleFreqMap.replace(/\n/g, "<br>");
        cell3.innerHTML = lowFreqMap.replace(/\n/g, "<br>");
        cell4.innerHTML = unknownWord.replace(/\n/g, "<br>");

        window.alert("Success");
      }
    }
  } catch (error) {
    window.alert(JSON.stringify(error))
    throw error
  }
}
