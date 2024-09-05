# Icarus

  Icarus is an adaptive learning platform designed to help neurodiverse students improve their attention span and focus by formatting web text and tracking online behavior.

## Features

- Text Formatting for Focus
- Adjust boldness, saccades interval, opacity, text color, and line height.
- Uses saccades and Pomodoro techniques to improve readability and focus.

**Content Summarization with Gemini API**

  - Highlight text and get instant summaries displayed on the same page.

**Attention Score Tracking**

- Tracks time spent on distracting vs. productive websites.

- Points deducted for time on media sites (e.g., YouTube, Instagram).

- Points awarded for time on educational sites (e.g., Wikipedia, Udemy).

- Daily scores are recorded and reset, tracking performance over time.

**Machine Learning for Progress Assessment**

- A KSVM model analyzes weekly score data to evaluate attention span improvement or deterioration.

- Achieved 96% accuracy from initial test data.

**Faculty/Parent Reports**

- Weekly progress is sent via webhooks to parents or faculty.
## Usage

1. Add the web extension to your browser.
2. Customize text formatting options as needed.
3. Use the highlight feature to summarize content.
4. View and track attention scores for daily analysis.

## Current Issues

1. **Webhooks Optimization**: Need to optimize and integrate a cloud database.
2. **HTML Updates with Gemini API**: API reads data but struggles to update the HTML dynamically.
3. **Cross-Browser Features**: Issues with implementing full-screen and pinning features across different browsers.

## Future Plans

1. **Dashboard** for faculty/parents to track student progress and behavior.
2. **Live Tracking** of students for real-time performance comparison.
3. **Machine Learning Upgrade** to Random Forest classification once more data is collected.

## Installation Guide:

1. Download the repository by opening terminal and type the following in order:
    
    - cd Desktop
    - git clone https://github.com/vikrant500/Icarus_HackX24.git
    
2. Open Chrome and click on Extentions -> Manage Extentions, and turn Developer mode On at the top right.
    
3. Click on Load Unpacked from Developer mode drop down.
    
4. Select the Icarus folder from your Desktop and enable it.
    
5. open a page and use the extension