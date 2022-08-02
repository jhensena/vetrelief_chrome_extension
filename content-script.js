function fetchJobData() {
  const jobData = document.querySelectorAll('#main_content_Admin table:nth-of-type(2) tr:nth-of-type(2) td');
  // const jobUrl = jobData[0].innerHTML;
  const jobId = jobData[0].childNodes[0].innerHTML;
  const hospitalEmail = jobData[3].innerHTML;
  // const hospitalNameWithLink = jobData[4].innerHTML;
  let hospitalName = jobData[4].childNodes[0]?.textContent;
  hospitalName = hospitalName?.substring(0, hospitalName.length - 2);

  return {
    jobId, hospitalEmail, hospitalName,
  };
}

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if (msg === FETCH_JOB_DATA) {
    const jobData = fetchJobData();
    response(jobData);
  }
});
