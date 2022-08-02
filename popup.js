$(document).ready(() => {
  const clipboardbtn = document.querySelector("#clipboard");

  chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
    const tabUrl = tab[0].url;
    console.log("tab0", tab[0].id);
    const params = getSearchParams(tabUrl);
    if (
      tabUrl?.startsWith(VETRELIEF_ADMIN_PAGE) &&
      params?.page === "jobs" &&
      params?.sub === "detail" &&
      params?.id
    ) {
      clipboardbtn.disabled = false;
    } else {
      clipboardbtn.disabled = true;
    }
  });

  const handleCopyTemplate = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
      console.log("tab0", tab[0].id);

      chrome.tabs.sendMessage(
        tab[0].id,
        FETCH_JOB_DATA,
        // ...also specifying a callback to be called
        //    from the receiving end (content script).
        (res) => {
          navigator.clipboard.writeText(
            buildTemplate({
              jobId: res.jobId,
              email: res.hospitalEmail,
              name: res.hospitalName,
            })
          );
          clipboardbtn.innerHTML = "Copied";
        }
      );
    });
  };

  clipboardbtn.addEventListener("click", handleCopyTemplate, false);
});

function getSearchParams(url, key) {
  var params = {};
  url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (s, key, value) {
    params[key] = value;
  });
  return key ? params[key] : params;
}

function buildTemplate({ jobId, email, name }) {
  return `Email Address: ${email}
Hello ${name},
You are receiving this email because your account has an active Permanent Job posted, open to bids from veterinarians. (Job ID#${jobId})



Please click on the link below to complete payment of $2.99/month to continue your standard Permanent Job posting. There is no charge to post relief jobs. You do not need a Paypal account to submit payment via a credit or debit card. You may cancel by texting or emailing us.



Link to submit payment for Standard Permanent Job Post:
https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-9G851404VD191491FMKURGWQ



Alternatively, you may like to consider running a Graphic Advertisement for your open permanent position. Your hospital's Graphic Ad will display on all doctors (licensed in your state) homepages, job search pages, bid pages. This feature is being offered at $135/month. FREE ad design and revisions by VetRelief.com.



Link to submit payment for Graphic Advertisement for Permanent Job Post: https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-64F53695HL285602CMKURF5A



Thank you,
VetRelief.com
`;
}
