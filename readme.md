# CC GPA Calculator

This is the source for my CC GPA Calculator extension, which displays your letter grades and GPA on your progress page, while also allowing you to simulate upcoming assignments and exams.

## Features

- Auto updates for any new versions
- Current, **accurate** GPA according to CC's grading standard
- Simulating exams/quarters so one could see how they would have to do to achieve certain final grades
  - "What do I need to get on my final to get an A- this semester?" or "If I get a 92 this quarter and a 90 on the exam what will my transcript have?"
- Simulating individual assignments
    - "If I study a lot and get 100 on this next test, do I have a shot of finishing this quarter with an A?" or "How much is the 2 points of extra credit from bathroom passes going to help me?
- Seeing how different colleges might look at your GPA
    - "At Michigan for example A-, A, and A+ are all 4.0 - how does that change my standing?"
- A lot of shortcuts to make it easier to get to stuff
    - Just type in "lunch" in a popup to see the lunch menu instead of scrolling on the resources screen and loading 4 different sites, "chem/topics" gets you to the topics page of your chemistry class, etc.
- A few different patches that try to resolve some of the common issues MyCC has had automatically ("error loading context")

## Install via Chrome Web Store via 3rd party (Recomended)
Someone has uploaded the source to the chrome web store **(If that was you, thank you and please reach out I would like to get in touch).** 
Dowload it [here](https://chromewebstore.google.com/detail/catholic-central-gpa-calc/akbakffdecfdahaciiiniiaopllhmppj?hl=en)

Note that this version still auto updates and you will have access to all new patches

## Install (Dev mode) (Not recomended)
If you just want to use the extension, follow these steps:

1. Go to the [releases](https://github.com/Bagel03/CC-GPA-Calculator/releases) tab, and click on the latest release.
2. Download the `cc-gpa-calc.zip` file located under _Assets_.
3. Unzip that folder, inside there should be `index.js` and `manifest.json`
4. Go to the chrome extensions page. You can get there by either
    - Going to `chrome://extensions`
    - Clicking on the puzzle piece icon next to the search bar, then clicking `Manage extensions`
5. Click on `Load Unpacked`
6. Navigate to the **UNZIPPED** folder using the popup, and click `select folder`


